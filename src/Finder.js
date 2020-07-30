import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Drawer from '@material-ui/core/Drawer';


import { baseUrl, openMap } from './App';
import DataGrid from './DataGrid';

import MenuIcon from '@material-ui/icons/Menu';
import FilterListIcon from '@material-ui/icons/FilterList';
import CodeIcon from '@material-ui/icons/Code';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginLeft: theme.spacing(2.5),
    },
    pag: {
        flexGrow: 1,
        marginLeft: theme.spacing(2.5),
        alignContent: 'right'
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


    const [Descr, setDescr] = useState("Загрузка...");
    const [load, setLoad] = useState(true);
    const [stateDrawer, setStateDrawer] = useState(false);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(200);



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
        if (data.Error)
            setDescr(data.Error);
        else {
            let v = openMap.get(id);
            v.data = data;
            setDescr(data.Descr);
            setCount(data.TotalTab[0].n_total);
            setLoad(false);
        }
    }

    function renderTab() {
        return <DataGrid columns={openMap.get(id).data.Fcols} rows={openMap.get(id).data.MainTab} show={props.show} descr={openMap.get(id).data.Descr} />
        //return <div>{openMap.get(id).data.TotalTab[0].n_total}</div>
    }




    const toggleDrawer = (open) => (event) => {

        setStateDrawer(open);

    };

    const rowsPerPage = 30;
    
    function onChangePage(event, p)
    {
        setPage(p);
        setStateDrawer(false);
    }

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
      };
    
      const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
      };
    
      const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
      };
    
      const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
      };


    return (
    <React.Fragment>
        <Drawer anchor="top" open={stateDrawer} onClose={toggleDrawer(false)}>
        <Toolbar>
                <Typography className={classes.title}>
                    {page * rowsPerPage + 1} - {Math.min((page+1)*rowsPerPage, count)} из {count}
                </Typography>
                <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="first page"
                >
                    <FirstPageIcon />
                </IconButton>
                <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                    <KeyboardArrowLeft />
                </IconButton>
                {page + 1} из {Math.max(0, Math.ceil(count / rowsPerPage) - 1) + 1}
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="next page"
                >
                    <KeyboardArrowRight />
                </IconButton>
                <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
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
            <AppBar position="fixed">
                <Toolbar>
                    <Tooltip title="Меню">
                        <IconButton onClick={() => { props.show(); }}>
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="h6" className={classes.title}>
                        {Descr}
                    </Typography>
                    <Tooltip title="Фильтровка и сортировка">
                        <IconButton aria-label="filter list">
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Страницы">
                        <IconButton onClick={() => { setStateDrawer(true); }}>
                            <CodeIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <div className={classes.offset} />
            {(load) ? <span></span> : renderTab()}
        </div>
    </React.Fragment>);
}

export default Finder;