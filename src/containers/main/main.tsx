import React            from 'react';
import styles           from "./main.module.scss";
import CN from "classnames";
import ListOfPerformers from "./listOfPerformers/listOfPerformers";
import {CreateTasks} from "../createTasks";

interface MainProps {

}

const Main: React.FC<MainProps> = ({}) => {
    const [tab, setTab] = React.useState<number>(1);

    return <div className={styles.main}>
        <div className={styles.tabs}>
            <div className={CN({[styles.active]: tab === 1})} onClick={() => setTab(1)}>
                <span>
                    Статистика по спринту
                </span>
            </div>
            <div className={CN({[styles.active]: tab === 2})} onClick={() => setTab(2)}>
                <span>
                    Создание задач на спринт
                </span>
            </div>
            <div className={CN({[styles.active]: tab === 3})} onClick={() => setTab(3)}>
                <span>
                    Заведение исполнителей
                </span>
            </div>
        </div>

        <div className={styles.content}>
            {tab === 2 && <CreateTasks/>}
            {tab === 3 && <ListOfPerformers/>}
        </div>


    </div>;
}

export default Main;
