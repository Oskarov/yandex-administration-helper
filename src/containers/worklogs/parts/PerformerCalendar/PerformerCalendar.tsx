import dayjs from 'dayjs';
import { useMemo } from 'react';
import { TStore } from 'store/store';
import { useSelector } from 'react-redux';
import { returnCalendarInterval, TDate } from 'utils/date';

// components
import { DayInfo, DaysNames } from './parts';

// styles
import styles from './PerformerCalendar.module.scss';

type TProps = {
  performerName: string;
};

const PerformerCalendar: React.FC<TProps> = ({ performerName }: TProps) => {
  // selectors
  const { dateFrom, dateTo, tasksData, worklogs } = useSelector(
    (store: TStore) => ({
      dateFrom: store.worklogs.filters.dateFrom,
      dateTo: store.worklogs.filters.dateTo,
      tasksData: store.worklogs.tasksData,
      worklogs: store.worklogs.worklogs,
    }),
  );

  // создаем массив дней для мапинга календаря
  const performerInterval: TDate[] = useMemo(() => {
    return returnCalendarInterval(
      dateFrom as dayjs.Dayjs,
      dateTo as dayjs.Dayjs,
    );
  }, [tasksData]);

  return (
    <div className={styles.PerformerCalendar}>
      {/* performer */}
      <h2>{performerName}</h2>

      {/* calendar */}
      <div className={styles.PerformerCalendar__calendar}>
        {/* Дни недели */}
        {!!performerInterval.length && <DaysNames />}

        {/* мапим Дни интервала, передавая даные по ворклогам */}
        {!!performerInterval.length &&
          performerInterval.map(day => (
            <DayInfo day={day} performerData={worklogs![performerName]} />
          ))}
      </div>
    </div>
  );
};

export default PerformerCalendar;
