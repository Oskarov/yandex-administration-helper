import { useDispatch } from 'react-redux';
import { Button, TextField, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { setQuery } from 'slices/tasksTracker';
import { findAndAddTask } from 'effects/tasksTrackerEffect';
import styles from './Filters.module.scss';

type TProps = {
  query: string;
};

const Filters: React.FC<TProps> = ({ query }: TProps) => {
  const dispatch = useDispatch();

  // запрос на поиск задачи и добавление в список отслеживания
  const onAddTaskClick = () => {
    dispatch(findAndAddTask(query));
  };

  return (
    <div className={styles.Filters}>
      <div className={styles.Filters__item}>
        <h2>
          <b>Введите ключ задачи</b>
          <span>
            <Tooltip
              placement='top-start'
              title='Можно добавлять несколько задач через запятую'
            >
              <HelpOutlineIcon />
            </Tooltip>
          </span>
        </h2>

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
  );
};

export default Filters;
