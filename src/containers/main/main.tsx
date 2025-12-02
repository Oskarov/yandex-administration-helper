import { FC, useState, useEffect } from 'react';

// parts
// Статистика по спринту
import Stats from 'containers/stats/stats';

// Создание задач на спринт
import CreateTasks from 'containers/createTasks/createTasks';

// Заведение исполнителей
import ListOfPerformers from 'containers/listOfPerformers/listOfPerformers';

// Ворклоги
import Worklogs from 'containers/worklogs/worklogs';

// Отслеживание задач
import TasksTracker from 'containers/tasksTracker/tasksTracker';

// styles
import cn from 'classnames';
import styles from './main.module.scss';
import CreateTasksForMngmt from "../createTasksForMngmt/createTasksForMngmt";

export const tabs: string[] = [
  'Статистика по спринту',
  'Создание задач на спринт',
  'Заведение исполнителей',
  'Ворклоги',
  'Отслеживание задач',
];

const Main: FC = () => {
  const [tab, setTab] = useState<number>(1);
  const [secretTabsCount, setSecretTabsCount] = useState(0)

  // title
  useEffect(() => {
    switch (tab) {
      case 1:
        document.title = 'Я.Трекер - Статистика по спринту';
        return;
      case 2:
        document.title = 'Я.Трекер - Создание задач на спринт';
        return;
      case 3:
        document.title = 'Я.Трекер - Заведение исполнителей';
        return;
      case 4:
        document.title = 'Я.Трекер - Ворклоги';
        return;
      case 5:
        document.title = 'Я.Трекер - Отслеживание задач';
        return;
      case 6:
        document.title = 'Я.Трекер - Заведение задач MGMNT';
        return;

      default:
        document.title = 'Я.Трекер';
        return;
    }
  }, [tab]);

  useEffect(() => {
    if (secretTabsCount == 10){
      tabs.push('Заведение задач в MGMNT')
    }
  }, [secretTabsCount]);

  return (
    <div className={styles.main}>
      <div className={styles.tabs}>
        {tabs.map((item, index) => (
          <div
            key={`${index + 1} - ${item}`}
            onClick={() => {
              if (tab === 1){
                setSecretTabsCount(s=>++s)
              }
              setTab(index + 1)}}
            className={cn({ [styles.active]: tab === index + 1 })}
          >
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        {/* Статистика по спринту */}
        {tab === 1 && <Stats />}

        {/* Создание задач на спринт */}
        {tab === 2 && <CreateTasks />}

        {/* Заведение исполнителей */}
        {tab === 3 && <ListOfPerformers />}

        {/* Ворклоги */}
        {tab === 4 && <Worklogs />}

        {/* Отслеживание задач */}
        {tab === 5 && <TasksTracker />}

        {/* Заведение MGMNT */}
        {tab === 6 && <CreateTasksForMngmt />}
      </div>
    </div>
  );
};

export default Main;
