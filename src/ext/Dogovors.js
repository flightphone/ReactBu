import React, { useState, useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import Finder from '../Finder';
import AttachmentIcon from '@material-ui/icons/Attachment';
import { baseUrl, openMap, mainObj, prodaction } from '../App';


const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
}));

function Dogovors(props) {
    //let initc = (openMap.get(props.id).data.curRow) ? openMap.get(props.id).data.curRow : 0;
    const classes = useStyles();
    const [current, setCurrent] = useState(-1);
    const [load, setLoad] = useState(true);
    function handleCurrent(r) {
        setCurrent(current + 1);
    }

    //Достаточно просто вызвать setCurrent, что бы запустить процесс отрисовки
    const filterid = "dog_filter";
    const IdDeclare = "1519";
    
    useEffect(() => { getData(); }, []);
    async function getData() {
        

        let mid = {
            Control: null,
            Params: "1519",
            SQLParams: {},
            data: {}
          }
        openMap.set(filterid, mid);  

        const url = baseUrl + "React/FinderStart";
        let bd = new FormData();
        bd.append("id", IdDeclare);

        
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
            mainObj.alert("Ошибка", data.Error);
        }
        else
        {
            data.curRow = 0;
            let row = data.MainTab[0];
            data.WorkRow = {};
            data.ColumnTab.map((column) => {
                data.WorkRow[column] = (row[column] == null) ? "" : row[column];
            });

            mid.data = data;
            setLoad(false);
        }
    }

    function addinit() {
        /*
        if (!openMap.get(props.id).data)
            return;
        if (!openMap.get(props.id).data.MainTab)
            return;
        */
        openMap.get(props.id).data.setCurrent = handleCurrent;
        let c = (openMap.get(props.id).data.curRow != null) ? openMap.get(props.id).data.curRow : 0;
        //let c = current;
        if (c == -1 || c > openMap.get(props.id).data.MainTab.length - 1)
            return;
        let agr_key = openMap.get(props.id).data.MainTab[c]["agr_key"].toString();
        let fileUrl = baseUrl + "Docfiles/dir?id=" + agr_key + "/";

        return (
            <React.Fragment>
                <Tooltip title="Файлы">
                    <a href={fileUrl} target="_blanck" className={classes.menuButton}>
                        <AttachmentIcon style={{ color: "white" }} />
                    </a>
                </Tooltip>
            </React.Fragment>
        );
    }

    return (
        (load)?"Загрузка...":<Finder visible={props.visible} params={props.params} id={props.id} key={props.id} addinit={addinit} filterid = {filterid}/>
    );
}

export default Dogovors;