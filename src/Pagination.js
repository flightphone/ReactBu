import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Drawer from '@material-ui/core/Drawer';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';


import { openMap } from './App';

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

function Pagination(props) {
    const classes = useStyles();
    const id = props.id;
    const editid = props.editid;

    const OpenMapData = () => {
        if (editid == null)
            return openMap.get(id).data;
        else 
            return openMap.get(id).data.ReferEdit.Editors[editid].joinRow.FindConrol;
    }

    function count() {
        if (OpenMapData().TotalTab)
            return OpenMapData().TotalTab[0].n_total;
        else
            return 0;
    }

    function page() {
        if (OpenMapData().page)
            return (OpenMapData().page - 1);
        else
            return 0;
    }

    const rowsPerPage = 30;

    const handleFirstPageButtonClick = (event) => {
        props.onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        props.onChangePage(event, page() - 1);
    };

    const handleNextButtonClick = (event) => {
        props.onChangePage(event, page() + 1);
    };

    const handleLastPageButtonClick = (event) => {
        props.onChangePage(event, Math.max(0, Math.ceil(count() / rowsPerPage) - 1));
    };

    return (
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
    );
}

export default Pagination;