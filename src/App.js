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

let treeJson = [];
let mainObj = {};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
const baseUrl = (prodaction)?"":"http://127.0.0.1:5000/";

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
  useEffect(() => { getTree(); }, []);

  function show() {
    setStateDrawer(true);
  }

  function getForm(id) {
    let p = menuMap.get(id);
    let control = (p.params) ? Finder : Comp1;
    let params = p.params;
    let SQLParams = null; //new Map();
    if (p.link1 == "RegulationPrint.repSDM")
    {
      SQLParams = {
        "@DateStart" : "2000-01-01",
        "@DateFinish": "2099-01-01"
      };
      
    }

    if (p.link1 == "RegulationPrint.ServiceReport")
    {
      SQLParams = {
        "@DateStart" : "2000-01-01",
        "@DateFinish": "2099-01-01",
        "@AL_UTG": "<Все>"
      };
      
    }

    return {
      Conrol: control,
      Params: params,
      SQLParams : SQLParams
    }
  }

  function open(id) {
    if (openMap.get(id) == null) {
      let c = getForm(id);
      let obj = {
        Control: c.Conrol,
        Params: c.Params,
        SQLParams : c.SQLParams,
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
        mode: (prodaction)?'no-cors':'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: (prodaction)?'include':'omit' // include, *same-origin, omit
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
  //Передаем фунцию через глобальный объект
  mainObj.showMenu = show;
  mainObj.addform = addform;

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
export { baseUrl, openMap, mainObj, prodaction };
