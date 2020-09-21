import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';


import { baseUrl, openMap, mainObj, prodaction, dateformat } from './App';
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
import SettingsIcon from '@material-ui/icons/Settings';
import MoreIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';







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
    const [stateMenu, setStateMenu] = useState(false);
    const [mode, setMode] = useState("grid");
    const [current, setCurrent] = useState(-1);

    //Достаточно просто вызвать setCurrent, что бы запустить процесс отрисовки всего компонента
    //openMap.get(props.id).data.setCurrent = handleCurrent;

    const visible = props.visible;
    const id = props.id;
    const editid = props.editid;
    const IdDeclare = props.params;
    const filterid = props.filterid;

    useEffect(() => { getData(); }, []);

    const OpenMapData = () => {
        if (editid == null)
            return openMap.get(id).data;
        else
            return openMap.get(id).data.ReferEdit.Editors[editid].joinRow.FindConrol;
    }

    const OpenMapId = () => {
        return openMap.get(id);
    }

    async function getData() {
        if (editid != null) {
            OpenMapData().curRow = 0;
            setLoad(false);
            return;
        }
        const url = baseUrl + "React/FinderStart";
        let bd = new FormData();
        bd.append("id", IdDeclare);

        let mid = OpenMapId();

        if (filterid != null && openMap.get(filterid) != null) {
            let fdat = openMap.get(filterid).data;
            fdat.ReferEdit.SaveFieldList.map((f) => {
                mid.SQLParams["@" + f] = fdat.MainTab[0][f];
            });
        }


        if (mid.SQLParams) {
            bd.append("SQLParams", JSON.stringify(mid.SQLParams));
        }
        if (mid.TextParams)
            bd.append("TextParams", JSON.stringify(mid.TextParams));


        const response = await fetch(url,
            {
                method: 'POST',
                mode: (prodaction) ? 'no-cors' : 'cors',
                cache: 'no-cache',
                credentials: (prodaction) ? 'include' : 'omit',
                //headers: { "Content-Type": "application/json" },
                body: bd
            }
        );

        const data = await response.json();
        if (data.Error) {
            //OpenMapData().Descr = data.Error;
            //setCurrent(current + 1);
            mainObj.alert("Ошибка", data.Error);
        }
        else {
            data.curRow = 0;
            data.WorkRow = {};
            data.ColumnTab.map((column) => {
                data.WorkRow[column] = "";
            });
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
            return <DataGrid columns={OpenMapData().Fcols} rows={OpenMapData().MainTab} id={id} editid={editid} />
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

    const toggleMenu = (open) => (event) => {
        setStateMenu(open);
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
                mode: (prodaction) ? 'no-cors' : 'cors',
                cache: 'no-cache',
                credentials: (prodaction) ? 'include' : 'omit',
                body: bd
            }
        );

        const data = await response.json();
        if (data.Error) {
            mainObj.alert("Ошибка", data.Error);
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
                mode: (prodaction) ? 'no-cors' : 'cors',
                cache: 'no-cache',
                credentials: (prodaction) ? 'include' : 'omit',
                body: bd
            }
        ).then(res => res.blob()).then(blob => {
            let file = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.setAttribute("download", "data.csv");
            a.click();
        });
    }

    const openDetail = () => {
        let mid = OpenMapData();
        if (mid.curRow == null)
            return;
        let rw = mid.MainTab[mid.curRow];
        let val = rw[mid.KeyF];
        let jsstr = {};  // '{"' + mid.KeyF + '":"' + val + '"}';
        jsstr[mid.KeyF] = val;
        let obj = {
            Control: Finder,
            Params: mid.KeyValue,
            TextParams: jsstr, //JSON.parse(jsstr),
            data: {}
        }
        let newid = id + "_" + val;
        mainObj.addform(newid, obj)

    }

    const renderAddBut = () => {
        if (editid != null) {
            return (
                <React.Fragment>
                    <IconButton color="inherit" onClick={() => { props.selectFinder(editid); }}>
                        <CheckIcon />
                    </IconButton>


                    <IconButton color="inherit" onClick={() => { props.clearFinder(); }}>
                        <ClearIcon />
                    </IconButton>
                </React.Fragment>
            )
        }
    }
    const renderAddListBut = () => {
        if (editid != null)
            return;
        if (load)
            return;
        return (
            <React.Fragment>
                <ListItem button onClick={() => { setStateMenu(false); csv(); }}>
                    <ListItemIcon>
                        <CloudDownloadIcon />
                    </ListItemIcon>
                    <ListItemText primary="Экспорт в CSV" />
                </ListItem>

                {
                    (OpenMapData().KeyValue) ? <ListItem button onClick={() => { setStateMenu(false); openDetail(); }}>
                        <ListItemIcon>
                            <DetailsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Детали" />
                    </ListItem> : ""
                }
                {
                    (filterid != null) ? <ListItem button onClick={() => { setStateMenu(false); editSetting(); }}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Параметры" />
                    </ListItem> : ""
                }
            </React.Fragment >
        );

    }


    const renderEditBut = () => {
        if (editid != null)
            return;
        if (load)
            return;
        if (OpenMapData().EditProc) {
            return (

                <React.Fragment>

                    <ListItem button onClick={() => { setStateMenu(false); add(); }}>
                        <ListItemIcon>
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary="Добавить" />
                    </ListItem>

                    <ListItem button onClick={() => { setStateMenu(false); edit(); }}>
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>
                        <ListItemText primary="Редактировать" />
                    </ListItem>

                    <ListItem button onClick={() => { setStateMenu(false); confirmDelete(); }}>
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText primary="Удалить" />
                    </ListItem>
                </React.Fragment>
            );
        }
    }

    const confirmDelete = () => {
        let mid = OpenMapData();
        if (mid.curRow == null)
            return;
        let rw = mid.MainTab[mid.curRow];
        let val = rw[mid.DispField];
        mainObj.confirm(Descr(), "Удалить запись '" + val + "'?", rowDelete)
    }

    const rowDelete = async () => {
        let mid = OpenMapData();
        let SQLParams = {};
        SQLParams[mid.KeyF] = mid.MainTab[mid.curRow][mid.KeyF];
        if (mid.DelProc.toLowerCase().indexOf("_del_1") > -1) {
            SQLParams["AUDTUSER"] = mid.Account;
        }

        const url = baseUrl + "React/exec";
        let bd = new FormData();

        bd.append("EditProc", mid.DelProc);
        bd.append("SQLParams", JSON.stringify(SQLParams));
        bd.append("KeyF", mid.KeyF);

        const response = await fetch(url,
            {
                method: 'POST',
                mode: (prodaction) ? 'no-cors' : 'cors',
                cache: 'no-cache',
                credentials: (prodaction) ? 'include' : 'omit',
                body: bd
            }
        );

        const res = await response.json();
        if (res.message != "OK" && res.message != "Invalid storage type: DBNull.") {
            mainObj.alert("Ошибка", res.message);
            return;
        }

        mid.MainTab.splice(mid.curRow, 1);
        setCurrent(current + 1);
    }

    const save = async () => {

        let data = OpenMapData();
        //default values
        for (let f in data.DefaultValues) {
            data.WorkRow[f] = data.DefaultValues[f];
        }

        for (let f in data.TextParams) {
            data.WorkRow[f] = data.TextParams[f];
        }

        let SQLParams = {};
        data.ReferEdit.SaveFieldList.map((f) => {
            SQLParams[f] = data.WorkRow[f];
        });

        const url = baseUrl + "React/exec";
        let bd = new FormData();

        bd.append("EditProc", data.EditProc);
        bd.append("SQLParams", JSON.stringify(SQLParams));
        bd.append("KeyF", data.KeyF);

        const response = await fetch(url,
            {
                method: 'POST',
                mode: (prodaction) ? 'no-cors' : 'cors',
                cache: 'no-cache',
                credentials: (prodaction) ? 'include' : 'omit',
                body: bd
            }
        );

        const res = await response.json();
        if (res.message != "OK") {
            mainObj.alert("Ошибка", res.message);
            return;
        }
        else {
            if (res.ColumnTab.length == 1) {
                data.WorkRow[data.KeyF] = res.MainTab[0][res.ColumnTab[0]];
            }
            else {
                res.ColumnTab.map((column) => {
                    data.WorkRow[column] = res.MainTab[0][column];
                })
            }

        }




        let row = {};
        if (mode == "edit") {
            let c = data.curRow;
            row = data.MainTab[c];
        }
        data.ColumnTab.map((column) => {
            row[column] = data.WorkRow[column];
        });
        if (mode == "add")
            data.MainTab.push(row);
        setMode("grid");
    }

    const saveSetting = () => {

        let data = openMap.get(filterid).data;
        let row = data.MainTab[0];
        data.ColumnTab.map((column) => {
            row[column] = data.WorkRow[column];
        });

        let mid = OpenMapData();
        data.ReferEdit.SaveFieldList.map((f) => {
            mid.SQLParams["@" + f] = data.MainTab[0][f];
        });
        updateTab();
    }

    const closeEditor = () => {
        setMode("grid");
    }

    const edit = () => {
        let data = OpenMapData();
        data.WorkRow = {};
        let c = data.curRow;
        let row = data.MainTab[c];
        data.ColumnTab.map((column) => {
            data.WorkRow[column] = (row[column] == null) ? "" : row[column];
        });
        data.ReferEdit.Editors.map((column) => {
            if (column.DisplayFormat != "") {
                data.WorkRow[column.FieldName] = dateformat(data.WorkRow[column.FieldName], column.DisplayFormat)
            }
        });

        setMode("edit");
    }

    const editSetting = () => {
        let data = openMap.get(filterid).data;
        data.WorkRow = {};
        let row = data.MainTab[0];
        data.ColumnTab.map((column) => {
            data.WorkRow[column] = (row[column] == null) ? "" : row[column];
        });
        setMode("setting");
    }

    const add = () => {
        let data = OpenMapData();
        data.WorkRow = {};
        data.ColumnTab.map((column) => {
            data.WorkRow[column] = "";
        });
        setMode("add");
    }

    const renderEditor = () => {
        if (editid != null)
            return;
        if (load)
            return;
        let editDescr = "Новая запись";
        if (mode == "edit") {

            let data = OpenMapData();
            let c = data.curRow;
            let row = data.MainTab[c];
            editDescr = "Редактирование";//row[data.DispField]; // + " (редактирование)";
        }
        if (OpenMapData().EditProc) {
            return (
                <div
                    hidden={!(mode == "edit" || mode == "add")}
                    className={classes.fixheight}
                >
                    <Editor descr={editDescr} save={save} closeEditor={closeEditor} id={id} mode={mode} />
                </div>
            );
        }
    }

    const renderSetting = () => {
        if (filterid == null)
            return;
        if (load)
            return;
        let editDescr = Descr() + " (параметры)";
        return (
            <div
                hidden={!(mode == "setting")}
                className={classes.fixheight}
            >
                <Editor descr={editDescr} save={saveSetting} closeEditor={closeEditor} id={filterid} mode={mode} />
            </div>
        );
    }


    return (
        <React.Fragment>
            <Drawer anchor="top" open={stateDrawer} onClose={toggleDrawer(false)}>
                <Pagination id={id} onChangePage={onChangePage} editid={editid} />
            </Drawer>
            <Menu open={stateMenu} onClose={toggleMenu(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <div className={classes.root1}>
                    <List component="nav">
                        {renderEditBut()}
                        {(load) ? <Divider /> :
                            <React.Fragment>
                                <ListItem button onClick={() => { setStateMenu(false); setMode("filter"); }}>
                                    <ListItemIcon>
                                        <FilterListIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Фильтровка, сортировка" />
                                </ListItem>

                                <ListItem button onClick={() => { setStateMenu(false); setStateDrawer(true); }}>
                                    <ListItemIcon>
                                        <CodeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Страницы" />
                                </ListItem>
						</React.Fragment>}
						{renderAddListBut()}
                    </List>
                </div>
            </Menu>
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
                            {(editid == null) ? <Tooltip title="Меню">
                                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => { mainObj.showMenu(); }}>
                                    <MenuIcon />
                                </IconButton>
                            </Tooltip> : ""}
                            <Typography variant="h6" className={classes.title}>
                                {Descr()}
                            </Typography>



                            {renderAddBut()}
                            {addinit()}
                            <Tooltip title="Меню" >
                                <IconButton color="inherit" onClick={() => { setStateMenu(true); }}>
                                    <MoreIcon />
                                </IconButton>
                            </Tooltip>
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
                                Фильтр,сортировка
                            </Typography>

                            <IconButton color="inherit" onClick={() => { setFilter(); }}>
                                <CheckIcon />
                            </IconButton>


                            <IconButton color="inherit" onClick={() => { setMode("grid"); }}>
                                <ClearIcon />
                            </IconButton>

                        </Toolbar>
                    </AppBar>
                    <div className={classes.offset} />
                    {(load) ? <span></span> : renderFilter()}
                </div>

                {renderEditor()}
                {renderSetting()}
            </div>
        </React.Fragment>);
}

export default Finder;