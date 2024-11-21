// redux
import { TStore } from 'store/store';
import { setQuery } from 'slices/tasksTracker';
import { useDispatch, useSelector } from 'react-redux';

// components
import Loader from 'components/loader';
import Button from '@mui/material/Button';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
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

      {/* filters */}
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

      {/* error */}
      {error && (
        <div
          className={styles.Error}
          dangerouslySetInnerHTML={{ __html: error }}
        />
      )}

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

      {!!tasksKeys.length ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            {/* table head */}
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    fontWeight: 900,
                    background: 'rgba(1, 1, 1, 0.015)',
                  },
                }}
              >
                <TableCell>№</TableCell>
                <TableCell>Код</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Исполнитель</TableCell>
                <TableCell>Спринт</TableCell>
                <TableCell>Статус</TableCell>
              </TableRow>
            </TableHead>

            {/* table body */}
            <TableBody>
              {tasksKeys.map((key, index) => {
                const sprintsList: string = !!tasks[key]?.sprint?.length
                  ? tasks[key]?.sprint
                      ?.map((sprint: any) => sprint.display)
                      .join(', ')
                  : '-';

                return (
                  <TableRow
                    key={key}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{key}</TableCell>
                    <TableCell>{tasks[key]?.summary}</TableCell>
                    <TableCell>{tasks[key]?.assignee?.display}</TableCell>
                    <TableCell>{sprintsList}</TableCell>
                    <TableCell>{tasks[key]?.status?.display}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        'Нет задач'
      )}
    </div>
  );
};

export default TasksTracker;

// TODO
// 2. Таблица ---
// 2. Удаление задачи ---
// 3. Обновить всё ---
// 4. Вывод ошибок +++
// 5. Типизация задач при запросах
// 6. Дата обновления
