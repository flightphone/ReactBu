import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Drawer from '@material-ui/core/Drawer';


import { baseUrl, openMap, mainObj, prodaction } from './App';
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
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DetailsIcon from '@material-ui/icons/Details';



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

    const OpenMapData = () =>
    {
        return openMap.get(id).data;
    }

    const OpenMapId = () => {
        return openMap.get(id);
    }

    async function getData() {
        const url = baseUrl + "React/FinderStart";
        let bd = new FormData();
        bd.append("id", IdDeclare);

        let mid = OpenMapId(); 
        if (mid.SQLParams)
        {
            bd.append("SQLParams", JSON.stringify(mid.SQLParams));
        }            
        if (mid.TextParams)
            bd.append("TextParams", JSON.stringify(mid.TextParams));
    

        const response = await fetch(url,
            {
                method: 'POST',
                mode: (prodaction)?'no-cors':'cors',
                cache: 'no-cache',
                credentials: (prodaction)?'include':'omit',
                //headers: { "Content-Type": "application/json" },
                body: bd
            }
        );

        const data = await response.json();
        if (data.Error) {
            //OpenMapData().Descr = data.Error;
            setCurrent(current + 1);
            alert(data.Error);
        }
        else {
            data.curRow = 0;
            let v = OpenMapId();
            v.data = data;
            setLoad(false);
        }
    }

    function Descr() {
        if (OpenMapData().Descr)
            return OpenMapData().Descr;
        else
            return ("Загрузка...");
    }


    function renderTab() {
        if (visible) {
            return <DataGrid columns={OpenMapData().Fcols} rows={OpenMapData().MainTab} id={id} />
        }

    }


    function renderFilter() {
        if (visible) {
            return <DataFilter columns={OpenMapData().Fcols} />
        }
    }

    const toggleDrawer = (open) => (event) => {
        setStateDrawer(open);
    };

    async function updateTab() {
        const url = baseUrl + "React/FinderStart";
        let bd = new FormData();
        let mid = OpenMapData(); 
        bd.append("id", IdDeclare);
        bd.append("mode", "data");
        bd.append("page", (mid.page).toString());
        bd.append("Fc", JSON.stringify(mid.Fcols));
        if (mid.SQLParams)
            bd.append("SQLParams", JSON.stringify(mid.SQLParams));

        if (mid.TextParams)
            bd.append("TextParams", JSON.stringify(mid.TextParams));
        const response = await fetch(url,
            {
                method: 'POST',
                mode: (prodaction)?'no-cors':'cors',
                cache: 'no-cache',
                credentials: (prodaction)?'include':'omit',
                body: bd
            }
        );

        const data = await response.json();
        if (data.Error) {
            alert(data.Error);
        }
        else {
            //let v = openMap.get(id);
            mid.MainTab = data.MainTab;
            mid.TotalTab = data.TotalTab;
            mid.page = data.page;
        }
        if (stateDrawer)
            setStateDrawer(false);

        if (mode != "grid");
        setMode("grid");

    }

    function onChangePage(event, p) {
        OpenMapData().page = p + 1;
        updateTab();
    }


    function setFilter() {
        updateTab();
    }

    const addinit = () => {
        if (props.addinit && !load)
            return (props.addinit());
    }

    function csv() {
        const url = baseUrl + "React/csv";
        let bd = new FormData();
        let mid = OpenMapData();
        bd.append("id", IdDeclare);
        bd.append("Fc", JSON.stringify(mid.Fcols));
        if (mid.SQLParams)
            bd.append("SQLParams", JSON.stringify(mid.SQLParams));
        if (mid.TextParams)
            bd.append("TextParams", JSON.stringify(mid.TextParams));

        fetch(url,
            {
                method: 'POST',
                mode: (prodaction)?'no-cors':'cors',
                cache: 'no-cache',
                credentials: (prodaction)?'include':'omit',
                body: bd
            }
        ).then(res=>res.blob()).then( blob => {
            let file = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.setAttribute("download", "data.csv");
            a.click();
          });
    }

    const openDetail = ()=>{
        let mid = OpenMapData();
        if (mid.curRow == null)
            return;
        let rw = mid.MainTab[mid.curRow];
        let val = rw[mid.KeyF];
        let jsstr = '{"' + mid.KeyF + '":"' + val + '"}';
        let obj = {
            Control: Finder,
            Params: mid.KeyValue,
            TextParams : JSON.parse(jsstr),
            data: {}
          }
        let newid = id + "_" + val; 
        mainObj.addform(newid, obj)

    }

    const renderAddBut = () => {
        if (load)
            return;
        return (
            <React.Fragment>
            <Tooltip title="Экспорт в CSV">
                <IconButton className={classes.menuButton} onClick={() => { csv(); }}>
                    <CloudDownloadIcon />
                </IconButton>
            </Tooltip>
            {(OpenMapData().KeyValue)?
                <Tooltip title="Детали">
                    <IconButton className={classes.menuButton} onClick={() => { openDetail(); }}>
                        <DetailsIcon />
                    </IconButton>
                </Tooltip> : ""
            }
            </React.Fragment>
        );

    }

    const renderEditBut = () => {
        return;
        if (load)
            return;
        if (OpenMapData().EditProc) {
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
        if (OpenMapData().EditProc) {
            return (
                <div
                    hidden={!(mode == "edit" || mode == "add")}
                    className={classes.fixheight}
                >
                    <Editor descr="Новая запись" save={save} closeEditor={closeEditor} id={id} />
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
                            {renderAddBut()}
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