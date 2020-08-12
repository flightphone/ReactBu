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
import InputLabel from '@material-ui/core/InputLabel';


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
    const [action, setAction] = useState(0);
    const id = props.id;

    function textChange(event, index) {
        openMap.get(id).data.WorkRow[index] = event.target.value;
        setAction(action + 1);
    }

    const sortChange = (event, column) => {
        column.joinRow.FindConrol.MainTab.map((row) => {
            if (row[column.joinRow.keyField] == event.target.value) {
                for (let s in column.joinRow.fields) {
                    openMap.get(id).data.WorkRow[column.joinRow.fields[s]] = row[s];
                }
                setAction(action + 1);
            }
        })

    }

    const renderField = (column, index) => {
        if (column.joinRow != null) {
            if (column.joinRow.classname == "Bureau.GridCombo") {
                return (
                    <React.Fragment>
                        <InputLabel htmlFor={id + "_" + index.toString() + "_" + column.FieldName + "_field"}>{column.FieldCaption}</InputLabel>
                        <Select native style={{ width: "95vw" }}
                            inputProps={{
                                name: id + "_" + index.toString() + "_" + column.FieldName + "_field",
                                id: id + "_" + index.toString() + "_" + column.FieldName + "_field",
                            }}
                            value={openMap.get(id).data.WorkRow[column.joinRow.valField]}
                            onChange={(event) => sortChange(event, column)}
                        >
                            {column.joinRow.FindConrol.MainTab.map((row) => {
                                return (<option value={row[column.joinRow.keyField]}>{row[column.joinRow.FindConrol.DispField]}</option>);
                            })}

                        </Select>
                    </React.Fragment>
                );
            }
        }
        return (
            <TextField label={column.FieldCaption} key={column.FieldName}
                value={openMap.get(id).data.WorkRow[column.FieldName]}
                style={{ width: "95vw" }}
                onChange={(event) => textChange(event, column.FieldName)}
            />
        );
    }


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
                            <TableRow>
                                <TableCell>
                                    {renderField(column, index)}
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