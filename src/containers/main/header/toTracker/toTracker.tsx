import React, {useEffect, useState}                                                from 'react';
import ArchiveIcon                                                                 from '@mui/icons-material/Archive';
import {Autocomplete, Dialog, DialogContent, TextareaAutosize, TextField, Tooltip} from "@mui/material";
import styles
                                                                                   from "../../../../components/reduxInformationDialog/index.module.scss";
import styles2                                                                     from "./toTracker.module.scss";
import CloseIcon                                                                   from "@mui/icons-material/Close";
import {useDispatch, useSelector}                                                  from "react-redux";
import {
    getAllBoardsAction,
    getAllQueuesAction, getAllSprintsByBoardId,
    getAllTasksByQueueKey, getAllTasksBySprintId
}                                                                                  from "../../../../effects/trackerEffect";
import {TStore}                                                                    from "../../../../store/store";
import CN                                                                          from "classnames";
import CloudUploadIcon
                                                                                   from '@mui/icons-material/CloudUpload';
import Button                                                                      from "@mui/material/Button";
import {clearTargetTask}                                                           from "../../../../slices/modal";

interface FromTrackerProps {

}

const ToTracker: React.FC<FromTrackerProps> = ({}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [chosenSprint, setChosenSprint] = useState<number | null>(null)
    const {boards, sprints} = useSelector((state: TStore) => ({
        boards: state.trackerNoMemo.boards,
        sprints: state.trackerNoMemo.sprints
    }));
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
            dispatch(getAllTasksBySprintId(chosenSprint, true, true, false))
        }
    }

    return <div>
        <Tooltip title="Выгрузка задач в спринт трекера">
            <div onClick={() => setIsOpen(true)}>
                <CloudUploadIcon/>
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
                <div className={styles.title}>Выгрузка задач в трекер</div>
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

                {!!chosenSprint && <div>

                </div>}

                    {/* {!!chosenSprint && <div className={styles2.sprintButtons}>
                    <Button onClick={handleChange} color={'primary'} variant={'contained'}>Отправить</Button>
                </div>}*/}

            </DialogContent>
        </Dialog>
    </div>;
}

export default ToTracker;
