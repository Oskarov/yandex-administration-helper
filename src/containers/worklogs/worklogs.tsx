import React, { useState } from 'react'
import styles from './worklogs.module.scss';
import { Autocomplete, Button, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { TStore } from 'store/store';

// datepicker
import 'dayjs/locale/ru';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export const FORMAT_TYPE = 'YYYY-MM-DDThh:mm:ss.sss±hhmm';

const Worklogs: React.FC = () =>  {
  // selectors
  const performersOptions = useSelector((store: TStore) => store.performers.items);

  // local state
  const [selectedId, setSelectedId] = useState<string>('');

  // dayjs('2022-04-17')
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(dayjs(new Date())); 
  const [dateTo, setDateTo] = useState<Dayjs | null>(dayjs(new Date()));

  // const a = dayjs(dateFrom).format(FORMAT_TYPE);
  // console.log('a', a);

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
            options={performersOptions.map(item => ({
              label: `${item.lastName} ${item.firstName}`,
              key: item.trackerId,
            }))}
            renderInput={(params) => <TextField {...params} label="ID исполнителя" value={selectedId} />}
            onChange={(_event, value) => setSelectedId(value?.key ? `${value.key}` : '')}
          />
        </div>

        <div className={styles.Worklogs__dates}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <h2>Укажите даты</h2>

            {/* dateFrom */}
            <DatePicker
              disableFuture
              value={dateFrom}
              label="Дата с"
              onChange={(newValue) => setDateFrom(newValue)}
            />

            &nbsp;&nbsp;

            {/* dateFrom */}
            <DatePicker
              disableFuture
              value={dateTo}
              label="Дата по"
              onChange={(newValue) => setDateTo(newValue)}
            />
          </LocalizationProvider>
        </div>
        
        <div className={styles.Worklogs__action}>
          <Button
            variant="outlined"
            color="primary"
            disabled={!selectedId}
            onClick={() => alert('Отправить запрос')}
            className="medium primary outlined"
          >
            Получить
          </Button>
        </div>
      </div>

      {/* bottom */}
      <div className={styles.Worklogs__bottom}>

      </div>
    </div>
  );
};

export default Worklogs;
