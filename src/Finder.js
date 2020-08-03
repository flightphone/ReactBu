import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Drawer from '@material-ui/core/Drawer';


import { baseUrl, openMap, mainObj } from './App';
import DataGrid from './DataGrid';
import DataFilter from './DataFilter';
import Editor from './Editor';
import Pagination from './Pagination';

import MenuIcon from '@material-ui/icons/Menu';
import FilterListIcon from '@material-ui/icons/FilterList';
import CodeIcon from '@material-ui/icons/Code';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginLeft: theme.spacing(2.5),
    },

    menuButton: {
        marginRight: theme.spacing(2),
    },
    offset: theme.mixins.toolbar,
    title: {
        flexGrow: 1,
    },
    fixheight: {
        height: "100vh",
        overflow: "auto",
    },
}));


function Finder(props) {
    const classes = useStyles();
    const [load, setLoad] = useState(true);
    const [stateDrawer, setStateDrawer] = useState(false);
    const [mode, setMode] = useState("grid");
    const [current, setCurrent] = useState(-1);

    //Достаточно просто вызвать setCurrent, что бы запустить процесс отрисовки всего компонента
    //openMap.get(props.id).data.setCurrent = handleCurrent;

    const visible = props.visible;
    const id = props.id;
    const IdDeclare = props.params;

    useEffect(() => { getData(); }, []);

    async function getData() {

        const url = baseUrl + "React/FinderStart?id=" + IdDeclare;
        const response = await fetch(url,
            {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'omit' // include, *same-origin, omit
            }
        );
        const data = await response.json();
        if (data.Error) {
            openMap.get(id).data.Descr = data.Error;
            setCurrent(current + 1);
        }
        else {
            let v = openMap.get(id);
            v.data = data;
            setLoad(false);
        }
    }

    function Descr() {
        if (openMap.get(id).data.Descr)
            return openMap.get(id).data.Descr;
        else
            return ("Загрузка...");
    }


    function renderTab() {
        if (visible) {
            return <DataGrid columns={openMap.get(id).data.Fcols} rows={openMap.get(id).data.MainTab} id={id} />
        }

    }


    function renderFilter() {
        if (visible) {
            return <DataFilter columns={openMap.get(id).data.Fcols} />
        }
    }

    const toggleDrawer = (open) => (event) => {
        setStateDrawer(open);
    };



    async function onChangePage(event, p) {
        const url = baseUrl + "React/FinderStart?id=" + IdDeclare + "&mode=data&page=" + (p + 1).toString();
        const response = await fetch(url,
            {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'omit' // include, *same-origin, omit
            }
        );
        const data = await response.json();
        if (data.Error) {
            openMap.get(id).data.Descr = data.Error;
            setStateDrawer(false);
        }
        else {
            let v = openMap.get(id);
            v.data.MainTab = data.MainTab;
            v.data.page = p + 1;
            setStateDrawer(false);
        }
    }


    function setFilter() {
        setMode("grid");
    }

    const addinit = () => {
        if (props.addinit && !load)
            return (props.addinit());
    }

    const renderEditBut = () => {
        if (load)
            return;
        if (openMap.get(id).data.EditProc) {
            return (

                <React.Fragment>
                    <IconButton className={classes.menuButton} onClick={() => { add(); }}>
                        <AddIcon />
                    </IconButton>
                    <IconButton className={classes.menuButton} onClick={() => { edit(); }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton className={classes.menuButton}>
                        <DeleteIcon />
                    </IconButton>
                </React.Fragment>
            );
        }
    }
    const save = () => {
        alert("save");
        setMode("grid");
    }

    const closeEditor = () => {
        setMode("grid");
    }

    const edit = () => {
        setMode("edit");
    }

    const add = () => {
        setMode("add");
    }

    const renderEditor = () => {
        if (load)
            return;
        if (openMap.get(id).data.EditProc) {
            return (
                <div
                    hidden={!(mode == "edit" || mode == "add")}
                    className={classes.fixheight}
                >
                    <Editor descr="Новая запись" save={save} closeEditor={closeEditor} id = {id}/>
                </div>
            );
        }
    }

    return (
        <React.Fragment>
            <Drawer anchor="top" open={stateDrawer} onClose={toggleDrawer(false)}>
                <Pagination id={id} onChangePage={onChangePage} />
            </Drawer>
            <div
                hidden={!visible}
                className={classes.fixheight}
            >
                <div
                    hidden={mode != "grid"}
                    className={classes.fixheight}
                >
                    <AppBar position="fixed">
                        <Toolbar>
                            <Tooltip title="Меню">
                                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => { mainObj.showMenu(); }}>
                                    <MenuIcon />
                                </IconButton>
                            </Tooltip>
                            <Typography variant="h6" className={classes.title}>
                                {Descr()}
                            </Typography>

                            {renderEditBut()}
                            {(load) ? <span></span> :
                                <React.Fragment>
                                    <IconButton onClick={() => { setMode("filter"); }} className={classes.menuButton}>
                                        <FilterListIcon />
                                    </IconButton>

                                    <Tooltip title="Страницы" >
                                        <IconButton className={classes.menuButton} onClick={() => { setStateDrawer(true); }}>
                                            <CodeIcon />
                                        </IconButton>
                                    </Tooltip>
                                </React.Fragment>
                            }
                            {addinit()}
                        </Toolbar>
                    </AppBar>
                    <div className={classes.offset} />
                    {(load) ? <span></span> : renderTab()}
                </div>

                <div
                    hidden={mode != "filter"}
                    className={classes.fixheight}
                >
                    <AppBar position="fixed">
                        <Toolbar>
                            <Typography variant="h6" className={classes.title}>
                                {Descr()} (фильтровка и сортировка)
                            </Typography>

                            <IconButton onClick={() => { setFilter(); }}>
                                <CheckIcon />
                            </IconButton>


                            <IconButton onClick={() => { setMode("grid"); }}>
                                <ClearIcon />
                            </IconButton>

                        </Toolbar>
                    </AppBar>
                    <div className={classes.offset} />
                    {(load) ? <span></span> : renderFilter()}
                </div>

                {renderEditor()}
            </div>
        </React.Fragment>);
}

export default Finder;