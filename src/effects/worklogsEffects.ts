import SearchService from 'api/search-service';
import dayjs, { Dayjs } from 'dayjs';
import { Dispatch } from 'react';
import {
  resetData,
  setErrors,
  setFillTaskData,
  setLoading,
  setPrepareTasksData,
  setWorklogs,
  TPerformetOption,
} from 'slices/worklogs';
import { store } from 'store/store';
import CalculateHoursFromTrackerTask from 'utils/calculateHoursFromTrackerTack';

// 2024-10-20T16:07:17+03:00 - full valid date
export const FORMAT_TYPE = 'YYYY-MM-DD';
export const REQUEST_INTERVAL = 330;

export type TTaskData = {
  key: string;
  type: string;
  name: string;
  assignee: string;
  status: string;
  totalDuration: number;
  createdAt: string;
  createdBy: string;
  originalEstimation: string;
  priority: string;
};

// 3 - получение типов задач
export const searchTasksTypes = () => {
  return async function (dispatch: Dispatch<any>) {
    // find current perfomer data
    const preparedTasks = Object.keys(
      store.getState().worklogs.tasksData || [],
    );

    if (!preparedTasks.length) {
      dispatch(setLoading(false));
      dispatch(setErrors('Выбранные задачи отсутствуют'));
      return;
    }

    const { data, success, error } =
      await SearchService.searchTasks(preparedTasks);

    // success
    if (success && data) {
      // no data
      if (!data.length) {
        dispatch(setLoading(false));
        dispatch(setErrors('Отсутсвуют данные по выбранным задачам'));
        return;
      }

      // fill data to store
      data.forEach(task =>
        // custom fields
        dispatch(
          setFillTaskData({
            key: task.key,
            type: task.type.display,
            name: task.summary,
            assignee: task.assignee.display,
            status: task.status.display,
            totalDuration: +CalculateHoursFromTrackerTask(task.spent).toFixed(
              2,
            ),
            createdAt: task.createdAt,
            createdBy: task.createdBy.display,
            originalEstimation: task.originalEstimation,
            priority: task.priority.display,
          }),
        ),
      );

      dispatch(setLoading(false));
      // error
    } else {
      dispatch(setLoading(false));
      dispatch(setErrors(`${error} - Ошибка загрузки данных типов задач`));
    }
  };
};

// 2 - точеный экшен для получения ворклога одного исполнителя
export const getWorklogSingle = (
  id: string,
  dateFrom: Dayjs | null,
  dateTo: Dayjs | null,
) => {
  return async function (dispatch: Dispatch<any>) {
    let tasksCodes: string[] = [];

    // fix date format to API request
    const _dateFrom = `${dayjs(dateFrom).format(FORMAT_TYPE)}T00:00:00`;
    const _dateTo = `${dayjs(dateTo).format(FORMAT_TYPE)}T23:59:59`;

    // find current perfomer data
    const selectedPerformer = store
      .getState()
      .performers.items.find(item => Number(item.trackerId) === Number(id));

    const { data, success, error } = await SearchService.searchWorklogs(
      id, // id исполнителя
      _dateFrom,
      _dateTo,
    );

    // success
    if (success && data) {
      // если данные пустые, то отменяем последующие действия
      if (!data.length) {
        dispatch(setLoading(false));
        dispatch(
          setErrors(
            `${selectedPerformer?.lastName} ${selectedPerformer?.firstName} - данных в указанный период не найдено`,
          ),
        );
        return;
      }

      const newData = data.reduce((total: any, item: any) => {
        // обрезаем строку даты до формата YYYY-MM-DD
        const logDay = item.createdAt.slice(0, 10);

        // создаем объект задач с нужными нам полями
        const logTask = {
          code: item.issue.key,
          name: item.issue.display,
          link: item.issue.self,
          comment: item.comment || null,
          createdAt: item.createdAt,
          duration: CalculateHoursFromTrackerTask(item.duration),
        };

        if (!tasksCodes.includes(logTask.code)) {
          tasksCodes.push(logTask.code);
        }

        // добавляем день как поле объекта со значениям массива залогированных задач
        total[logDay] = [...(total[logDay] || []), logTask];

        return total;
      }, {});

      // сохраняем видоизмененные данные ворклога
      dispatch(
        setWorklogs({
          performer:
            `${selectedPerformer?.lastName} ${selectedPerformer?.firstName}` ||
            id,
          data: newData,
        }),
      );

      // сохраняем коды полученных задач как ключи объекта с пустыми данными
      dispatch(setPrepareTasksData(tasksCodes));

      // error
    } else {
      const errorMessage = error?.message || 'Ошибка загрузки ворклогов';
      dispatch(setLoading(false));
      dispatch(setErrors(errorMessage));
    }
  };
};

// 1 - генерирует интервальные экшены для получения ворклога
export const getWorklogsMultiply = (
  selectedPerformers: TPerformetOption[],
  dateFrom: Dayjs | null,
  dateTo: Dayjs | null,
) => {
  return async function (dispatch: Dispatch<any>) {
    // pre-request reset state
    dispatch(resetData());
    dispatch(setLoading(true));

    if (!selectedPerformers.length) {
      dispatch(setLoading(false));
      dispatch(setErrors('Отсутсвуют выбранные исполнители'));
      return;
    }

    const firstPerformerId = `${selectedPerformers[0].key}`;

    // если выбран только один исполнитель - делаем только один запрос
    if (selectedPerformers.length === 1) {
      dispatch(getWorklogSingle(firstPerformerId, dateFrom, dateTo));

      // и спустя таймаут делаем запросы по типам задач
      setTimeout(() => {
        dispatch(searchTasksTypes()); // получение типов задач одним запросом
      }, REQUEST_INTERVAL);

      // если выбрано несколько исполнителей
    } else {
      // то сразу делаем запрос для первого
      dispatch(getWorklogSingle(firstPerformerId, dateFrom, dateTo));

      // а для остальных запросов делаем через интервалы REQUEST_INTERVAL
      let counter = 1;
      const intervalId = setInterval(() => {
        dispatch(
          getWorklogSingle(
            `${selectedPerformers[counter].key}`, // counter - хранит индекс исполнителя
            dateFrom,
            dateTo,
          ),
        );

        // counter - увеличваем счетчик на 1
        counter++;

        if (counter === selectedPerformers.length) {
          // очищаем интервал
          clearInterval(intervalId);

          // и спустя таймаут делаем запросы по типам задач
          setTimeout(() => {
            dispatch(searchTasksTypes()); // получение типов задач одним запросом
          }, REQUEST_INTERVAL);
        }
      }, REQUEST_INTERVAL);
    }
  };
};
