import React, {useEffect, useState} from 'react';
import TimerIcon from '@mui/icons-material/Timer';
import {Autocomplete, Dialog, DialogContent, TextareaAutosize, TextField, Tooltip} from "@mui/material";
import styles
    from "../../../../components/reduxInformationDialog/index.module.scss";
import styles2 from "./timeFromTracker.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import {useDispatch, useSelector} from "react-redux";
import {
    getAllBoardsAction,
    getAllQueuesAction, getAllSprintsByBoardId,
    getAllTasksByQueueKey, getAllTasksBySprintId
} from "../../../../effects/trackerEffect";
import {TStore} from "../../../../store/store";
import CN from "classnames";
import {setLastQueue} from "../../../../slices/app";
import Button from "@mui/material/Button";
import {ITrackerQueueTask} from "../../../../interfaces/ITracker";
import calculateHoursFromTrackerTack from "../../../../utils/calculateHoursFromTrackerTack";

interface FromTrackerProps {

}

interface ITimeObj {
    [key: string]: ITrackerQueueTask[]
}

interface IEndTimeObj {
    [key: string]: number
}

interface Iresult {
    name: string,
    time: number,
    tasks: ITrackerQueueTask[]
}

const TimeFromTracker: React.FC<FromTrackerProps> = ({}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [chosenSprint, setChosenSprint] = useState<number | null>(null)
    const {boards, sprints, tasks} = useSelector((state: TStore) => ({
        boards: state.trackerNoMemo.boards,
        sprints: state.trackerNoMemo.sprints,
        tasks: state.trackerNoMemo.tasksForTime,
    }));
    const timeObj: ITimeObj = {};
    const endTimeObj: IEndTimeObj = {};
    const result:Iresult[] = [];
    const newBoardsIds: number[] = []
    const newBoards = boards.filter((board) => {
        if (!newBoardsIds.includes(board.id)) {
            newBoardsIds.push(board.id);
            return true;
        }
        return false;
    });
    const dispatch = useDispatch();
    useEffect(() => {
        if (isOpen) {
            dispatch(getAllBoardsAction());
        }
    }, [isOpen]);

    const handleChange = () => {
        if (chosenSprint) {
            dispatch(getAllTasksBySprintId(chosenSprint, false, false, true));
        }
    }

    if (tasks.length) {
        tasks.forEach(task => {
            if (task.assignee?.display && task?.spent) {
                let str = task.assignee.display as string
                if (!timeObj.hasOwnProperty(str)) {
                    timeObj[str] = [task];
                } else {
                    timeObj[str].push(task);
                }
            }
        });
        for (let key in timeObj) {
            let tasks = timeObj[key];
            tasks.forEach(task => {
                if (task?.spent) {
                    let time = calculateHoursFromTrackerTack(task.spent);
                    if (!endTimeObj.hasOwnProperty(key)) {
                        endTimeObj[key] = time;
                    } else {
                        endTimeObj[key] = endTimeObj[key] + time
                    }
                }
            })
        }
        for (let key in endTimeObj){
            let res: Iresult = {
                name: key,
                time: endTimeObj[key],
                tasks: timeObj[key]
            };
            result.push(res);
        }
    }

    return <div>
        <Tooltip title="Время затраченное на задачи">
            <div onClick={() => setIsOpen(true)}>
                <TimerIcon/>
            </div>
        </Tooltip>
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            aria-labelledby="simple-dialog-title"
            aria-describedby="simple-dialog-description"
            className="tms"
        >
            <DialogContent className={CN(styles.content, styles2.queueModal)}>
                <div className={styles.roundButton} onClick={() => setIsOpen(false)}>
                    <CloseIcon/>
                </div>
                <div className={styles.title}>Время затраченное на задачи</div>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    className={styles2.autoInput}
                    options={newBoards.map(i => ({
                        label: `${i.name} (${i.id})`,
                        key: i.id
                    }))}
                    onChange={(e, value) => {
                        if (value?.key) {
                            dispatch(getAllSprintsByBoardId(value?.key));
                        }
                    }}
                    disabled={newBoards.length == 0}
                    renderInput={(params) => <TextField {...params} label="Доски"/>}
                />
                <Autocomplete
                    disablePortal
                    id="sprint-change"
                    options={sprints.map(i => ({
                        label: `${i.name} (${i.id})`,
                        key: i.id
                    }))}
                    onChange={(e, value) => {
                        if (value?.key) {
                            setChosenSprint(value.key);
                        }
                    }}
                    disabled={sprints.length == 0}
                    renderInput={(params) => <TextField {...params} label="Спринты"/>}
                />

                {!!chosenSprint && <div className={styles2.sprintButtons}>
                    <Button onClick={handleChange} color={'primary'} variant={'contained'}>Посчитать</Button>
                </div>}

                <div className={styles2.timeTable}>
                    {result.map(item=><div className={styles2.timeItem}>
                        <div className={styles2.timeName}>{item.name}</div>
                        <Tooltip title={item.time}>
                            <div
                                className={styles2.timeNumber}>{Math.trunc(item.time)} ч. {Math.trunc(Math.floor((item.time % 1) * Math.pow(10, 2)) * 60 / 100)} м.
                            </div>
                        </Tooltip>
                        <div className={styles2.timeTasks}>
                            {item.tasks.map(task => <div>
                                    <a href={`https://tracker.yandex.ru/${task.key}`}
                                       target={"_blank"} rel={"noreferrer`"}>{task.key}</a>
                                    <span>{task.summary}</span>
                                </div>)}
                        </div>
                    </div>)}
                </div>

            </DialogContent>
        </Dialog>
    </div>;
}

export default TimeFromTracker;
