import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';


import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import MenuIcon from '@material-ui/icons/Menu';


import { openMap, mainObj } from './App';


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


function Editor(props) {
    const classes = useStyles();
    const [mode, setMode] = useState("edit");
    const id = props.id;
    return (
        <div
            hidden={mode != "edit"}
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
                        {props.descr}
                    </Typography>
                    <IconButton onClick={() => { props.save(); }}>
                        <SaveIcon />
                    </IconButton>
                    <IconButton onClick={() => { props.closeEditor(); }}>
                        <ClearIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div className={classes.offset} />
            <Table size="small">
                <TableBody>

                    {openMap.get(id).data.ReferEdit.Editors.map((column, index) => {
                        return (
                            <TableRow key={column.FieldName}>
                                <TableCell>
                                    <TextField label={column.FieldCaption} style={{ width: "80vw" }} />
                                </TableCell>
                            </TableRow>
                        );
                    })}

                </TableBody>
            </Table>
        </div>
    );
}

export default Editor;