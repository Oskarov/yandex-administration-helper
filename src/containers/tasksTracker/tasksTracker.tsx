// redux
import { TStore } from 'store/store';
import { setQuery } from 'slices/tasksTracker';
import { useDispatch, useSelector } from 'react-redux';

// components
import Loader from 'components/loader';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

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

  const addTask = () => {};

  // const addProject = () => {};

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
            onClick={addTask}
            color='primary'
            variant='contained'
            disabled={Number(query.length) < 3}
          >
            Добавить
          </Button>
        </div>
      </div>

      <div className={styles.Tasks}>{/* tasks maping */}</div>
    </div>
  );
};

export default TasksTracker;

// const [project, setProject] = useState<string>('');
// import ReplayIcon from '@mui/icons-material/Replay';

{
  /* <div className={styles.reloadItem}>
          <ReplayIcon />
        </div> */
}

{
  /* <div className={styles.TaskDirect__inputItem}>
          <TextField
            id='outlined-basic'
            label='Номер проекта (1985)'
            variant='outlined'
            value={project}
            className={styles.queueInput}
            onChange={e => setProject(e.target.value)}
          />

          <Button
            onClick={addProject}
            color='primary'
            variant='contained'
            disabled={!task.length}
          >
            Добавить проект
          </Button>
        </div> */
}
