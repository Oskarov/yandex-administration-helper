import dayjs from 'dayjs';
import styles from './WorklogsData.module.scss';
import { useSelector } from 'react-redux';
import { TStore } from 'store/store';

const WorklogsData = () => {
  // selectors
  const { worklogs, tasksData } = useSelector((store: TStore) => {
    return {
      worklogs: store.worklogs.worklogs,
      tasksData: store.worklogs.tasksData,
    };
  });

  const performersList = worklogs && Object.keys(worklogs);

  if (worklogs && !!performersList?.length) {
    return (
      <>
        {Object.keys(worklogs).map((performer, index) => {
          // console.log('data[performer]', worklogs[performer]);

          const performerLogDays = Object.keys(worklogs[performer]);

          return (
            <section key={index} className={styles.WorklogsData}>
              <h2>{performer}</h2>

              <div className={styles.WorklogsData__daysContainer}>
                {!!performerLogDays.length &&
                  performerLogDays.map(day => {
                    const dayTasks = worklogs[performer][day].length
                      ? worklogs[performer][day]
                      : [];

                    return (
                      <div className={styles.WorklogsData__day}>
                        {/* Дата дня */}
                        <h3>{dayjs(day).format('DD.MM.YYYY')}</h3>

                        {/* Данные по дням */}
                        <div className={styles.WorklogsData__dayData}>
                          {/* task code and duration */}
                          {dayTasks.map(task => {
                            const taskType = tasksData
                              ? tasksData[task.code]?.type
                              : '-';

                            return (
                              <div
                                key={task.code}
                                className={styles.WorklogsData__task}
                              >
                                <span>
                                  {/* code */}
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

                                {/* name */}
                                <span
                                  title={`Название: ${task.name}`}
                                >{`(${taskType})`}</span>

                                {/* duration */}
                                <span>{task.duration.toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Итого время на день */}
                        <h4>
                          {dayTasks
                            .reduce(
                              (total, item) => (total += item.duration),
                              0,
                            )
                            .toFixed(2)}
                        </h4>
                      </div>
                    );
                  })}
              </div>
            </section>
          );
        })}
      </>
    );
  }

  return <></>;
};

export default WorklogsData;
