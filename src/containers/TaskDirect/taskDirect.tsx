import { useState } from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
// import ReplayIcon from '@mui/icons-material/Replay';
import styles from './taskDirect.module.scss';
import { useSelector } from 'react-redux';
import { TStore } from 'store/store';

const TaskDirect = () => {
  const [task, setTask] = useState<string>('');
  // const [project, setProject] = useState<string>('');

  const { tracker } = useSelector((store: TStore) => ({
    tracker: store.tracker,
  }));

  const addTask = () => {};

  // const addProject = () => {};

  return (
    <div className={styles.TaskDirect}>
      {/* <div className={styles.reloadItem}>
          <ReplayIcon />
        </div> */}

      <div className={styles.Filters}>
        <div className={styles.Filters__item}>
          <h2>Введите ключ задачи</h2>

          {/* Ключ задачи */}
          <TextField
            id='outlined-basic'
            label='TMS-124'
            variant='outlined'
            value={task}
            sx={{ width: 430 }}
            className={styles.queueInput}
            onChange={e => setTask(e.target.value)}
          />
        </div>

        {/* Добавить задачу */}
        <div className={styles.Filters__actions}>
          <Button
            onClick={addTask}
            color='primary'
            variant='contained'
            disabled={!task.length}
          >
            Добавить
          </Button>
        </div>
      </div>

      {/* <div className={styles.TaskDirect__inputItem}>
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
        </div> */}
    </div>
  );
};

export default TaskDirect;
