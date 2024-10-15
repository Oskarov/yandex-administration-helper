import React, {useContext, useState}                      from 'react';
import styles                                             from "../control.module.scss";
import PlaylistAddIcon                                    from "@mui/icons-material/PlaylistAdd";
import {PerformerModalContextChanger}                     from "../../../../contexts/performerModalContext/performerContext";

interface TaskModalProps {

}


const PerformerModal: React.FC<TaskModalProps> = () => {
    const performerModalAction = useContext(PerformerModalContextChanger);

    const handleClick = () => {
        if (performerModalAction) {
            performerModalAction({
                id: null,
            })
        }
    }

    return <div>
        <div onClick={handleClick} className={styles.link}>
            <span>Добавить исполнителя</span><PlaylistAddIcon/>
        </div>
    </div>;
}

export default PerformerModal;
