import { TableCell, TableHead, TableRow } from '@mui/material';

const Head = () => (
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
);

export default Head;
