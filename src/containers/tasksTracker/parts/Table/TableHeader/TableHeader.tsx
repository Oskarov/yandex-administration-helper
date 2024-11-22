import { Button } from '@mui/material';

type TProps = {
  updateDate: string;
  updateTasksList: () => void;
};

const TableHeader: React.FC<TProps> = ({ updateDate, updateTasksList }) => {
  return (
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
  );
};

export default TableHeader;
