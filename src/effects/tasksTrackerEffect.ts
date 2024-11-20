import SearchService from 'api/search-service';
import { Dispatch } from 'react';
import { addTask, setError, setLoading } from 'slices/tasksTracker';

export const findAndAddTask = (taskCode: string) => {
  return async function (dispatch: Dispatch<any>) {
    dispatch(setLoading(true));
    dispatch(setError(''));

    const { data, success, error } = await SearchService.searchTasks([
      taskCode,
    ]);

    if (success && data) {
      dispatch(setLoading(false));

      // no data
      if (!data.length) {
        dispatch(setError(`Задача ${taskCode} не найдена`));
        alert(`Задача ${taskCode} не найдена`);
        return;
      }

      // add tasks to store
      dispatch(addTask(data[0]));
    } else {
      dispatch(setLoading(false));
      dispatch(setError(`Ошибка поиска задачи - ${error}`));
    }
  };
};
