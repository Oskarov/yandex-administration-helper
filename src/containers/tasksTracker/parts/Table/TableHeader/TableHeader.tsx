import { Button } from '@mui/material';
import styles from './TableHeader.module.scss';

type TProps = {
  updateDate: string;
  selectedTasks: string[];
  updateTasksList: () => void;
};

const TableHeader: React.FC<TProps> = ({
  updateDate,
  selectedTasks,
  updateTasksList,
}) => (
  <header className={styles.TableHeader}>
    {/* Отслеживаемые задачи */}
    <b>Отслеживаемые задачи</b>

    {/* Массовые действия */}
    {!!selectedTasks.length && (
      <div className={styles.TableHeader__massActions}>
        {/* Массовая отметка задач */}
        <Button onClick={() => null} color='primary' variant='outlined'>
          <span>Отметить</span>
          &nbsp;
          <span>{`(${selectedTasks.length} шт.)`}</span>
        </Button>

        {/* Массовое удаление задач */}
        <Button onClick={() => null} color='error' variant='outlined'>
          <span>Удалить</span>
          &nbsp;
          <span>{`(${selectedTasks.length} шт.)`}</span>
        </Button>
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

export default TableHeader;
