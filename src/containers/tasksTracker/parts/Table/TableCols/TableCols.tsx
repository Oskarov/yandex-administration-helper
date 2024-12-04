import { useDispatch } from 'react-redux';
import { TableCell, TableHead, TableRow } from '@mui/material';
import { TShortTaskFields } from 'interfaces/ITasksTracker';
import { setSortDirection, setSortField } from 'slices/tasksTracker';
import cn from 'classnames';
import styles from './TableCols.module.scss';

type TProps = {
  sortField: string;
  sortDirecion: string;
};

const TableCols: React.FC<TProps> = ({ sortField, sortDirecion }) => {
  const dispatch = useDispatch();

  // return sorted classes
  const returnSortClasses = (field: TShortTaskFields) => ({
    [styles.sort]: sortField === field,
    [styles.sortAsc]: sortField === field && sortDirecion === 'ASC',
    [styles.sortDesc]: sortField === field && sortDirecion === 'DESC',
  });

  const onCellClick = (field: TShortTaskFields) => {
    dispatch(sortField === field ? setSortDirection() : setSortField(field));
  };

  return (
    <TableHead>
      <TableRow
        sx={{
          '& th': {
            fontWeight: 900,
            background: 'rgba(1, 1, 1, 0.015)',
          },
        }}
      >
        {/* № */}
        <TableCell>
          <span>№</span>
        </TableCell>

        {/* Код */}
        <TableCell
          width={120}
          onClick={() => onCellClick('key')}
          className={cn(returnSortClasses('key'))}
        >
          <span>Код</span>
        </TableCell>

        {/* Название */}
        <TableCell
          onClick={() => onCellClick('summary')}
          className={cn(returnSortClasses('summary'))}
        >
          <span>Название</span>
        </TableCell>

        {/* Проект */}
        <TableCell
          width={150}
          align='center'
          onClick={() => onCellClick('projectName')}
          className={cn(returnSortClasses('projectName'))}
        >
          <span>Проект</span>
        </TableCell>

        {/* Спринт */}
        <TableCell
          onClick={() => onCellClick('sprintsList')}
          className={cn(returnSortClasses('sprintsList'))}
        >
          <span>Спринт</span>
        </TableCell>

        {/* Создал */}
        <TableCell
          onClick={() => onCellClick('createdBy')}
          className={cn(returnSortClasses('createdBy'))}
        >
          <span>Создал</span>
        </TableCell>

        {/* Дата создания */}
        <TableCell
          onClick={() => onCellClick('createdAt')}
          className={cn(returnSortClasses('createdAt'))}
        >
          <span>Дата создания</span>
        </TableCell>

        {/* Исполнитель */}
        <TableCell
          onClick={() => onCellClick('assignee')}
          className={cn(returnSortClasses('assignee'))}
        >
          <span>Исполнитель</span>
        </TableCell>

        {/* Статус */}
        <TableCell
          align='center'
          onClick={() => onCellClick('status')}
          className={cn(returnSortClasses('status'))}
        >
          <span>Статус</span>
        </TableCell>

        {/* Пустая ячейка */}
        <TableCell />
      </TableRow>
    </TableHead>
  );
};

export default TableCols;
