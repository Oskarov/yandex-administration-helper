import React           from 'react';
import {useDispatch, useSelector}   from "react-redux";
import BlurOnIcon from '@mui/icons-material/BlurOn';
import BlurOffIcon from '@mui/icons-material/BlurOff';
import {Tooltip}                    from "@mui/material";
import {TStore}                     from "../../../../store/store";
import {setSprintLighting} from "../../../../slices/app";


const ToggleSprintLight: React.FC = () => {
    const sprintLighting = useSelector((state:TStore) => state.app.sprintLighting);
    const dispatch = useDispatch();

    const toggleIOpen = () => {
        dispatch(setSprintLighting(!sprintLighting));
    }

    return <Tooltip title="Видеть задачи в спринтах">
        <div onClick={toggleIOpen}>
            {sprintLighting ? <BlurOnIcon/> : <BlurOffIcon />}
        </div>
    </Tooltip>;
}

export default ToggleSprintLight;
