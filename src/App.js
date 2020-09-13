import React, { useState, useEffect } from 'react';

import './App.css';
import Comp, { Comp1, GetComp } from './Comp1';
import Finder from './Finder';
import Dogovors from './ext/Dogovors';
//import {treeJson} from './MenuDat';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';


import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import TreeItem from '@material-ui/lab/TreeItem';
import IconButton from '@material-ui/core/IconButton';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function dateformat(d, f) {
  if (!d)
    return d;


  if (d.length != 24) {
    let re = new RegExp('0\.(0?)');
    let res = f.match(/0\.(0+)/);

    let n = 0;
    if (res)
      if (res.length > 1) {
        n = res[1].length;
      }


    if (n > 0)
      return Number(d.toString()).toFixed(n);
    else
      return d;



  }
  f = f.replace('yyyy', d.substr(0, 4));
  f = f.replace('yy', d.substr(2, 2));
  f = f.replace('MM', d.substr(5, 2));
  f = f.replace('dd', d.substr(8, 2));
  f = f.replace('HH', d.substr(11, 2));
  f = f.replace('mm', d.substr(14, 2));
  return f;
}

let treeJson = [];
let mainObj = {};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginRight: 20,
    marginLeft: 5

  },
  root1: {
   
    backgroundColor: theme.palette.background.paper,
    marginRight: 20,
    marginLeft: 5

  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));

const prodaction = false;
const baseUrl = (prodaction) ? "" : "http://192.168.43.81:5000/";

let menuMap = new Map();
function createMenuMap(tree) {
  tree.map((node) => {
    if (node.children == null)
      menuMap.set(node.id, node.attributes);
    else
      createMenuMap(node.children);
  });
}

let openMap = new Map();

let startObj = {
  Control: Dogovors,
  Params: "1445",
  SQLParams: {},
  data: {}
}
openMap.set("839", startObj);


let openIDs = [];
openIDs.push("839");

function getForm(id) {
  let p = menuMap.get(id);
  let control = (p.params) ? Finder : Comp1;
  let params = p.params;
  let SQLParams = null; //new Map();
  if (p.link1 == "RegulationPrint.repSDM") {
    SQLParams = {
      "@DateStart": "2000-01-01",
      "@DateFinish": "2099-01-01"
    };

  }

  if (p.link1 == "RegulationPrint.ServiceReport") {
    SQLParams = {
      "@DateStart": "2000-01-01",
      "@DateFinish": "2099-01-01",
      "@AL_UTG": "<Все>"
    };

  }

  return {
    Conrol: control,
    Params: params,
    SQLParams: SQLParams
  }
}

//===========================================Application================================
function App(props) {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );
  const [loading, setLoading] = useState(true);
  const [current, Setcurrent] = useState("839");
  const [stateDrawer, setStateDrawer] = useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);

  useEffect(() => { getTree(); }, []);

  function show() {
    setStateDrawer(true);
  }

  

  function open(id) {
    if (openMap.get(id) == null) {
      let c = getForm(id);
      let obj = {
        Control: c.Conrol,
        Params: c.Params,
        SQLParams: c.SQLParams,
        data: {}
      }
      openMap.set(id, obj);
      openIDs.push(id);
    }
    Setcurrent(id);
  }

  function addform(id, obj) {
    if (openMap.get(id) == null) {
      openMap.set(id, obj);
      openIDs.push(id);
    }
    Setcurrent(id);
  }

  async function getTree() {

    const url = baseUrl + "ustore/gettree";
    const response = await fetch(url,
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: (prodaction) ? 'no-cors' : 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: (prodaction) ? 'include' : 'omit' // include, *same-origin, omit
      }
    );

    const data = await response.json();
    treeJson = data;
    menuMap.clear();
    createMenuMap(treeJson);
    setLoading(false);

  }


  const handleSelect = (event, nodeIds) => {
    if (menuMap.get(nodeIds)) {
      setStateDrawer(false);
      open(nodeIds);
    }
  };

  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.text}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );

  function rendItem(id) {
    let value = openMap.get(id);
    let Cm = value.Control;
    return <Cm visible={(current == id)} params={value.Params} id={id} key={id} />
  }
  const handleClose = () => {
    setOpenAlert(false);
    if (mainObj.alertConfirm)
      mainObj.confirmAction();
  };

  const showAlert = (title, text) => {
    mainObj.alertConfirm = false;
    mainObj.alertTitle = title;
    mainObj.alertText = text;
    setOpenAlert(true);
  }

  const showConfirm = (title, text, action) => {
    mainObj.alertConfirm = true;
    mainObj.alertTitle = title;
    mainObj.alertText = text;
    mainObj.confirmAction = action;
    setOpenAlert(true);
  }

  //Передаем фунцию через глобальный объект
  mainObj.showMenu = show;
  mainObj.addform = addform;
  mainObj.alert = showAlert; 
  mainObj.confirm = showConfirm; 

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <React.Fragment>
        <Drawer anchor="left" open={stateDrawer} variant="persistent">
          <div className={classes.drawerHeader}>
            <IconButton onClick={(event) => { setStateDrawer(false); }}>
              <ChevronLeftIcon />
            </IconButton>
          </div>

          {
            (loading) ? <p><em>Загрузка...</em></p> :
              <TreeView
                className={classes.root}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                onNodeSelect={handleSelect}
              >
                {
                  treeJson.map((node) => renderTree(node))
                }
              </TreeView>
          }
        </Drawer>
        <Dialog
          open={openAlert}
          keepMounted
          onClose={()=>{setOpenAlert(false);}}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{mainObj.alertTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {mainObj.alertText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              ОК
          </Button>
          { (mainObj.alertConfirm)?
            <Button onClick={()=>{setOpenAlert(false);}} color="primary">
            Отмена
           </Button>:""
          }
          </DialogActions>
        </Dialog>


        {
          openIDs.map((id) => (
            rendItem(id)
          ))
        }
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
export { baseUrl, openMap, mainObj, prodaction, dateformat };
