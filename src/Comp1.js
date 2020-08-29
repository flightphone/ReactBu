import React, { useState } from 'react';


import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tooltip from '@material-ui/core/Tooltip';

import { baseUrl, openMap, mainObj } from './App';



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


function Comp1(props) {
  const visible = props.visible;
  const classes = useStyles();
  return <div
    hidden={!visible}
  >
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Tooltip title="Меню">
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => { mainObj.showMenu(); }}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" className={classes.title}>
            Карточки рейса
              </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </div>
  </div>
}


export { Comp1 }
