import { useSelector } from 'react-redux';
import { TStore } from 'store/store';
import { TCellType, TDate } from 'utils/date';
import { TWorklogTaskData } from 'interfaces/IWorklogs';

// styles
import cn from 'classnames';
import styles from './DayInfo.module.scss';

type TProps = {
  day: TDate;
  performerData: Record<string, TWorklogTaskData[]>;
};

const DayInfo: React.FC<TProps> = ({ day, performerData }) => {
  // selectors
  const tasksData = useSelector((store: TStore) => store.worklogs.tasksData);

  return (
    <div
      key={day.value}
      className={cn(styles.DayInfo, styles[day.cellType as TCellType], {
        [styles.weekend]: day.nameOfDay === 'Сб' || day.nameOfDay === 'Вс',
      })}
    >
      {/* day value */}
      <header>
        <i>{`${day.date}.${day.month}.${day.year}`}</i>
      </header>

      {/* day worklog content */}
      <div>
        {!!performerData[day.value]?.length &&
          performerData[day.value].map((task, index) => {
            const taskType = tasksData ? tasksData[task.code]?.type : '-';

            const dayTasks = performerData[day.value].length
              ? performerData[day.value]
              : [];

            return (
              <div key={task.code + index} className={styles.DayInfo__task}>
                {/* task.code */}
                <span>
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href={`https://tracker.yandex.ru/${task.code}`}
                    title={`Комментарий: ${task.comment}` || 'Без комментариев'}
                  >
                    {task.code}
                  </a>
                </span>

                {/* taskType */}
                <span title={`Название: ${task.name}`}>{`(${taskType})`}</span>

                {/* duration */}
                <span>{task.duration.toFixed(2)}</span>

                {/* total duration */}
                <i>
                  {dayTasks
                    .reduce((total, item) => (total += item.duration), 0)
                    .toFixed(2)}
                </i>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DayInfo;
