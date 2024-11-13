import { Dispatch } from 'react';
import QueueService from "../api/queue-service";
import {addDirectTask} from "../slices/tasks";


export const getDirectTask = (task:string) => {
  return async function (dispatch: Dispatch<any>) {
    const response = await QueueService.getTaskByKey(task);
    if (response.success && response.data) {

    }
  };
};
