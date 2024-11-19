import { Autocomplete, TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TPerformetOption } from 'interfaces/IWorklogs';
import { setPerformers, setDates, resetFilters } from 'slices/worklogs';
import { useDispatch, useSelector } from 'react-redux';
import { TStore } from 'store/store';
import { getWorklogsMultiply } from 'effects/worklogsEffects';
import styles from './Filters.module.scss';

const Filters = () => {
  const dispatch = useDispatch();

  // selectors
  const { performersOptions, selectedPerformers, dateFrom, dateTo } =
    useSelector((store: TStore) => ({
      // performersOptions
      performersOptions: store.performers.items.map(item => ({
        label: `${item.lastName} ${item.firstName}`,
        key: item.trackerId,
      })),

      selectedPerformers: store.worklogs.filters.performers,
      dateFrom: store.worklogs.filters.dateFrom,
      dateTo: store.worklogs.filters.dateTo,
      worklogs: store.worklogs.worklogs,
      tasksData: store.worklogs.tasksData,
    }));

  const getWorklogsClick = () => {
    dispatch(getWorklogsMultiply(selectedPerformers, dateFrom, dateTo));
  };

  return (
    <div className={styles.Filters}>
      <div className={styles.Filters__id}>
        <h2>Выберите исполнителей</h2>

        {/* ID исполнителя */}
        <Autocomplete
          multiple
          disablePortal
          sx={{ width: 430 }}
          noOptionsText='Нет доступных исполнителей'
          value={selectedPerformers}
          options={performersOptions.filter(option => {
            const selectedPerformerIds = selectedPerformers.map(
              item => item.key,
            );

            return !selectedPerformerIds.includes(option.key as number);
          })}
          renderInput={params => (
            <TextField
              {...params}
              label='Исполнители'
              value={selectedPerformers}
            />
          )}
          onChange={(_event, state) =>
            dispatch(setPerformers(state as TPerformetOption[]))
          }
        />
      </div>

      <div className={styles.Filters__dates}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
          <h2>Укажите даты</h2>
          {/* dateFrom */}
          <DatePicker
            disableFuture
            value={dateFrom}
            label='Дата с'
            onChange={newValue =>
              dispatch(setDates({ name: 'dateFrom', value: newValue }))
            }
          />
          &nbsp;&nbsp;
          {/* dateFrom */}
          <DatePicker
            disableFuture
            value={dateTo}
            label='Дата по'
            minDate={dayjs(dateFrom)}
            onChange={newValue =>
              dispatch(setDates({ name: 'dateTo', value: newValue }))
            }
          />
        </LocalizationProvider>
      </div>

      <div className={styles.Filters__action}>
        <Button
          variant='contained'
          color='primary'
          disabled={!selectedPerformers.length}
          onClick={getWorklogsClick}
          className='medium primary outlined'
        >
          Получить
        </Button>

        <Button
          variant='outlined'
          color='secondary'
          onClick={() => dispatch(resetFilters())}
          className='medium primary outlined'
        >
          Сбросить
        </Button>
      </div>
    </div>
  );
};

export default Filters;
