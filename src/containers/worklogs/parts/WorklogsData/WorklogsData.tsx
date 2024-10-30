import styles from './WorklogsData.module.scss';
import { useSelector } from 'react-redux';
import { TStore } from 'store/store';

const WorklogsData = () => {
  // selectors
  const { loading, worklogs, selectedTasks } = useSelector((store: TStore) => {
    return {
      loading: store.worklogs.loading,
      worklogs: store.worklogs.worklogs,
      selectedTasks: store.worklogs.selectedTasks,
    };
  });

  const performersList = worklogs && Object.keys(worklogs);

  if (worklogs && !!performersList.length) {
    return (
      <>
        {Object.keys(worklogs).map((performer, index) => {
          console.log('data[performer]', worklogs[performer]);

          const performersLogDays = Object.keys(worklogs[performer]);

          return (
            <section key={index} className={styles.WorklogsData}>
              <h2>{performer}</h2>

              <div className={styles.WorklogsData__daysContainer}>
                {!!performersLogDays.length &&
                  performersLogDays.map(day => {
                    const dayTasks = worklogs[performer][day].length
                      ? worklogs[performer][day]
                      : [];

                    return (
                      <div className={styles.WorklogsData__day}>
                        {/* Дата дня */}
                        <h3>{day}</h3>

                        {/* Данные по дням */}
                        <div className={styles.WorklogsData__dayData}>
                          {/* task code and duration */}
                          {dayTasks.map((task: any) => {
                            const taskType = selectedTasks
                              ? selectedTasks[task.code]
                              : '-';

                            return (
                              <div
                                key={task.taskId}
                                className={styles.WorklogsData__task}
                              >
                                <span>
                                  <a
                                    href={`${task.link}`}
                                    target='_blank'
                                    rel='noreferrer'
                                    title={task.comment || 'Без комментариев'}
                                  >
                                    {task.code}
                                  </a>
                                </span>
                                <span>{`(${taskType})`}</span>
                                <span>{task.duration}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Итого время на день */}
                        <h4>
                          {dayTasks.reduce((total: number, item: any) => {
                            return total + item.duration;
                          }, 0)}
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
