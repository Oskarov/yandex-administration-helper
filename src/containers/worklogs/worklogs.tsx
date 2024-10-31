import React from 'react';
import styles from './worklogs.module.scss';
import { Autocomplete, Button, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { TStore } from 'store/store';

// datepicker
import 'dayjs/locale/ru';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Loader from 'components/loader';
import {
  resetFilters,
  setDates,
  setPerformers,
  TPerformetOption,
} from 'slices/worklogs';
import { getWorklogsMultiply } from 'effects/worklogsEffects';
// import Debug from './parts/Debug/Debug';
import WorklogsData from './parts/WorklogsData/WorklogsData';

const Worklogs: React.FC = () => {
  const dispatch = useDispatch();

  // selectors
  const {
    performersOptions,
    selectedPerformers,
    dateFrom,
    dateTo,
    loading,
    errors,
  } = useSelector((store: TStore) => {
    return {
      // performersOptions
      performersOptions: store.performers.items.map(item => ({
        label: `${item.lastName} ${item.firstName}`,
        key: item.trackerId,
      })),

      selectedPerformers: store.worklogs.filters.performers,
      dateFrom: store.worklogs.filters.dateFrom,
      dateTo: store.worklogs.filters.dateTo,
      loading: store.worklogs.loading,
      errors: store.worklogs.errors,
      worklogs: store.worklogs.worklogs,
      tasksData: store.worklogs.tasksData,
    };
  });

  // интервальные запросы для получения логов
  const getWorklogsClick = () => {
    dispatch(getWorklogsMultiply(selectedPerformers, dateFrom, dateTo));
  };

  return (
    <div className={styles.Worklogs}>
      {/* top */}
      <div className={styles.Worklogs__top}>
        <div className={styles.Worklogs__id}>
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

        <div className={styles.Worklogs__dates}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
            <h2>Укажите даты</h2>
            {/* dateFrom */}
            <DatePicker
              disableFuture
              value={dateFrom}
              label='Дата с'
              onChange={newValue =>
                // save data to Redux store
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
                // save data to Redux store
                dispatch(setDates({ name: 'dateTo', value: newValue }))
              }
            />
          </LocalizationProvider>
        </div>

        <div className={styles.Worklogs__action}>
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

      {/* bottom */}
      <div className={styles.Worklogs__bottom}>
        {/* loader */}
        <Loader loading={loading} />

        <main className={styles.Worklogs__content}>
          {/* error */}
          {!!errors.length &&
            errors.map(error => (
              <section>
                <div>
                  <div style={{ color: 'red' }}>
                    <pre>{JSON.stringify(error, null, 2)}</pre>
                  </div>
                </div>
              </section>
            ))}

          {/* worklogs */}
          <WorklogsData />

          {/* JSON debug output */}
          {/* <Debug /> */}
        </main>
      </div>
    </div>
  );
};

export default Worklogs;
