import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { baseUrl, openMap } from './App';
import DataGrid from './DataGrid';
import MenuIcon from '@material-ui/icons/Menu';
import FilterListIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
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
    const [Descr, setDescr] = useState("Загрузка...");
    const [load, setLoad] = useState(true);
    const visible = props.visible;
    const classes = useStyles();
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
            setLoad(false);
        }
    }

    function renderTab() {
        return <DataGrid columns={openMap.get(id).data.Fcols} rows={openMap.get(id).data.MainTab} show={props.show} descr={openMap.get(id).data.Descr} />
        //return <div>{openMap.get(id).data.TotalTab[0].n_total}</div>
    }

    return <div
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
            </Toolbar>
        </AppBar>
        <div className={classes.offset} />
        {(load) ? <span></span> : renderTab()}
    </div>
}

export default Finder;