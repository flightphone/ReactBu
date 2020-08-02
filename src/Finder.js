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

import MenuIcon from '@material-ui/icons/Menu';
import FilterListIcon from '@material-ui/icons/FilterList';
import CodeIcon from '@material-ui/icons/Code';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';



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


    //const [Descr, setDescr] = useState("Загрузка...");
    const [load, setLoad] = useState(true);
    const [stateDrawer, setStateDrawer] = useState(false);
    //const [page, setPage] = useState(0);
    //const [count, setCount] = useState(0);
    const [mode, setMode] = useState("grid");

    const [current, setCurrent] = useState(-1);

    /*
    const [current, setCurrent] = useState(-1);
    function handleCurrent(r) {
        setCurrent(r);
    }
    */
    //Достаточно просто вызвать setCurrent, что бы запустить процесс отрисовки всего компонента
    //openMap.get(props.id).data.setCurrent = handleCurrent;




    //let Descr = "Загрузка...";
    //let count = 0;
    //let page = 0;


    const visible = props.visible;
    const id = props.id;
    const IdDeclare = props.params;


    function Descr() {
        if (openMap.get(id).data.Descr)
            return openMap.get(id).data.Descr;
        else
            return ("Загрузка...");
    }

    function count() {
        if (openMap.get(id).data.TotalTab)
            return openMap.get(id).data.TotalTab[0].n_total;
        else
            return 0;
    }

    function page() {
        if (openMap.get(id).data.page)
            return (openMap.get(id).data.page - 1);
        else
            return 0;
    }

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
            //Descr = data.Descr;
            //count = data.TotalTab[0].n_total;
            setLoad(false);

            //openMap.get(props.id).data.setCurrent = handleCurrent;
            //Для запуска перерисовки
            //v.data.setCurrent = handleCurrent;
        }
    }

    function renderTab() {
        if (visible) {
            //alert(IdDeclare);
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

    const rowsPerPage = 30;

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

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page() - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page() + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count() / rowsPerPage) - 1));
    };

    function setFilter() {
        setMode("grid");
    }

    const addinit = () => {
        if (props.addinit && !load)
            return (props.addinit());
    }
    return (
        <React.Fragment>
            <Drawer anchor="top" open={stateDrawer} onClose={toggleDrawer(false)}>
                <Toolbar>
                    <Typography className={classes.title}>
                        {page() * rowsPerPage + 1} - {Math.min((page() + 1) * rowsPerPage, count())} из {count()}
                    </Typography>
                    <IconButton
                        onClick={handleFirstPageButtonClick}
                        disabled={page() === 0}
                        aria-label="first page"
                    >
                        <FirstPageIcon />
                    </IconButton>
                    <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                        <KeyboardArrowLeft />
                    </IconButton>
                    {page() + 1} из {Math.max(0, Math.ceil(count() / rowsPerPage) - 1) + 1}
                    <IconButton
                        onClick={handleNextButtonClick}
                        disabled={page() >= Math.ceil(count() / rowsPerPage) - 1}
                        aria-label="next page"
                    >
                        <KeyboardArrowRight />
                    </IconButton>
                    <IconButton
                        onClick={handleLastPageButtonClick}
                        disabled={page() >= Math.ceil(count() / rowsPerPage) - 1}
                        aria-label="last page"
                    >
                        <LastPageIcon />
                    </IconButton>
                </Toolbar>
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

                            <IconButton onClick={() => { setMode("filter"); }}>
                                <FilterListIcon />
                            </IconButton>

                            <Tooltip title="Страницы">
                                <IconButton onClick={() => { setStateDrawer(true); }}>
                                    <CodeIcon />
                                </IconButton>
                            </Tooltip>
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
            </div>
        </React.Fragment>);
}

export default Finder;