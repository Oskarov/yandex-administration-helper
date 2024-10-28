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
import { setDates, setPerformers, TPerformetOption } from 'slices/worklogs';
import { getWorklogs } from 'effects/worklogsEffects';

const Worklogs: React.FC = () => {
  const dispatch = useDispatch();

  // selectors
  const {
    performersOptions,
    selectedPerformers,
    dateFrom,
    dateTo,
    loading,
    worklogs,
  } = useSelector((store: TStore) => {
    return {
      // performersOptions
      performersOptions: store.performers.items.map(item => ({
        label: `${item.lastName} ${item.firstName}`,
        key: item.trackerId,
      })),

      // selectedPerformerIds
      selectedPerformers: store.worklogs.filters.performers,
      dateFrom: store.worklogs.filters.dateFrom,
      dateTo: store.worklogs.filters.dateTo,
      loading: store.worklogs.loading,
      worklogs: store.worklogs.worklogs,
    };
  });

  // интервальные запросы для получения логов
  const getWorklogsClick = () => {
    // если выбран один исполнитель
    if (selectedPerformers.length === 1) {
      return dispatch(getWorklogs(selectedPerformers, dateFrom, dateTo));

      // если выбрано несколько исполнителей
    } else {
      // сразу делаем запрос для первого
      dispatch(getWorklogs(selectedPerformers, dateFrom, dateTo));

      // и добавляем запросы для остальных с интервалом 300 мс
      let counter = 0;
      const intervalId = setInterval(() => {
        counter++;
        dispatch(getWorklogs(selectedPerformers, dateFrom, dateTo, counter));

        if (counter === selectedPerformers.length) {
          clearInterval(intervalId);
        }
      }, 300);
    }
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
            variant='outlined'
            color='primary'
            disabled={!selectedPerformers.length}
            onClick={getWorklogsClick}
            className='medium primary outlined'
          >
            Получить
          </Button>
        </div>
      </div>

      {/* bottom */}
      <div className={styles.Worklogs__bottom}>
        {/* loader */}
        <Loader loading={loading} />

        {/* show content here */}
        {worklogs && (
          <div>
            <pre>{JSON.stringify(worklogs, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Worklogs;

// TODO:
// 0. Сохранить запрос в сервисе + добавить новый слайс для ворклогов +++
// 1. Сделать из селекта выбрать исполнителя мультиселект +++
// 2. Сделать эффект для ворклогов +++

// 3. Отправлять запрос через таймаут по остальным исполнителям, так как этот эндпоинт не поддреживает массив исполнителей в поле createdBy ---

// 4. После получения данных по первому запросу, нужно сделать второй запрос, чтобы получить данные по типу задачи, так как в первом запросе нет поле type у issues

// Примерный формат данных после обработки
// {
//   имя_исполнителя1: {
//     день_1: [задача1, задача2,...], // должно быть поле type у задачи после второго запроса
//     день_2: [задача1, задача2,...],
//     ...,
//     день_n: [задача1, задача2,...],
//   },
//
//   имя_исполнителя2: {
//     день_1: [задача1, задача2,...],
//     день_2: [задача1, задача2,...],
//     ...,
//     день_n: [задача1, задача2,...],
//   },
//
//   ...,
// }
