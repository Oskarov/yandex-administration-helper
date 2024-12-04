// redux
import { useEffect, useState } from 'react';

// redux
import { TStore } from 'store/store';
import { useDispatch, useSelector } from 'react-redux';
import { findAndAddTask } from 'effects/tasksTrackerEffect';

// utils
import { returnDateString } from './utils';

// components
import Loader from 'components/loader';
import { Paper, Table, TableBody, TableContainer } from '@mui/material';

// parts
import { Error, Filters, TableCols, TableHeader, TaskRow } from './parts';

// styles
import styles from './tasksTracker.module.scss';
import { setSortDirection } from 'slices/tasksTracker';

const TasksTracker = () => {
  const dispatch = useDispatch();

  // local state
  const [updateDate, setUpdateDate] = useState<string>('');

  // selectors
  const {
    loading,
    error,
    query,
    tasks,
    // sortField,
    // sortDirecion,
  } = useSelector((store: TStore) => ({
    loading: store.tasksTracker.loading,
    error: store.tasksTracker.error,
    query: store.tasksTracker.query,

    // items
    tasks: store.tasksTracker.tasks,

    // sort
    // sortField: store.tasksTracker.sortField,
    // sortDirecion: store.tasksTracker.sortDirecion,
  }));

  // экшен на обновление данных у существующих задач
  const updateTasksList = (): void => {
    const tasksKeys = !!tasks.length && tasks.map(task => task.key).join(',');

    if (tasksKeys) {
      dispatch(findAndAddTask(tasksKeys));
      !error && setUpdateDate(returnDateString());
    }
  };

  // запрос на обновление задач при загрузке страницы
  useEffect(() => {
    updateTasksList();
  }, []);

  return (
    <div className={styles.TasksTracker}>
      <Loader loading={loading} />

      {/* filters */}
      <Filters query={query} />

      {/* error */}
      {error && <Error error={error} />}

      {/* tasks table */}
      {!!tasks.length ? (
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
                {tasks.map((task, index) => (
                  <TaskRow index={index} task={task} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        'Нет задач'
      )}

      <button onClick={() => dispatch(setSortDirection())}>
        Change sort direction
      </button>
    </div>
  );
};

export default TasksTracker;
