import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Comp, { Comp1, GetComp } from './Comp1';
import {treeJson} from './MenuDat';
//dark
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';


import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { sizing } from '@material-ui/system';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';


const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    minWidth: 200
  },
});

let menuMap = new Map();
function createMenuMap(tree) {
  tree.map((node) => {
    if (node.children == null)
      menuMap.set(node.id, node.attributes);
    else
      createMenuMap(node.children);
  });
}


function App(props) {
  const classes = useStyles();

  //dark
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


  const [current, Setcurrent] = useState(-1);
  const [id, SetId] = useState(0);

  function show() {
    setStateDrawer(true);
  }

  const [loading, setLoading] = useState(true);
  //const [treeJson, SetTree] = useState([]);

  //async 
  function getTree() {
    /*
    const url = "http://127.0.0.1:5000/ustore/gettree";
    const response = await fetch(url,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'omit' // include, *same-origin, omit
      }
    );
    */
    //const data = await response.json();
    //SetTree(data);
    //treeJson = data;
    menuMap.clear();
    createMenuMap(treeJson);
    setLoading(false);

  }
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
    if (menuMap.get(nodeIds)) {
      setStateDrawer(false);
      if (nodeIds == "631")
        Setcurrent(0);
      else if (nodeIds == "886")
        Setcurrent(1);
      else
        Setcurrent(-1);

    }
  };


  useEffect(() => { getTree(); }, []);

  const [stateDrawer, setStateDrawer] = useState(false)


  const toggleDrawer = (open) => (event) => {
    /*
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    */
    setStateDrawer(open);

  };

  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.text}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <React.Fragment>

        <Drawer anchor="left" open={stateDrawer} onClose={toggleDrawer(false)}>
          <div>
            {
              (loading) ? <p><em>Загрузка...</em></p> :
                <TreeView
                  className={classes.root}
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                  expanded={expanded}
                  selected={selected}
                  onNodeToggle={handleToggle}
                  onNodeSelect={handleSelect}
                >
                  {
                    treeJson.map((node) => renderTree(node))
                  }
                </TreeView>
            }
          </div>
        </Drawer>

        <Comp1 visible={(current == -1)} show={show} />
        <Comp id={0} visible={(current == 0)} show={show} />
        <Comp id={1} visible={(current == 1)} show={show} />


      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
