import { Dispatch } from 'react';
import { store } from 'store/store';
import { TShortTask } from 'interfaces/ITask';
import SearchService from 'api/search-service';
import { addTask, setError, setLoading } from 'slices/tasksTracker';
import { returnDateString } from 'containers/tasksTracker/utils';

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

  // saved tasks from the persist slice
  const savedTasksData = store.getState().tasksTracker.tasks;

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
              ? `Задача <b>${taskKeysArray[0]}</b> не найдена`
              : `Задачи <b>${taskKeysArray.join(', ')}</b> не найдены`,
          ),
        );
        return;
      }

      const _data = data.map(task => {
        // ищем такую же задачу в сторе
        const oldTaskData = savedTasksData.find(item => item.key === task.key);

        // sprintsList
        const sprintsList = !!task?.sprint?.length
          ? task?.sprint?.map(sprint => sprint.display).join(', ')
          : '-';

        // projectName
        const projectName =
          task?.project?.id && task?.project?.display
            ? `${task?.project?.id} - ${task?.project?.display}`
            : '-';

        // общие поля задачи
        const taskCommonFields = {
          key: task.key,
          summary: task.summary,
          projectName,
          sprintsList,
          createdBy: task?.createdBy?.display,
          createdAt: task?.createdAt.slice(0, 10),
          assignee: task?.assignee?.display,
          status: task?.status?.display,
        };

        // если такая задача уже была сохранена в сторе и статус задачи изменился, то возвращаем общие поля + дополнительные
        if (oldTaskData && oldTaskData?.status !== task.status?.display) {
          return {
            ...taskCommonFields,

            // добавляем дополнительные поля
            previousStatus: oldTaskData?.status, // предыдущий статус
            getNewStatusAt: returnDateString(), // дата и время, когда получили новый статус
            newStatusChecked: false, // добавляем поле для подтверждения
          };
          // если статус задачи НЕ изменился или такой задачи еще не было, то возвращаем старые поля + пришедшие общие поля
        } else {
          return {
            ...oldTaskData,
            ...taskCommonFields,
          };
        }
      });

      // add tasks to store
      dispatch(addTask(_data as TShortTask[]));

      // если нашлись не все задачи
      if (data.length !== taskKeysArray.length) {
        const foundTasksKeys = data.map(task => task.key);

        const notFoundTasks = taskKeysArray.filter(
          taskKey => !foundTasksKeys.includes(taskKey),
        );

        dispatch(
          setError(
            notFoundTasks.length === 1
              ? `Задача <b>${notFoundTasks[0]}</b> не найдена`
              : `Задачи <b>${notFoundTasks.join(', ')}</b> не найдены`,
          ),
        );
      }
    } else {
      dispatch(setLoading(false));
      dispatch(setError(`Ошибка поиска задачи - ${error}`));
    }
  };
};
