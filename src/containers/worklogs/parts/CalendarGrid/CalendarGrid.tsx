import dayjs from 'dayjs';
import { returnCalendarInterval, ruNamesOfDays } from 'utils/date';
import cn from 'classnames';
import styles from './CalendarGrid.module.scss';

type TProps = {
  dateFrom: dayjs.Dayjs;
  dateTo: dayjs.Dayjs;
};

const CalendarGrid: React.FC<TProps> = ({ dateFrom, dateTo }: TProps) => {
  const intervalData = returnCalendarInterval(dateFrom, dateTo);

  return (
    <div className={styles.CalendarGrid}>
      <div className={styles.CalendarGrid__weeks}>
        {!!intervalData.length &&
          ruNamesOfDays.map((day, index) => (
            <div
              key={index}
              className={cn(styles.CalendarGrid__namesOfDays, {
                [styles.holiday]: day === 'Сб' || day === 'Вс',
              })}
            >
              {day}
            </div>
          ))}

        {!!intervalData.length &&
          intervalData.map((day, index) => (
            <div
              key={index}
              className={cn(styles.CalendarGrid__day, {
                [styles.holiday]:
                  day.nameOfDay === 'Сб' || day.nameOfDay === 'Вс',
              })}
            >
              <header>
                <i>{`${day.date}.${day.month}.${day.year}`}</i>
              </header>

              <div>content</div>
            </div>
          ))}
      </div>
    </div>
  );

  if (false) {
    return (
      <div className={styles.CalendarGrid}>
        <div className={styles.CalendarGrid__weeks}>
          <div className={styles.CalendarGrid__day}>
            <header>
              <i>11 ноября</i>
              &nbsp;
              <span>(ПН)</span>
            </header>

            <div>content</div>
          </div>

          <div className={styles.CalendarGrid__day}>
            <header>
              <i>12 ноября</i>
              &nbsp;
              <span>(ВТ)</span>
            </header>

            <div>content</div>
          </div>

          <div className={styles.CalendarGrid__day}>
            <header>
              <i>13 ноября</i>
              &nbsp;
              <span>(СР)</span>
            </header>

            <div>content</div>
          </div>

          <div className={styles.CalendarGrid__day}>
            <header>
              <i>14 ноября</i>
              &nbsp;
              <span>(ЧТ)</span>
            </header>

            <div>content</div>
          </div>

          <div className={styles.CalendarGrid__day}>
            <header>
              <i>15 ноября</i>
              &nbsp;
              <span>(ПТ)</span>
            </header>

            <div>content</div>
          </div>

          <div className={styles.CalendarGrid__day}>
            <header>
              <i>16 ноября</i>
              &nbsp;
              <span>(СБ)</span>
            </header>

            <div>content</div>
          </div>

          <div className={styles.CalendarGrid__day}>
            <header>
              <i>17 ноября</i>
              &nbsp;
              <span>(ВС)</span>
            </header>

            <div>content</div>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};

export default CalendarGrid;
