import dayjs from 'dayjs';
import { returnCalendarInterval, ruNamesOfDays } from 'utils/date';
import { TWorklogTaskData } from 'interfaces/IWorklogs';
import { useSelector } from 'react-redux';
import { TStore } from 'store/store';

// styles
import cn from 'classnames';
import styles from './PerformerCalendar.module.scss';

type TProps = {
  performer: string;
  performerData: Record<string, TWorklogTaskData[]>;
};

const PerformerCalendar: React.FC<TProps> = ({
  performer,
  performerData,
}: TProps) => {
  // selectors
  const { dateFrom, dateTo, tasksData } = useSelector((store: TStore) => ({
    dateFrom: store.worklogs.filters.dateFrom,
    dateTo: store.worklogs.filters.dateTo,
    tasksData: store.worklogs.tasksData,
  }));

  const performerInterval = returnCalendarInterval(
    dateFrom as dayjs.Dayjs,
    dateTo as dayjs.Dayjs,
  );

  return (
    <div className={styles.PerformerCalendar}>
      {/* performer */}
      <h2>{performer}</h2>

      {/* calendar */}
      <div className={styles.PerformerCalendar__calendar}>
        {/* Дни недели */}
        {!!performerInterval.length &&
          ruNamesOfDays.map((day, index) => (
            <div
              key={index}
              className={cn(styles.PerformerCalendar__calendarTop, {
                [styles.holiday]: day === 'Сб' || day === 'Вс',
              })}
            >
              {day}
            </div>
          ))}

        {/* Дни интервала */}
        {!!performerInterval.length &&
          performerInterval.map((day, index) => (
            <div
              key={index}
              className={cn(styles.PerformerCalendar__day, {
                [styles.weekend]:
                  day.nameOfDay === 'Сб' || day.nameOfDay === 'Вс',
              })}
            >
              <header>
                <i>{`${day.date}.${day.month}.${day.year}`}</i>
              </header>

              {/* day worklog content */}
              <div>
                {!!performerData[day.value as string]?.length &&
                  performerData[day.value as string].map((task, index) => {
                    const taskType = tasksData
                      ? tasksData[task.code]?.type
                      : '-';

                    const dayTasks = performerData[day.value as string].length
                      ? performerData[day.value as string]
                      : [];

                    return (
                      <div
                        key={task.code + index}
                        className={styles.PerformerCalendar__task}
                      >
                        {/* task.code */}
                        <span>
                          <a
                            href={`https://tracker.yandex.ru/${task.code}`}
                            target='_blank'
                            rel='noreferrer'
                            title={
                              `Комментарий: ${task.comment}` ||
                              'Без комментариев'
                            }
                          >
                            {task.code}
                          </a>
                        </span>

                        {/* taskType */}
                        <span
                          title={`Название: ${task.name}`}
                        >{`(${taskType})`}</span>

                        {/* duration */}
                        <span>{task.duration.toFixed(2)}</span>

                        {/* total duration */}
                        <i>
                          {dayTasks
                            .reduce(
                              (total, item) => (total += item.duration),
                              0,
                            )
                            .toFixed(2)}
                        </i>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PerformerCalendar;
