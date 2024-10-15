import React, {createContext, useEffect, useState}        from 'react';
import DialogTitle                                        from "@mui/material/DialogTitle";
import DialogContent                                      from "@mui/material/DialogContent";
import DialogContentText                                  from "@mui/material/DialogContentText";
import {FormControl, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {performerTypes}                                   from "../../interfaces/IPerformers";
import TextField                                          from "@mui/material/TextField";
import DialogActions                                      from "@mui/material/DialogActions";
import Button                                             from "@mui/material/Button";
import Dialog                                             from "@mui/material/Dialog";
import {addPerformer, editPerformer}                      from "../../slices/performers";
import {generateRandomString}                             from "../../utils/generateRandomString";
import {useDispatch}                                      from "react-redux";
import {store}                                            from "../../store/store";
import {getAllUsersAction}                                from "../../effects/trackerEffect";
import QueueService                                       from "../../api/queue-service";
import {inspect}                                          from "util";
import styles                                             from './performerContext.module.scss'

interface ReduxContextProps {
    children: any
}

export interface IModalContextData {
    id: string | null
}

export const PerformerModalContextChanger = createContext<((data: IModalContextData) => void) | null>(null);

interface IInitial {
    firstName: string,
    lastName: string,
    roleId: number,
    trackerId: number | undefined,
    trackerDisplay: string | undefined,
}

const PerformerModalContext: React.FC<ReduxContextProps> = ({children}) => {
    const dispatch = useDispatch();

    const initialData: IInitial = {
        firstName: '',
        lastName: '',
        roleId: 10,
        trackerId: undefined,
        trackerDisplay: undefined
    }

    const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
    const [taskKey, setTaskKey] = useState('');
    const [data, setData] = useState<IInitial>(initialData);
    const [currentId, setCurrenId] = useState<string | null>(null);

    const getUserInfo = async () => {
        const {success, data} = await QueueService.getTaskByKey(taskKey);
        console.log(data?.assignee);
        if (success && data) {
            if (data.assignee && data.assignee.id && data.assignee.display) {
                handleTaskDataChange('trackerId', data.assignee.id);
                handleTaskDataChange('trackerDisplay', data.assignee.display);
                handleTaskDataChange('lastName', data.assignee.display.split(' ')[1]);
                handleTaskDataChange('firstName', data.assignee.display.split(' ')[0]);
            }

        }
    }

    const handleTaskDialogOpen = () => {
        setCreateTaskDialogOpen(true);
    };

    const handleTaskDialogClose = () => {
        setCreateTaskDialogOpen(false);
        clearTaskData();
    };


    const clearTaskData = () => {
        setData(initialData);
        setCurrenId(null);
    }

    const handleTaskDataChange = (name: string, value: any) => {
        setData(data => ({
            ...data,
            [name]: value
        }))
    }

    const handleTypeChange = (event: SelectChangeEvent<number>) => {
        setData(data => ({
            ...data,
            roleId: event.target.value as number
        }))
    }

    const handleTaskData = () => {
        if (data.firstName && data.lastName) {
            if (currentId) {
                dispatch(editPerformer({
                    uuid: currentId,
                    ...data,
                }))
            } else {
                dispatch(addPerformer({
                    ...data,
                    uuid: generateRandomString(10),
                    tasks: []
                }));
            }
            handleTaskDialogClose();
        }
    }

    const enableModal = (data: IModalContextData) => {
        if (!data.id) {
            clearTaskData();
        } else {
            const performer = store.getState().performers.items.find(i => i.uuid === data.id);
            if (performer) {
                setData({
                    lastName: performer.lastName,
                    firstName: performer.firstName,
                    roleId: performer.roleId,
                    trackerId: performer.trackerId,
                    trackerDisplay: performer.trackerDisplay
                })
                setCurrenId(performer.uuid);
            } else {
                return;
            }
        }
        handleTaskDialogOpen();
    }


    return <PerformerModalContextChanger.Provider value={enableModal}>
        {children}
        <Dialog open={createTaskDialogOpen} onClose={handleTaskDialogClose}>
            <DialogTitle>{currentId ? 'Изменить исполнителя' : 'Добавить исполнителя'}</DialogTitle>
            <DialogContent>
                <DialogContentText>

                </DialogContentText>


                <FormControl variant="standard">
                    <Select
                        id="type"
                        value={data.roleId}
                        label="Age"
                        fullWidth={true}
                        onChange={handleTypeChange}
                    >
                        {performerTypes.map(taskType => <MenuItem value={taskType.type}
                                                                  key={taskType.id}>{taskType.name}</MenuItem>)}
                    </Select>
                </FormControl>

                <TextField
                    autoFocus
                    margin="dense"
                    id="lastName"
                    label="Фамилия"
                    type="text"
                    fullWidth
                    value={data.lastName}
                    onChange={(e) => {
                        handleTaskDataChange('lastName', e.target.value)
                    }}
                    variant="standard"
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="firstName"
                    label="Имя"
                    type="text"
                    fullWidth
                    value={data.firstName}
                    onChange={(e) => {
                        handleTaskDataChange('firstName', e.target.value)
                    }}
                    variant="standard"
                />
                <div className={styles.getTask}>
                    <TextField
                        margin="dense"
                        id="find"
                        label="Подгрузить информацию по пользователю из задачи"
                        type="text"
                        fullWidth
                        value={taskKey}
                        onChange={(e) => {
                            setTaskKey(e.target.value);
                        }}
                        placeholder={'TMS-222'}
                        variant="standard"
                    />
                    <Button onClick={getUserInfo}>Получить</Button>
                </div>
                {(data.trackerId && data.trackerDisplay) && <div className={styles.trackerInfo}>
                    <div>Информация из трекера:</div>
                    <div>{data.trackerDisplay} ({data.trackerId})</div>
                </div>}

            </DialogContent>
            <DialogActions>
                <Button onClick={handleTaskDialogClose}>Отмена</Button>
                <Button onClick={handleTaskData}>{currentId ? "Сохранить" : "Создать"}</Button>
            </DialogActions>
        </Dialog>
    </PerformerModalContextChanger.Provider>;
}

export default PerformerModalContext;
