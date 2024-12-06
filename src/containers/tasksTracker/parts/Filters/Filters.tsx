import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  setFilterStatus,
  setQuery,
  setResetFilters,
  setUpdatedTasks,
} from 'slices/tasksTracker';
import { findAndAddTask } from 'effects/tasksTrackerEffect';
import { TaskStatuses } from 'interfaces/ITasksTracker';
import styles from './Filters.module.scss';

type TProps = {
  query: string;
  filterStatus: TaskStatuses;
  showOnlyUpdatedTasks: boolean;
};

const Filters: React.FC<TProps> = ({
  query,
  filterStatus,
  showOnlyUpdatedTasks,
}: TProps) => {
  const dispatch = useDispatch();

  // запрос на поиск задачи и добавление в список отслеживания
  const onAddTaskClick = () => {
    dispatch(findAndAddTask(query));
  };

  const handleFilterStatusChange = (event: SelectChangeEvent<TaskStatuses>) => {
    dispatch(setFilterStatus(event.target.value as TaskStatuses));
  };

  return (
    <div className={styles.Filters}>
      {/* Введите ключ задачи */}
      <Box sx={{ display: 'flex', mr: 3 }}>
        <div className={styles.Filters__filterItem}>
          <h2>
            <b>Введите ключ задачи</b>
            <span>
              <Tooltip
                placement='top-start'
                title='Можно добавлять несколько задач через запятую'
              >
                <HelpOutlineIcon />
              </Tooltip>
            </span>
          </h2>

          {/* Ключ задачи */}
          <TextField
            id='outlined-basic'
            label='TMS-124'
            variant='outlined'
            value={query}
            sx={{ width: 430 }}
            className={styles.queueInput}
            onChange={e => dispatch(setQuery(e.target.value))}
          />
        </div>

        {/* Добавить задачу */}
        <div className={styles.Filters__actionsItem}>
          <Button
            onClick={onAddTaskClick}
            color='primary'
            variant='contained'
            disabled={Number(query.length) < 3}
          >
            Добавить
          </Button>
        </div>
      </Box>

      {/* Показывать статусы */}
      <Box sx={{ display: 'flex' }}>
        <div className={styles.Filters__filterItem}>
          <h2>Показывать статусы</h2>

          <div className={styles.Filters__statuses}>
            {/* select */}
            <FormControl>
              <InputLabel id='demo-simple-select-label'>Статус</InputLabel>

              <Select
                // multiple
                label='Статус'
                value={filterStatus}
                id='demo-simple-select'
                labelId='demo-simple-select-label'
                onChange={handleFilterStatusChange}
                sx={{ width: '200px' }}
                MenuProps={{ disableScrollLock: true }}
                input={<OutlinedInput label='Статус' />}
              >
                {Object.values(TaskStatuses).map(item => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* checkbox */}
            <FormControlLabel
              sx={{ marginLeft: '15px' }}
              control={
                <Checkbox
                  checked={showOnlyUpdatedTasks}
                  onChange={() => dispatch(setUpdatedTasks())}
                />
              }
              label='Обновлённые статусы'
            />
          </div>
        </div>

        {/* Сбросить */}
        <div className={styles.Filters__actionsItem}>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => dispatch(setResetFilters())}
            className='medium primary outlined'
          >
            Сбросить
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default Filters;
