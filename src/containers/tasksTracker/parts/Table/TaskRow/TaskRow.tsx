// redux
import { useDispatch } from 'react-redux';
import { TShortTask } from 'interfaces/ITask';
import { removeTask, setCheckTask, setSelectTask } from 'slices/tasksTracker';
import { setConfirmationOpen } from 'slices/modal';

// utils
import { returnStatusClass } from 'containers/tasksTracker/utils';

// components
import { TableRow, TableCell, Tooltip, Checkbox } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// styles
import cn from 'classnames';
import styles from './TaskRow.module.scss';

type TProps = {
  index: number;
  task: TShortTask;
  selectedTasks: string[];
};

const TaskRow: React.FC<TProps> = ({ index, task, selectedTasks }) => {
  const dispatch = useDispatch();

  // удаление задачи из отслеживание
  const handleDelete = (key: string) => {
    dispatch(
      setConfirmationOpen({
        dialogType: 'positive',
        dialogText: `Вы точно хотите удалить задачу ${key}?`,
        confirmationFunction: () => dispatch(removeTask(key)),
      }),
    );
  };

  const isStatusUpdated =
    task.hasOwnProperty('newStatusChecked') && !task.newStatusChecked;

  const tooltipLayout = (): JSX.Element => (
    <ul className={styles.TaskRow__tooltip}>
      <li>
        <span>Получен:</span>
        &nbsp;
        <code>{task.getNewStatusAt}</code>
      </li>
      <li>
        <span>Предыдущий статус:</span>
        &nbsp;
        <code>{task.previousStatus}</code>
      </li>
    </ul>
  );

  return (
    <TableRow
      key={task.key}
      className={cn(styles.TaskRow, {
        [styles.TaskRow__hightlight]: isStatusUpdated,
      })}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      {/* Checkbox */}
      <TableCell className={styles.TaskRow__checkbox}>
        <Checkbox
          checked={selectedTasks.includes(task.key)}
          onChange={() => dispatch(setSelectTask(task.key))}
        />

        <div>{index + 1}</div>
      </TableCell>

      {/* Код */}
      <TableCell sx={{ fontSize: '16px' }}>
        <a
          target='_blank'
          rel='noreferrer'
          href={`https://tracker.yandex.ru/${task.key}`}
        >
          {task.key}
        </a>
      </TableCell>

      {/* Название */}
      <TableCell>{task.summary}</TableCell>

      {/* Проект */}
      <TableCell align='center'>{task.projectName}</TableCell>

      {/* Спринт */}
      <TableCell>{task.sprintsList}</TableCell>

      {/* Создал */}
      <TableCell>{task.createdBy}</TableCell>

      {/* Дата создания */}
      <TableCell>{task.createdAt}</TableCell>

      {/* Исполнитель */}
      <TableCell>{task.assignee}</TableCell>

      {/* Статус */}
      <TableCell
        align='center'
        className={cn(styles.TaskRow__status, {
          [styles[returnStatusClass(task.status)]]: true,
        })}
      >
        <span>{task?.status}</span>
      </TableCell>

      {/* Удаление или пометка задачи */}
      <TableCell align='center' className={styles.TaskRow__actions}>
        {isStatusUpdated ? (
          // check icon
          <Tooltip title='Отметить как просмотренный'>
            <CheckCircleIcon
              className={styles.check}
              onClick={() => dispatch(setCheckTask(task.key))}
            />
          </Tooltip>
        ) : (
          // delete icon
          <DeleteOutlineOutlinedIcon
            className={styles.delete}
            onClick={() => handleDelete(task.key)}
          />
        )}
      </TableCell>

      {/* Статус обновлён */}
      {isStatusUpdated && (
        <Tooltip title={tooltipLayout()}>
          <div className={styles.TaskRow__newStatus}>Статус обновлён</div>
        </Tooltip>
      )}
    </TableRow>
  );
};

export default TaskRow;
