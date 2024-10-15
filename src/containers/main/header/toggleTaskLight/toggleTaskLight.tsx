import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import FlashlightOffIcon from '@mui/icons-material/FlashlightOff';
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn';
import {Tooltip} from "@mui/material";
import {TStore} from "../../../../store/store";
import {setTaskLighting} from "../../../../slices/app";


const ToggleTaskLight: React.FC = () => {
    const taskLighting = useSelector((state: TStore) => state.app.taskLighting);
    const dispatch = useDispatch();

    const toggleIOpen = () => {
        dispatch(setTaskLighting(!taskLighting));
    }

    return <Tooltip title="Подсветка задач при наведении">
        <div onClick={toggleIOpen}>
            {taskLighting ? <FlashlightOnIcon/> : <FlashlightOffIcon/>}
        </div>
    </Tooltip>;
}

export default ToggleTaskLight;
