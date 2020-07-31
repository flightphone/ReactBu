import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
//import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

export default function DataGrid(par) {
    //const classes = useStyles();
    const [columns, setColumns] = useState(par.columns);
    function textChange(event, index)
    {
        par.columns[index].FindString = event.target.value;
        let a = [];
        par.columns.map((column)=>{
            a.push(column)
        });
        setColumns(a);
    }

    return (
        <Table size="small">
            <TableBody>

                {columns.map((column, index) => {
                    return (
                        <TableRow>
                            <TableCell>
                                <TextField id={column.FieldName} label={column.FieldCaption} style={{width:"50vw"}}
                                value = {column.FindString}
                                onChange={(event)=>textChange(event, index)}
                                />
                            </TableCell>
                            <TableCell style={{widht:30}}>
                                {column.SortOrder}
                            </TableCell>
                            <TableCell>
                            <Select native style={{width:200}}>
                                <option>Нет</option>
                                <option>По возрастанию</option>
                                <option>По убыванию</option>
                            </Select>

                            </TableCell>
                        </TableRow>
                    );
                })}

            </TableBody>
        </Table>
    );
}    