// redux
import { TStore } from 'store/store';
import { setQuery } from 'slices/tasksTracker';
import { useDispatch, useSelector } from 'react-redux';

// components
import Loader from 'components/loader';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { findAndAddTask } from 'effects/tasksTrackerEffect';

// styles
import styles from './tasksTracker.module.scss';

const TasksTracker = () => {
  const dispatch = useDispatch();

  const { loading, error, query, tasks } = useSelector((store: TStore) => ({
    loading: store.tasksTracker.loading,
    error: store.tasksTracker.error,
    query: store.tasksTracker.query,
    tasks: store.tasksTracker.tasks,
  }));

  // запрос на поиск задачи и добавление в список отслеживания
  const onAddTaskClick = () => {
    dispatch(findAndAddTask(query));
  };

  const tasksKeys = Object.keys(tasks);

  return (
    <div className={styles.TasksTracker}>
      <Loader loading={loading} />

      <div className={styles.Filters}>
        <div className={styles.Filters__item}>
          <h2>Введите ключ задачи</h2>

          {/* Ключ задачи */}
          <TextField
            id='outlined-basic'
            label='TMS-124'
            variant='outlined'
            value={query}
            sx={{ width: 430 }}
            className={styles.queueInput}
            onChange={e => dispatch(setQuery(e.target.value))}
          />
        </div>

        {/* Добавить задачу */}
        <div className={styles.Filters__actions}>
          <Button
            onClick={onAddTaskClick}
            color='primary'
            variant='contained'
            disabled={Number(query.length) < 3}
          >
            Добавить
          </Button>
        </div>
      </div>

      {/* tasks */}
      <div className={styles.Tasks}>
        {!!tasksKeys.length
          ? tasksKeys.map((key: string) => {
              return (
                <div>
                  <b>{key}</b>
                  &nbsp;&ndash;&nbsp;
                  <span>{tasks[key]?.summary}</span>
                  &nbsp;&ndash;&nbsp;
                  <span>{tasks[key]?.status?.display}</span>
                </div>
              );
            })
          : 'Нет задач'}
      </div>
    </div>
  );
};

export default TasksTracker;

// TODO
// 1. Типизация задач при запросах
// 2. Таблица
// 3. Удаление задачи
// 4. Обновить всё
// 5. Вывод ошибок
