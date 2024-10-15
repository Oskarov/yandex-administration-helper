import React                                             from 'react';
import CN                                                from "classnames";
import styles                                            from "./taskCard.module.scss";
import {ITask, projectsList, TASK_TYPES_ENUM, taskTypes} from "../../interfaces/ITask";
import {DraggableProvided, DraggableStateSnapshot}       from "react-beautiful-dnd";
import {hourDefinition}                                  from "../../App";
import VisibilityIcon                                    from '@mui/icons-material/Visibility';
import GroupsIcon                                        from '@mui/icons-material/Groups';
import KayakingIcon                                      from '@mui/icons-material/Kayaking';
import CelebrationIcon                                   from '@mui/icons-material/Celebration';
import {useDispatch, useSelector}                        from "react-redux";
import {TStore}                                          from "../../store/store";
import {Menu, MenuItem, Tooltip}                         from "@mui/material";
import TaskMenu                                          from "./menu/menu";
import {clearTargetTask, setTargetTask}                  from "../../slices/modal";

interface TaskCardProps {
    item: ITask,
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
    performerLink: string
}

const getItemStyle = (isDragging: boolean, draggableStyle: any, capacity: number, valueOfDivision: number) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 0,
    margin: `2px 0`,
    width: `${capacity * valueOfDivision}px`,
    cursor: 'context-menu',
    // styles we need to apply on draggables
    ...draggableStyle,
});

const TaskCard: React.FC<TaskCardProps> = ({item, provided, snapshot, performerLink}) => {
    const {app, targetTask} = useSelector((state: TStore) => ({
        app: state.app,
        targetTask: state.modal.targetTask
    }));
    const taskLighting = useSelector((state: TStore) => state.app.taskLighting);
    const dispatch = useDispatch();

    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : null,
        );
    };

    const handleFocus = (e: React.FocusEvent<HTMLDivElement, Element>) => {
        // eslint-disable-next-line no-console
        console.log(e)
    }

    let capacity = targetTask !== item.number
        ? item.capacity
        : item.capacity > 10
            ? item.capacity
            : taskLighting ? 10 : item.capacity;

    return <div
        onMouseOver={(e) => {
            dispatch(setTargetTask(item.number));
        }}
        onMouseOut={(e) => {
            dispatch(clearTargetTask());
        }}
        onContextMenu={handleContextMenu}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style,
            capacity,
            app.valueOfDivision
        )}
        className={CN(styles.task, {
            [styles.targetTask]: taskLighting && (targetTask === item.number) && ![TASK_TYPES_ENUM.MEETINGS, TASK_TYPES_ENUM.REVIEW, TASK_TYPES_ENUM.VACATION, TASK_TYPES_ENUM.HOLLYDAYS].includes(item.type),
            [styles.onDraw]: snapshot.isDragging,
            [styles.review]: item.type === TASK_TYPES_ENUM.REVIEW,
            [styles.meetings]: item.type === TASK_TYPES_ENUM.MEETINGS,
            [styles.vacation]: item.type === TASK_TYPES_ENUM.VACATION,
            [styles.hollydays]: item.type === TASK_TYPES_ENUM.HOLLYDAYS,
            [styles.dev]: item.type === TASK_TYPES_ENUM.DEV_TASK,
            [styles.analytics]: item.type === TASK_TYPES_ENUM.ANALYTICS,
            [styles.test]: item.type === TASK_TYPES_ENUM.TESTING,
            [styles.deploy]: item.type === TASK_TYPES_ENUM.DEPLOY,
            [styles.other]: item.type === TASK_TYPES_ENUM.OTHER,
        })}
    >

        {item.type === TASK_TYPES_ENUM.REVIEW && <div className={styles.centerIcon}>
            <Tooltip title={`Код ревью (${item.capacity})`}>
                <VisibilityIcon/>
            </Tooltip>
        </div>}
        {item.type === TASK_TYPES_ENUM.MEETINGS && <div className={styles.centerIcon}>
            <Tooltip title={`Встречи (${item.capacity})`}>
                <GroupsIcon/>
            </Tooltip>
        </div>}
        {item.type === TASK_TYPES_ENUM.VACATION && <div className={styles.centerIcon}>
            <Tooltip title={`Отпуск (${item.capacity})`}>
                <KayakingIcon/>
            </Tooltip>
        </div>}
        {item.type === TASK_TYPES_ENUM.HOLLYDAYS && <div className={styles.centerIcon}>
            <Tooltip title={`Выходные (${item.capacity})`}>
                <CelebrationIcon/>
            </Tooltip>
        </div>}
        {![TASK_TYPES_ENUM.MEETINGS, TASK_TYPES_ENUM.REVIEW, TASK_TYPES_ENUM.VACATION, TASK_TYPES_ENUM.HOLLYDAYS].includes(item.type) &&
            <div>
                <div className={styles.number}>
                    <a href={`https://tracker.yandex.ru/${item.number}`}
                       target={"_blank"} rel={"noreferrer`"}>{item.number}</a>
                    <Tooltip title={item.inSprintDisplay || 'без спринта'}>
                        <div className={CN(styles.sprint, {[styles.noSprint]: !item.inSomeSprint})}/>
                    </Tooltip>
                </div>
                <div className={styles.name}>
                    <div
                        className={CN(styles.estimation, {[styles.notEstimated]: !item.hasEstimate})}>{item.capacity}</div>
                    <Tooltip title={`[${item.project}] ${item.number} ${item.name} (${item.capacity})`}>
                        <span>{item.name}</span>
                    </Tooltip>
                </div>
                <div className={styles.projectMarker}
                     style={{backgroundColor: !!item.infoSystem ? '#009dff52' : '#ec1c1c'}}>
                    {item.infoSystem || 'Не указана система'}
                </div>
                <div className={styles.projectMarker2}
                     style={{backgroundColor: !!item.informationAssets ? 'rgba(85,0,255,0.32)' : '#ec651c'}}>
                    {item.informationAssets || 'Не указан актив'}
                </div>

            </div>}
        <TaskMenu contextMenu={contextMenu} setContextMenu={setContextMenu} performerLink={performerLink} task={item}/>
    </div>;

}

export default TaskCard;
