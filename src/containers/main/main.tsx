import React from 'react';

// constent
import ListOfPerformers from './listOfPerformers/listOfPerformers';
import { CreateTasks } from '../createTasks';
import Statistics from '../statistics/statistics';
import Worklogs from 'containers/worklogs/worklogs';
// import {CreateTasks} from "../createTasks";
import { Stats } from './stats/stats';

// styles
import CN from 'classnames';
import styles from './main.module.scss';
import {TaskDirect} from "../TaskDirect/taskDirect";

interface MainProps {}

export const tabs: string[] = [
  'Статистика по спринту',
  'Создание задач на спринт',
  'Заведение исполнителей',
  'Ворклоги',
  'Отслеживание задач'
];

const Main: React.FC<MainProps> = () => {
  const [tab, setTab] = React.useState<number>(1);

  return (
    <div className={styles.main}>
      <div className={styles.tabs}>
        {tabs.map((item, index) => (
          <div
            key={`${index + 1} - ${item}`}
            onClick={() => setTab(index + 1)}
            className={CN({ [styles.active]: tab === index + 1 })}
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
        {tab === 5 && <TaskDirect />}
      </div>
    </div>
  );
};

export default Main;
