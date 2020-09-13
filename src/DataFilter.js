import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';


export default function DataFilter(par) {
    const [action, setAction] = useState(0);
    function textChange(event, index) {
        par.columns[index].FindString = event.target.value;
        setAction(action + 1);
    }

    function sortChange(event, index) {
        let rang = 0;

        par.columns.map((column, i)=>{
            if (i!=index && column.SortOrder)    
                if (column.SortOrder > rang)
                    rang = column.SortOrder;
        });
        par.columns[index].SortOrder = rang+1;
        par.columns[index].Sort = event.target.value;
        setAction(action + 1);
    }
    return (
        <Table size="small">
            <TableBody>

                {par.columns.map((column, index) => {
                    return (
                        <TableRow key={column.FieldName}>
                            <TableCell>
                                <TextField label={column.FieldCaption} style={{ width: "50vw" }}
                                    value={column.FindString}
                                    onChange={(event) => textChange(event, index)}
                                />
                            </TableCell>
                            <TableCell style={{ widht: 20 }}>
                                {column.SortOrder}
                            </TableCell>
                            <TableCell>
                                <Select native 
                                value= {column.Sort}
                                onChange={(event) => sortChange(event, index)}
                                >
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