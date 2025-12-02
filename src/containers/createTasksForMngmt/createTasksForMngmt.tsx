import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TStore} from '../../store/store';
import {
  createTasksInSprint,
  getAllBoardsAction,
  // getAllQueuesAction,
  getAllSprintsByBoardId,
  // getAllTasksByQueueKey,
  // getAllTasksBySprintId,
} from '../../effects/trackerEffect';
import {Autocomplete, Checkbox, TextField} from '@mui/material';
import styles2 from '../main/header/toTracker/toTracker.module.scss';
import Button from '@mui/material/Button';
import styles from './createTasksForMngmt.module.scss';
import {taskTypes} from "../../interfaces/ITask";
import {TrackerTaskTypes} from "../../interfaces/ITasksTracker";
// import { setLastQueue } from '../../slices/app';

const CreateTasksForMngmt = () => {
  const targetQueue = 'MNGMT'
  const [chosenSprintText, setChosenSprintText] = useState('');
  const [chosenSprint, setChosenSprint] = useState<number | null>(null);
  const [trackerIds, setTrackerIds] = useState<number[]>([]);
  const [name, setName] = useState('Администрирование');
  const [type, setType] = useState<string>('organizational');

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllSprintsByBoardId(2373));
  }, []);

  const [taskSet, setTaskSet] = useState([
    {
      type: 'organizational',
      taskName: 'Администрирование, Отчётность'
    },
    {
      type: 'organizational',
      taskName: 'Деплой, инфраструктура'
    },
    {
      type: 'organizational',
      taskName: 'Проработка задач, Аналитика, Нормативная база'
    },
    {
      type: 'organizational',
      taskName: 'Встречи, взаимодействие с командой'
    },
    {
      type: 'organizational',
      taskName: 'Проработка вопросов с заказчиками/коллегами из смежных подразделений'
    }
  ])


  // selectors
  const {boards, sprints, performers} = useSelector((state: TStore) => ({
    boards: state.trackerNoMemo.boards,
    sprints: state.trackerNoMemo.sprints,
    performers: state.performers.items,
  }));

  const newBoardsIds: number[] = [];

  const newBoards = boards.filter(board => {
    if (!newBoardsIds.includes(board.id)) {
      newBoardsIds.push(board.id);
      return true;
    }
    return false;
  });


  const handleChange = () => {
    const tasks: {
      taskName: string,
      type: string,
      id: number,
    }[] = [];
    trackerIds.forEach(id => {
      let performer = performers.find(j => j.trackerId === id);
      taskSet.forEach(task => {
        tasks.push({
          taskName: `${chosenSprintText} - ${task.taskName} - ${performer?.lastName} ${performer?.firstName}`,
          type: task.type,
          id: id,
        })
      })
    })

    if (chosenSprint && !!targetQueue) {
      dispatch(
        createTasksInSprint(
          chosenSprint,
          tasks,
          targetQueue,
        ),
      );
    }
  };

  const handlePerformer = (id: number) => {
    if (trackerIds.includes(id)) {
      setTrackerIds(ids => ids.filter(i => i !== id));
    } else {
      setTrackerIds(ids => [...ids, id]);
    }
  };

  const removeTaskFromSet = (name: string) => {
    setTaskSet(set => set.filter(task => task.taskName != name));
  }

  const addTaskForSet = (name: string, type: string) => {
    setTaskSet(set => [...set, {
      taskName: name,
      type: type,
    }])
  }

  return (
    <div>
      <div className={styles.dropContainer}>

        {/* Спринты */}
        <Autocomplete
          disablePortal
          id='sprint-change'
          options={sprints.map(i => ({
            label: `${i.name} (${i.id})`,
            text: `${i.name}`,
            key: i.id,
          }))}
          onChange={(e, value) => {
            if (value?.key) {
              setChosenSprintText(value.text);
              setChosenSprint(value.key);
            }
          }}
          disabled={sprints.length === 0}
          renderInput={params => <TextField {...params} label='Спринты'/>}
        />
      </div>

      {/* Выбор исполнителя */}
      {!!chosenSprint && (
        <div className={styles.performers}>
          {performers
            .filter(i => !!i.trackerId)
            .map(performer => (
              <div
                key={performer.uuid}
                className={styles.performerItem}
                onClick={() =>
                  performer.trackerId
                    ? handlePerformer(performer.trackerId)
                    : null
                }
              >
                <Checkbox
                  checked={
                    performer?.trackerId
                      ? trackerIds.includes(performer.trackerId)
                      : false
                  }
                />
                <div>{`${performer.lastName} ${performer.firstName}`}</div>
              </div>
            ))}
        </div>
      )}


      {/* Название задачи */}
      {trackerIds.length > 0 && targetQueue && (
        <div>
          <div className={styles.taskSet}>
            {taskSet.map((task) => <div key={task.taskName} className={styles.taskEl}>
                <div className={styles.taskElName}>{task.taskName}</div>
                <div className={styles.taskElType}>{task.type}</div>
                <div className={styles.taskElRemove} onClick={() => removeTaskFromSet(task.taskName)}>X</div>
              </div>
            )}
          </div>
          <div>
            <div className={styles.name}>
              <div>{chosenSprintText} -</div>

              {/* Часть названия */}
              <TextField
                id='outlined-basic'
                label='Часть названия'
                variant='outlined'
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <div> - Фамилия Имя</div>
              <div>
                <Autocomplete
                  disablePortal
                  id='combo-box-demo'
                  className={styles2.dropTypes}
                  value={TrackerTaskTypes.find(i => i.key === type) ? TrackerTaskTypes.filter(i => i.key === type).map(i => ({
                    label: `${i.display}`,
                    key: i.key,
                  }))[0] : {key: 'organizational', label: 'Организационная'}}
                  options={TrackerTaskTypes.map(i => ({
                    label: `${i.display}`,
                    key: i.key,
                  }))}
                  onChange={(e, value) => {
                    if (value?.key) {
                      setType(value.key)
                    }
                  }}
                  disabled={newBoards.length === 0}
                  renderInput={params => <TextField {...params} label='Тип задачи'/>}
                />
              </div>
              <div className={styles2.sprintButtons}>
                <Button
                  onClick={() => {
                    addTaskForSet(name, type)
                  }}
                  color='primary'
                  variant='outlined'
                  disabled={trackerIds.length < 1 && name.length < 1}
                >
                  Добавить задачу
                </Button>
              </div>

            </div>

            {/* Создать */}
            <div className={styles2.sprintButtons}>
              <Button
                onClick={handleChange}
                color='primary'
                variant='contained'
                disabled={trackerIds.length < 1 && name.length < 1}
              >
                Создать перечисленные задачи
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreateTasksForMngmt;
