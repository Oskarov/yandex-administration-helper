import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setConfirmationOpen } from 'slices/modal';
import { removeTask, setCheckTask } from 'slices/tasksTracker';
import styles from './TableHeader.module.scss';

type TProps = {
  updateDate: string;
  selectedTasks: string[];
  notCheckedTasks: string[];
  updateTasksList: () => void;
};

const TableHeader: React.FC<TProps> = ({
  updateDate,
  selectedTasks,
  notCheckedTasks,
  updateTasksList,
}) => {
  const dispatch = useDispatch();

  // массовае удаление задач
  const handleMassDelete = () => {
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

  // массовая отметка задач
  const handleMassCheck = () => {
    dispatch(
      setConfirmationOpen({
        dialogType: 'positive',
        dialogText:
          notCheckedTasks.length === 1
            ? `Вы точно хотите отметить задачу ${notCheckedTasks[0]} как просмотренную?`
            : `Вы точно хотите отметить задачи ${notCheckedTasks.join(',')} как просмотренные?`,

        // отмечаем задачи как прочитанные
        confirmationFunction: () =>
          notCheckedTasks.forEach(task => dispatch(setCheckTask(task))),
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
          <Button onClick={handleMassDelete} color='error' variant='outlined'>
            <span>Удалить</span>
            &nbsp;
            <span>{`(${selectedTasks.length} шт.)`}</span>
          </Button>

          {/* Массовая отметка задач */}
          {!!notCheckedTasks.length && (
            <Button
              onClick={handleMassCheck}
              color='primary'
              variant='outlined'
            >
              <span>Отметить</span>
              &nbsp;
              <span>{`(${notCheckedTasks.length} шт.)`}</span>
            </Button>
          )}
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
