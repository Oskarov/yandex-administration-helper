import React, {FC, useState} from 'react';
import {TextField} from "@mui/material";
import styles2 from "../main/header/toTracker/toTracker.module.scss";
import styles from "./index.module.scss"
import Button from "@mui/material/Button";
import ReplayIcon from '@mui/icons-material/Replay';

export const TaskDirect: FC = ({  }) => {

    const [task, setTask] = useState<string>('');
    const [project, setProject] = useState<string>('');

    const addTask = () => {

    }

    const addProject = () => {

    }

    return  <div>
      <div className={styles.inputBlock}>
        <div className={styles.reloadItem}>
          <ReplayIcon/>
        </div>
        <div className={styles.inputItem}>
          <TextField id="outlined-basic" label="Ключ задачи (TMS-124)" variant="outlined" value={task}
                     className={styles.queueInput}
                     onChange={(e) => {
                       setTask(e.target.value);
                     }}/>
          <Button onClick={addTask} color={'primary'} variant={'contained'}
                  disabled={!task.length}>добавить задачу </Button>
        </div>
        <div className={styles.inputItem}>
          <TextField id="outlined-basic" label="Номер проекта (1985)" variant="outlined" value={project}
                     className={styles.queueInput}
                     onChange={(e) => {
                       setProject(e.target.value);
                     }}/>
          <Button onClick={addProject} color={'primary'} variant={'contained'}
                  disabled={!task.length}>добавить Проект </Button>
        </div>
      </div>


    </div>
}
