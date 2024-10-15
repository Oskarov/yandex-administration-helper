import React, {useState}            from 'react';
import {useDispatch}                from "react-redux";
import ToggleOffIcon                from '@mui/icons-material/ToggleOff';
import ToggleOnIcon                 from '@mui/icons-material/ToggleOn';
import {changeAllProjectsOpenState} from "../../../../slices/tracker";
import {Tooltip}                    from "@mui/material";


const ToggleAllProjects: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const toggleIOpen = () => {
        setIsOpen(state=>{
            dispatch(changeAllProjectsOpenState(!state));
            return !state;
        })
    }

    return <Tooltip title="Открыть/закрыть все проекты">
        <div onClick={toggleIOpen}>
            {isOpen ? <ToggleOnIcon/> : <ToggleOffIcon/>}
        </div>
    </Tooltip>;
}

export default ToggleAllProjects;
