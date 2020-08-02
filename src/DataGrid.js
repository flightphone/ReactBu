import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { openMap } from './App';


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

const useStyles = makeStyles({
  root: {

  },
  container: {
    height: "100vh",
    overflow: "auto",
  },

});

export default function DataGrid(par) {
  const classes = useStyles();
  let initc = (openMap.get(par.id).data.curRow) ? openMap.get(par.id).data.curRow : -1;
  const [current, setCurrent] = useState(initc);


  const handleClick = (event, index) => {
    openMap.get(par.id).data.curRow = index;
    if (openMap.get(par.id).data.setCurrent != null) {
      openMap.get(par.id).data.setCurrent(index);
    }
    setCurrent(index);
  };

  return (

    <Table size="small">
      <TableHead>
        <TableRow>
          {par.columns.map((column) => (
            <TableCell
              key={column.FieldName}
              align={(column.DisplayFormat.indexOf('#') > -1) ? "right" : "left"}
              style={{ fontSize: 14, maxWidth: 300 }}
            >
              {column.FieldCaption}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {par.rows.map((row, index) => {
          return (
            <TableRow
              hover
              selected={(index == current)}
              onClick={(event) => handleClick(event, index)}

            >
              {par.columns.map((column) => {
                const value = row[column.FieldName];
                return (
                  <TableCell key={column.FieldName}
                    align={(column.DisplayFormat.indexOf('#') > -1) ? "right" : "left"}
                    style={{ fontSize: 14, maxWidth: 300 }}
                  >
                    {(column.DisplayFormat == "") ? value : dateformat(value, column.DisplayFormat)}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>


  );

}