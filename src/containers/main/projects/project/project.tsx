import React                      from 'react';
import {ITask}                    from "../../../../interfaces/ITask";
import styles                     from './project.module.scss';
import {Draggable, Droppable}     from "react-beautiful-dnd";
import TaskCard                   from "../../../../components/taskCard/taskCard";
import {useDispatch, useSelector} from "react-redux";
import {TStore}                   from "../../../../store/store";
import RemoveIcon                 from '@mui/icons-material/Remove';
import AddIcon                    from '@mui/icons-material/Add';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import {changeProjectOpenState}   from "../../../../slices/tracker";
import CN from "classnames";

interface ProjectProps {
    number: string,
    name: string,
    isOpen: boolean,
    tasks: ITask[]
}

const getListStyle = (isDraggingOver: boolean, rowSize: number,
                      sprintSize: number,
                      valueOfDivision: number) => ({
    background: isDraggingOver ? 'lightblue' : 'rgba(229,229,229,0.36)',
    display: 'flex',
    padding: 8,
    overflow: 'auto',
    width: `${rowSize * valueOfDivision}px`
});


const Project: React.FC<ProjectProps> = ({number, name, isOpen, tasks}) => {
    const dispatch = useDispatch();
    const app = useSelector((state: TStore) => state.app);
    const taskWithoutSprint = tasks.filter(task=>!task.inSprintId);
    const tasksToShow = app.sprintLighting ? tasks : taskWithoutSprint
    return <div className={CN(styles.list, {
        [styles.closed]: !app.sprintLighting && taskWithoutSprint.length !== tasks.length
    })}>
        <div className={styles.title}>
            <a href={`https://tracker.yandex.ru/pages/projects/${number}`} target='_blank'>
                <InsertLinkIcon/>
            </a>
            <span>{name}</span>
            {isOpen ?
                <RemoveIcon onClick={() => dispatch(changeProjectOpenState({projectId: number, isOpen: false}))}/> :
                <AddIcon onClick={() => dispatch(changeProjectOpenState({projectId: number, isOpen: true}))}/>}
        </div>
        {isOpen && <Droppable droppableId={`project-${number}`} direction="horizontal">
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver, app.rowSize, app.sprintSize, app.valueOfDivision)}
                    className={styles.listRow}
                    {...provided.droppableProps}
                >
                    {tasksToShow.map((item, index) => (
                        <Draggable key={item.uuid} draggableId={item.uuid} index={index}>
                            {(provided, snapshot) => (
                                <TaskCard item={item} provided={provided} snapshot={snapshot} performerLink="backlog"/>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>}

    </div>;
}

export default Project;
