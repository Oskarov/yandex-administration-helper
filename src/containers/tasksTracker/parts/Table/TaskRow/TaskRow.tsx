// redux
import { useDispatch } from 'react-redux';
import { TShortTask } from 'interfaces/ITask';
import { removeTask } from 'slices/tasksTracker';
import { setConfirmationOpen } from 'slices/modal';

// utils
import { returnStatusClass } from 'containers/tasksTracker/utils';

// components
import { TableRow, TableCell } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// styles
import cn from 'classnames';
import styles from './TaskRow.module.scss';

type TProps = {
  index: number;
  task: TShortTask;
};

const TaskRow: React.FC<TProps> = ({ index, task }) => {
  const dispatch = useDispatch();

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
    <TableRow
      key={task.key}
      className={styles.TaskRow}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      {/* № */}
      <TableCell>{index + 1}</TableCell>

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
      <TableCell>{task?.sprintsList}</TableCell>

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

      {/* Удаление задачи */}
      <TableCell width={30} align='center' className={styles.TaskRow__delete}>
        <DeleteOutlineOutlinedIcon onClick={() => handleDelete(task.key)} />
      </TableCell>
    </TableRow>
  );
};

export default TaskRow;
