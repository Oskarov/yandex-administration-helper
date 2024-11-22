// redux
import { useEffect, useState } from 'react';

// redux
import { TStore } from 'store/store';
import { removeTask } from 'slices/tasksTracker';
import { useDispatch, useSelector } from 'react-redux';
import { findAndAddTask } from 'effects/tasksTrackerEffect';

// utils
import { returnDateString } from './utils';

// components
import Loader from 'components/loader';
import { Paper, Table, TableBody, TableContainer } from '@mui/material';
import { setConfirmationOpen } from 'slices/modal';

// parts
import { Error, Filters, TableCols, TableHeader, TaskRow } from './parts';

// styles
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
      !error && setUpdateDate(returnDateString());
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

      {/* tasks table */}
      {!!tasksKeys.length ? (
        <div className={styles.TasksTracker__tasks}>
          {/* table header */}
          <TableHeader
            updateDate={updateDate}
            updateTasksList={updateTasksList}
          />

          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label='simple table'
              className={styles.TasksTracker__table}
            >
              {/* table columns */}
              <TableCols />

              {/* table body */}
              <TableBody>
                {tasksKeys.map((key, index) => (
                  <TaskRow index={index} task={tasks[key]} />
                ))}
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
