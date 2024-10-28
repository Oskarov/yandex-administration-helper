import React, { useState } from 'react';
import styles from './worklogs.module.scss';
import { Autocomplete, Button, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { TStore } from 'store/store';

// datepicker
import 'dayjs/locale/ru';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import httpClient from 'api/httpClient';
import Loader from 'components/loader';
import CalculateHoursFromTrackerTask from 'utils/calculateHoursFromTrackerTack';

// 2024-10-20T16:07:17+03:00 - full valid date
export const FORMAT_TYPE = 'YYYY-MM-DD';

const Worklogs: React.FC = () => {
  const dispatch = useDispatch();

  // selectors
  const { performersOptions } = useSelector((store: TStore) => ({
    performersOptions: store.performers.items.map(item => ({
      label: `${item.lastName} ${item.firstName}`,
      key: item.trackerId,
    })),
  }));

  // selected performer id
  const [selectedId, setSelectedId] = useState<string>('');

  // dates
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(dayjs(new Date()));
  const [dateTo, setDateTo] = useState<Dayjs | null>(dayjs(new Date()));

  // response
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);

  const getWorkLog = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const { data } = await httpClient.post('/worklog/_search', {
        createdBy: selectedId,
        createdAt: {
          from: `${dayjs(dateFrom).format(FORMAT_TYPE)}T00:00:00`,
          to: `${dayjs(dateTo).format(FORMAT_TYPE)}T23:59:59`,
        },
      });

      if (data) {
        setLoading(false);
        console.log('data', data);

        const newData = data.reduce((total: any, item: any) => {
          // обрезаем строку даты до формата YYYY-MM-DD
          const logDay = item.createdAt.slice(0, 10);

          // создаем объект задач с нужными нам полями
          const logTask = {
            code: item.issue.key,
            name: item.issue.display,
            link: item.issue.self,
            comment: item.comment || null,
            createdAt: item.createdAt,
            duration: CalculateHoursFromTrackerTask(item.duration),
          };

          // добавляем день как поле объекта со значениям массива залогированных задач
          total[logDay] = [...(total[logDay] || []), logTask];

          return total;
        }, {});

        setResponse(newData);
      }
    } catch (e) {
      setLoading(false);
      setResponse(e);
    }
  };

  console.log('response', response);

  return (
    <div className={styles.Worklogs}>
      {/* top */}
      <div className={styles.Worklogs__top}>
        <div className={styles.Worklogs__id}>
          <h2>Выберите исполнителя</h2>

          {/* ID исполнителя */}
          <Autocomplete
            disablePortal
            sx={{ width: 300 }}
            options={performersOptions}
            renderInput={params => (
              <TextField {...params} label='Исполнитель' value={selectedId} />
            )}
            onChange={(_event, value) =>
              setSelectedId(value?.key ? `${value.key}` : '')
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
              onChange={newValue => setDateFrom(newValue)}
            />
            &nbsp;&nbsp;
            {/* dateFrom */}
            <DatePicker
              disableFuture
              value={dateTo}
              label='Дата по'
              minDate={dayjs(dateFrom)}
              onChange={newValue => setDateTo(newValue)}
            />
          </LocalizationProvider>
        </div>

        <div className={styles.Worklogs__action}>
          <Button
            variant='outlined'
            color='primary'
            disabled={!selectedId}
            onClick={getWorkLog}
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
        {response && (
          <div>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Worklogs;

// TODO:

// 0. Сохранить запрос в сервисе + добавить новый слайс для ворклогов
// 1. Сделать из селекта выбрать исполнителя мультиселект
// 2. Отправлять запрос через таймаут по остальным исполнителям, так как этот эндпоинт не поддреживает массив исполнителей в поле createdBy
// 3. После получения данных по первому запросу, нужно сделать второй запрос, чтобы получить данные по типу задачи, так как в первом запросе нет поле type у issues

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
