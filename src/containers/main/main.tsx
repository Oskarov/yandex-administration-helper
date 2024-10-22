import React            from 'react';

// constent
import ListOfPerformers from "./listOfPerformers/listOfPerformers";
import { CreateTasks }  from "../createTasks";
import Statistics       from '../statistics/statistics';
import Worklogs         from 'containers/worklogs/worklogs';

// styles
import CN               from "classnames";
import styles           from "./main.module.scss";

interface MainProps {}

export const tabs: string[] = [
    'Статистика по спринту', 
    'Создание задач на спринт', 
    'Заведение исполнителей', 
    'Ворклоги',
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
                        className={CN({[styles.active]: tab === index + 1})} 
                    >
                        <span>{item}</span>
                    </div>
                ))}
            </div>

            <div className={styles.content}>
                {/* Статистика по спринту */}
                {tab === 1 && <Statistics />}

                {/* Создание задач на спринт */}
                {tab === 2 && <CreateTasks/>}

                {/* Заведение исполнителей */}
                {tab === 3 && <ListOfPerformers/>}

                {/* Ворклоги */}
                {tab === 4 && <Worklogs />}
            </div>
        </div>
    );
}

export default Main;
