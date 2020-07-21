import React, { useState } from 'react';


import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tooltip from '@material-ui/core/Tooltip';

class Fin {
  items = [];
  text = "";
  updateTab() {
    this.items.push("oh")
  }
}

let f1 = new Fin();
f1.items = ["aa", "bb", "dd"];
f1.text = "Hello"

let f2 = new Fin();
f2.items = ["uu", "zz", "xx"];
f2.text = "привет"

const MainList = [f1, f2];


const listcm = [Comp, Comp1, <div></div>];


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function GetComp(props)
{
    const classes = useStyles();
    const current = props.component;
    const Res = listcm[current];
    //const [id, SetId] = useState(props.id);
    let id = props.id;
    return <Res id={id}/> ;
}

function Comp1(props)
{
    const visible = props.visible;
    const classes = useStyles();
    return <div
    hidden={!visible}
    >
<div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <Tooltip title="Меню">
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => { props.show();}}>
                <MenuIcon />
              </IconButton>
              </Tooltip>
              <Typography variant="h6" className={classes.title}>
                Карточки рейса
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
    </div>
}

function Comp(props)
{

    
    /*
    if (MainList.length == 0)
    {
        let f2 = new Fin();
        f2.items = ["uu1", "zz1", "xx1"];
        f2.text = "привет";
        MainList.push(f2);
    };
    */
    const classes = useStyles();
    const {id, visible } = props;
    const p  = MainList[id];
    
    //const p = new Fin();
    //p.items = ["aa", "bb", "cc"];
    
    const [items, setItems] = useState(p.items);
    const [txt, setTxt] = useState(p.text);

    

    function handleChange(event) {
      var a = event.target.value; 
      setTxt(a);
      p.text = a;
    }

    function updateTab()
    {
      p.updateTab();
      let a = []; 
      p.items.forEach(element => {
        a.push(element);
      });
      setItems(a);
      /*
          <Button onClick={() => { Setcurrent(0); }} >Дополнительные тарифы</Button> <br />
            <Button onClick={() => { Setcurrent(1); }} >Номера ВС</Button> <br />
            <Button onClick={() => { Setcurrent(2); }} >Тип ВС</Button> <br />

      */      
      
    }
    return (
    <div hidden={!visible}>

<div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
            <Tooltip title="Меню">
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => { props.show();}}>
                <MenuIcon />
              </IconButton>
              </Tooltip>
              <Typography variant="h6" className={classes.title}>
                Редактирование записи
              </Typography>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>
        </div>


      <div>
        <span>{id}</span>
        <input type="text" value = {txt} onChange={handleChange}/> 
      </div>
      <Tooltip title="Добавить">
      <Button onClick={() => updateTab()}>Update</Button>
      </Tooltip>
      {
        items.map ((it)=>(
          <div>
              <span>{it}</span>
              <input type="text" />
          </div>
          ))
      }
    </div>
    );
        
}
export {Comp1, GetComp}
export default Comp;