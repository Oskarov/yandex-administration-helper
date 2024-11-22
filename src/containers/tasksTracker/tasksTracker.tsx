// redux
import { useEffect, useState } from 'react';

// redux
import { TStore } from 'store/store';
import { removeTask } from 'slices/tasksTracker';
import { useDispatch, useSelector } from 'react-redux';
import { findAndAddTask } from 'effects/tasksTrackerEffect';

// utils
import { returnDateString, returnStatusClass } from './utils';

// components
import Loader from 'components/loader';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { setConfirmationOpen } from 'slices/modal';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// parts
import { Error, Filters } from './parts';

// styles
import cn from 'classnames';
import styles from './tasksTracker.module.scss';

const TasksTracker = () => {
  const dispatch = useDispatch();

  // local state
  const [updateDate, setUpdateDate] = useState<string>('');

  // selectors
  const { loading, error, query, tasks } = useSelector((store: TStore) => ({
    loading: store.tasksTracker.loading,
    error: store.tasksTracker.error,
    query: store.tasksTracker.query,
    tasks: store.tasksTracker.tasks,
  }));

  // экшен на обновление данных у существующих задач
  const updateTasksList = (): void => {
    const tasksKeys =
      !!Object.keys(tasks).length && Object.keys(tasks).join(',');

    if (tasksKeys) {
      dispatch(findAndAddTask(tasksKeys));
      setUpdateDate(returnDateString());
    }
  };

  // запрос на обновление задач при загрузке страницы
  useEffect(() => {
    updateTasksList();
  }, []);

  const tasksKeys = Object.keys(tasks);

  // удаление задачи из списка
  const handleDelete = (key: string) => {
    dispatch(
      setConfirmationOpen({
        dialogType: 'positive',
        dialogText: `Вы точно хотите удалить задачу ${key}?`,
        confirmationFunction: () => dispatch(removeTask(key)),
      }),
    );
  };

  return (
    <div className={styles.TasksTracker}>
      <Loader loading={loading} />

      {/* filters */}
      <Filters query={query} />

      {/* error */}
      {error && <Error error={error} />}

      {/* tasks */}
      {!!tasksKeys.length ? (
        <div className={styles.Tasks}>
          <header>
            <b>Отслеживаемые задачи</b>

            {updateDate && (
              <span>
                <span>Последнее обновление:</span>
                &nbsp;
                <code>{updateDate}</code>
              </span>
            )}

            <Button onClick={updateTasksList} color='primary' variant='text'>
              Обновить
            </Button>
          </header>

          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label='simple table'
              className={styles.Table}
            >
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
                  <TableCell>Спринт</TableCell>
                  <TableCell>Создал</TableCell>
                  <TableCell>Дата создания</TableCell>
                  <TableCell>Исполнитель</TableCell>
                  <TableCell align='center'>Статус</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>

              {/* table body */}
              <TableBody>
                {tasksKeys.map((key, index) => {
                  const sprintsList: string =
                    !!tasks[key]?.sprint?.length &&
                    tasks[key]?.sprint
                      ?.map((sprint: any) => sprint.display)
                      .join(', ');
                  return (
                    <TableRow
                      key={key}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      className={styles.Table__row}
                    >
                      {/* № */}
                      <TableCell>{index + 1}</TableCell>

                      {/* Код */}
                      <TableCell sx={{ fontSize: '16px' }}>
                        <a
                          target='_blank'
                          rel='noreferrer'
                          href={`https://tracker.yandex.ru/${key}`}
                        >
                          {key}
                        </a>
                      </TableCell>

                      {/* Название */}
                      <TableCell>{tasks[key]?.summary}</TableCell>

                      {/* Спринт */}
                      <TableCell>{sprintsList}</TableCell>

                      {/* Создал */}
                      <TableCell>{tasks[key]?.createdBy?.display}</TableCell>

                      {/* Дата создания */}
                      <TableCell>
                        {tasks[key]?.createdAt.slice(0, 10)}
                      </TableCell>

                      {/* Исполнитель */}
                      <TableCell>{tasks[key]?.assignee?.display}</TableCell>

                      {/* Статус */}
                      <TableCell
                        align='center'
                        className={cn(styles.Table__status, {
                          [styles[
                            returnStatusClass(tasks[key]?.status?.display)
                          ]]: true,
                        })}
                      >
                        <span>{tasks[key]?.status?.display}</span>
                      </TableCell>

                      {/* Удаление задачи */}
                      <TableCell
                        width={30}
                        align='center'
                        className={styles.Table__delete}
                      >
                        <DeleteOutlineOutlinedIcon
                          onClick={() => handleDelete(key)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        'Нет задач'
      )}
    </div>
  );
};

export default TasksTracker;

// TODO
// 1. Модалка подтверждения +++
// 2. Толтип с подсказкой +++
// 3. Типизация +++
// 4. Декомпозиция ---
