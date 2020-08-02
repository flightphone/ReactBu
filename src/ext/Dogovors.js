import React, { useState, useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { baseUrl, openMap, mainObj } from '../App';
import Finder from '../Finder';
import AttachmentIcon from '@material-ui/icons/Attachment';

function Dogovors(props) {
    //let initc = (openMap.get(props.id).data.curRow) ? openMap.get(props.id).data.curRow : 0;

    const [current, setCurrent] = useState(-1);
    function handleCurrent(r) {
        //alert('a');
        setCurrent(r);
    }

    //Достаточно просто вызвать setCurrent, что бы запустить процесс отрисовки
    openMap.get(props.id).data.setCurrent = handleCurrent;


    function addinit() {
        /*
        if (!openMap.get(props.id).data)
            return;
        if (!openMap.get(props.id).data.MainTab)
            return;
        */
        let c = (openMap.get(props.id).data.curRow) ? openMap.get(props.id).data.curRow : 0;
        //let c = current;
        if (c == -1 || c > openMap.get(props.id).data.MainTab.length - 1)
            return;
        let agr_key = openMap.get(props.id).data.MainTab[c]["agr_key"].toString();
        let fileUrl = baseUrl + "Docfiles/dir?id=" + agr_key + "/";

        return (
            <Tooltip title="Файлы">
                <a href={fileUrl} target="_blanck">
                    <AttachmentIcon style={{ color: "white" }} />
                </a>
            </Tooltip>
        );
    }

    return (
        <Finder visible={props.visible} params={props.params} id={props.id} key={props.id} addinit={addinit} />
    );
}

export default Dogovors;