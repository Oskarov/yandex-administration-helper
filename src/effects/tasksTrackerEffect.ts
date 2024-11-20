import SearchService from 'api/search-service';
import { Dispatch } from 'react';
import { addTask, setError, setLoading } from 'slices/tasksTracker';

// обработка ключей задач
function returnTasksKeys(taskKeys: string): string[] {
  if (taskKeys.includes(',')) {
    // создаем массив и удаляем пробелы
    return taskKeys.split(',').map(key => key.trim());
  }

  // возвращаем массив с одним значением
  return [taskKeys.trim()];
}

export const findAndAddTask = (tasksKey: string) => {
  // обработка ключей задач
  const taskKeysArray = returnTasksKeys(tasksKey);

  return async function (dispatch: Dispatch<any>) {
    dispatch(setLoading(true));
    dispatch(setError(''));

    const { data, success, error } =
      await SearchService.searchTasks(taskKeysArray);

    if (success && data) {
      dispatch(setLoading(false));

      // если ни одной задачи не нашлось
      if (!data.length) {
        dispatch(
          setError(
            taskKeysArray.length === 1
              ? `Задача ${taskKeysArray[0]} не найдена`
              : `Задач ${taskKeysArray.join(', ')} не найдено`,
          ),
        );
        return;
      }

      // add tasks to store
      dispatch(addTask(data));

      // если нашлись не все задачи
      if (data.length !== taskKeysArray.length) {
        const foundTasksKeys = data.map(task => task.key);

        const notFoundTasks = taskKeysArray.filter(
          taskKey => !foundTasksKeys.includes(taskKey),
        );

        dispatch(
          setError(
            notFoundTasks.length === 1
              ? `Задача ${notFoundTasks[0]} не найдена`
              : `Задач ${notFoundTasks.join(', ')} не найдено`,
          ),
        );
      }
    } else {
      dispatch(setLoading(false));
      dispatch(setError(`Ошибка поиска задачи - ${error}`));
    }
  };
};
