import { Button } from '@mui/material';
import styles from './TableHeader.module.scss';
import { useDispatch } from 'react-redux';
import { setConfirmationOpen } from 'slices/modal';
import { removeTask } from 'slices/tasksTracker';

type TProps = {
  updateDate: string;
  selectedTasks: string[];
  updateTasksList: () => void;
};

const TableHeader: React.FC<TProps> = ({
  updateDate,
  selectedTasks,
  updateTasksList,
}) => {
  const dispatch = useDispatch();

  // удаление задачи из отслеживание
  const handleDelete = () => {
    dispatch(
      setConfirmationOpen({
        dialogType: 'positive',
        dialogText:
          selectedTasks.length === 1
            ? `Вы точно хотите удалить задачу ${selectedTasks[0]}?`
            : `Вы точно хотите удалить задачи ${selectedTasks.join(',')}?`,

        // удаление задач из стора
        confirmationFunction: () =>
          selectedTasks.forEach(task => dispatch(removeTask(task))),
      }),
    );
  };

  return (
    <header className={styles.TableHeader}>
      {/* Отслеживаемые задачи */}
      <b>Отслеживаемые задачи</b>

      {/* Массовые действия */}
      {!!selectedTasks.length && (
        <div className={styles.TableHeader__massActions}>
          {/* Массовое удаление задач */}
          <Button onClick={handleDelete} color='error' variant='outlined'>
            <span>Удалить</span>
            &nbsp;
            <span>{`(${selectedTasks.length} шт.)`}</span>
          </Button>

          {/* Массовая отметка задач */}
          {/* <Button onClick={() => null} color='primary' variant='outlined'>
          <span>Отметить</span>
          &nbsp;
          <span>{`(${selectedTasks.length} шт.)`}</span>
        </Button> */}
        </div>
      )}

      {/* Последнее обновление */}
      {updateDate && (
        <span className={styles.TableHeader__updateDate}>
          <span>Последнее обновление:</span>
          &nbsp;
          <code>{updateDate}</code>
        </span>
      )}

      {/* Обновить */}
      <Button onClick={updateTasksList} color='primary' variant='text'>
        Обновить
      </Button>
    </header>
  );
};

export default TableHeader;
