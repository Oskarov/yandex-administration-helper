import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TStore } from '../../store/store';
import {
  createTasksInSprint,
  getAllBoardsAction,
  // getAllQueuesAction,
  getAllSprintsByBoardId,
  // getAllTasksByQueueKey,
  // getAllTasksBySprintId,
} from '../../effects/trackerEffect';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import styles2 from '../main/header/toTracker/toTracker.module.scss';
import Button from '@mui/material/Button';
import styles from './createTasks.module.scss';
// import { setLastQueue } from '../../slices/app';

const CreateTasks = () => {
  // local state
  const [chosenSprintText, setChosenSprintText] = useState('');
  const [chosenSprint, setChosenSprint] = useState<number | null>(null);
  const [trackerIds, setTrackerIds] = useState<number[]>([]);
  const [name, setName] = useState('Администрирование');
  const [targetQueue, setTargetQueue] = useState(
    localStorage.getItem('lastTargetQueue')
      ? localStorage.getItem('lastTargetQueue')
      : '',
  );

  // selectors
  const { boards, sprints, performers } = useSelector((state: TStore) => ({
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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllBoardsAction());
  }, []);

  const handleChange = () => {
    if (chosenSprint && !!targetQueue) {
      dispatch(
        createTasksInSprint(
          chosenSprint,
          trackerIds.map(i => {
            let performer = performers.find(j => j.trackerId === i);
            return {
              taskName: `${chosenSprintText} - ${name} - ${performer?.lastName} ${performer?.firstName}`,
              id: i,
            };
          }),
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
  return (
    <div>
      <div className={styles.dropContainer}>
        {/* Ключ Очереди задач (TMS) */}
        <TextField
          id='outlined-basic'
          label='Ключ Очереди задач (TMS)'
          variant='outlined'
          value={targetQueue}
          className={styles2.queueInput}
          onChange={e => {
            setTargetQueue(e.target.value);
            localStorage.setItem('', e.target.value);
          }}
        />

        {/* Доски */}
        <Autocomplete
          disablePortal
          id='combo-box-demo'
          className={styles2.autoInput}
          options={newBoards.map(i => ({
            label: `${i.name} (${i.id})`,
            key: i.id,
          }))}
          onChange={(e, value) => {
            if (value?.key) {
              dispatch(getAllSprintsByBoardId(value?.key));
            }
          }}
          disabled={newBoards.length === 0}
          renderInput={params => <TextField {...params} label='Доски' />}
        />

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
          renderInput={params => <TextField {...params} label='Спринты' />}
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
          </div>

          {/* Создать */}
          <div className={styles2.sprintButtons}>
            <Button
              onClick={handleChange}
              color='primary'
              variant='contained'
              disabled={trackerIds.length < 1 && name.length < 1}
            >
              Создать
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTasks;
