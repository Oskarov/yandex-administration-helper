import React, {FC, useEffect, useState} from 'react';
import styles from './index.module.scss';
import {Autocomplete, Tooltip} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {TStore} from "../../../store/store";
import {ITrackerQueueTask} from "../../../interfaces/ITracker";
import {getAllBoardsAction, getAllSprintsByBoardId, getAllTasksBySprintId} from "../../../effects/trackerEffect";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import calculateHoursFromTrackerTack from "../../../utils/calculateHoursFromTrackerTack";

interface ITimeObj {
    [key: string]: ITrackerQueueTask[]
}

interface IEndTimeObj {
    [key: string]: number
}

interface Iresult {
    name: string,
    time: number,
    orgTime: number,
    tasks: ITrackerQueueTask[]
}

export const Stats: FC = ({}) => {
    const dispatch = useDispatch();
    const [chosenSprint, setChosenSprint] = useState<number | null>(null)
    const {boards, sprints, tasks} = useSelector((state: TStore) => ({
        boards: state.trackerNoMemo.boards,
        sprints: state.trackerNoMemo.sprints,
        tasks: state.trackerNoMemo.tasksForTime,
    }));
    const timeObj: ITimeObj = {};
    const endTimeObj: IEndTimeObj = {};
    const orgTimeObj: IEndTimeObj = {};
    const result: Iresult[] = [];
    const newBoardsIds: number[] = []
    const newBoards = boards.filter((board) => {
        if (!newBoardsIds.includes(board.id)) {
            newBoardsIds.push(board.id);
            return true;
        }
        return false;
    });

    useEffect(() => {
        dispatch(getAllBoardsAction());
    }, []);

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

                    if (task.type.key === 'organizational'){
                        if (!orgTimeObj[key]) {
                            orgTimeObj[key] = time;
                        } else {
                            orgTimeObj[key] = orgTimeObj[key] + time
                        }
                    }
                }
            })
        }
        for (let key in endTimeObj) {
            let res: Iresult = {
                name: key,
                time: endTimeObj[key],
                orgTime: orgTimeObj[key],
                tasks: timeObj[key]
            };
            result.push(res);
        }
    }


    return <div>
        <div className={styles.control}>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                className={styles.autoInput}
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
            <div className={styles.fastLinks}>
                <div onClick={()=>{  dispatch(getAllSprintsByBoardId(1440));}}>Шедевры PHP</div>
                <div onClick={()=>{  dispatch(getAllSprintsByBoardId(1441));}}>Произведения на Go</div>
            </div>
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
        </div>

        {!!chosenSprint && <div className={styles.sprintButtons}>
            <Button onClick={handleChange} color={'primary'} variant={'contained'}>Посчитать</Button>
        </div>}

        <div className={styles.timeTable}>
            {result.map(item => <div className={styles.timeItem}>
                <div className={styles.timeName}>{item.name}</div>
                <div className={styles.table}>
                    <div>
                        <div>По специальности: {Math.trunc(item.time - item.orgTime)} ч.</div>
                        <div>Организационные: {Math.trunc(item.orgTime)} ч.</div>
                        <div>Всего: {Math.trunc(item.time)} ч.</div>
                        <div>Не вложено: {80 - Math.trunc(item.time)} ч.</div>
                    </div>
                </div>

                <div className={styles.timeLine}>
                    <div className={styles.timeLineTitle}>Шкала времени:</div>
                    <div className={styles.timeLineTable}>
                        <div className={styles.orgTimesegment} style={{width: `${(Math.trunc(item.orgTime))*100/80}%`}}/>
                        <div className={styles.specTimesegment} style={{width: `${Math.trunc(item.time - item.orgTime)*100/80}%`}}/>
                    </div>
                    <div className={styles.timeDevider}>
                        <div className={styles.left}>Первая неделя</div>
                        <div className={styles.right}>Вторая неделя</div>
                        <div className={styles.center}/>
                    </div>
                </div>

                <div className={styles.timeTasks}>
                    <div className={styles.taskTitle}>Задачи:</div>
                    {item.tasks.map(task => <div className={styles.taskRaw}>
                        <a href={`https://tracker.yandex.ru/${task.key}`}
                           target={"_blank"} rel={"noreferrer`"}>{task.key}</a>
                        <span>{task.summary}</span>
                        <span>
                            ({task?.spent ? calculateHoursFromTrackerTack(task.spent) : 0} ч.)
                        </span>
                    </div>)}
                </div>
            </div>)}
        </div>
    </div>
}
