import React, {useEffect, useState}                                                from 'react';
import ArchiveIcon                                                                 from '@mui/icons-material/Archive';
import {Autocomplete, Dialog, DialogContent, TextareaAutosize, TextField, Tooltip} from "@mui/material";
import styles
                                                                                   from "../../../../components/reduxInformationDialog/index.module.scss";
import styles2                                                                     from "./fromTracker.module.scss";
import CloseIcon                                                                   from "@mui/icons-material/Close";
import {useDispatch, useSelector}                                                  from "react-redux";
import {
    getAllQueuesAction,
    getAllTasksByQueueKey
}                                                                                  from "../../../../effects/trackerEffect";
import {TStore}                                                                    from "../../../../store/store";
import CN                                                                          from "classnames";
import {setLastQueue}                                                              from "../../../../slices/app";

interface FromTrackerProps {

}

const FromTracker: React.FC<FromTrackerProps> = ({}) => {
    const [isOpen, setIsOpen] = useState(false);
    const {queues} = useSelector((state: TStore) => ({
        queues: state.tracker.queues
    }));
    const {lastQueue} = useSelector((state: TStore) => ({
        lastQueue: state.app.lastQueue
    }));
    const dispatch = useDispatch();
    useEffect(() => {
        if (isOpen) {
            dispatch(getAllQueuesAction());
        }
    }, [isOpen]);

    return <div>
        <Tooltip title="Загрузка задач и проектов из очереди в Трекере">
            <div onClick={() => setIsOpen(true)}>
                <ArchiveIcon/>
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
                <div className={styles.title}>Загрузка из очереди</div>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={queues.map(i => ({
                        label: `${i.name}(${i.key})`,
                        key: i.key
                    }))}
                    onChange={(e, value) => {
                        dispatch(getAllTasksByQueueKey(value?.key as unknown as string));
                        const queue = queues.find(i => i.key === value?.key);
                        if (queue) {
                            dispatch(setLastQueue(queue));
                        }
                        setIsOpen(false);
                    }}
                    disabled={queues.length == 0}
                    renderInput={(params) => <TextField {...params} label="Очереди"/>}
                />

            </DialogContent>
        </Dialog>
    </div>;
}

export default FromTracker;
