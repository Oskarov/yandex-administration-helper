import QueueService from 'api/queue-service';
import SearchService from 'api/search-service';
import dayjs, { Dayjs } from 'dayjs';
import { Dispatch } from 'react';
import {
  resetData,
  setErrors,
  setLoading,
  setSingleTaskCode,
  setTasksCodes,
  setTasksData,
  setWorklogs,
  TPerformetOption,
} from 'slices/worklogs';
import { store } from 'store/store';
import CalculateHoursFromTrackerTask from 'utils/calculateHoursFromTrackerTack';

// 2024-10-20T16:07:17+03:00 - full valid date
export const FORMAT_TYPE = 'YYYY-MM-DD';
export const REQUEST_INTERVAL = 330;

export type TTaskData = {
  id: string;
  name: string;
  key: string;
  status: string;
  originalEstimation: string;
  totalDuration: number;
  type: string;
  priority: string;
  assignee: string;
  createdAt: string;
  createdBy: string;
  sprint: string;
};

// 4-old - точечный экшен для получения типа задачи
export const getTasksTypesSingle = (taskCode: string) => {
  return async function (dispatch: Dispatch<any>) {
    const { data, success, error } = await QueueService.getTaskByKey(taskCode);

    if (success && data) {
      dispatch(
        setSingleTaskCode({
          code: taskCode,
          type: data.type.key,
        }),
      );
    } else {
      const errorMessage =
        error?.message || `${taskCode} - Ошибка загрузки типа задачи`;
      alert(errorMessage);
      dispatch(setLoading(false));
      dispatch(setErrors(errorMessage));
    }
  };
};

// 3-old - генерирует интервальные экшены для типов задач
export const getTasksTypesMulti = () => {
  return async function (dispatch: Dispatch<any>) {
    // find current perfomer data
    const selectedTasks = Object.keys(
      store.getState().worklogs.selectedTasks || [],
    );

    if (!selectedTasks.length) {
      dispatch(setLoading(false));
      dispatch(setErrors('Задач не найдено'));
      return;
    }

    // если задача одна
    if (selectedTasks.length === 1) {
      // делаем запрос на первую выделенную задачу
      dispatch(getTasksTypesSingle(selectedTasks[0]));

      // а затем через таймаут останавливаем загрузку
      setTimeout(() => {
        dispatch(setLoading(false));
      }, REQUEST_INTERVAL);
    } else {
      dispatch(getTasksTypesSingle(selectedTasks[0]));
      let counter = 1;

      const intervalId = setInterval(() => {
        dispatch(getTasksTypesSingle(selectedTasks[counter]));

        // counter - увеличваем счетчик на 1
        counter++;

        if (counter === selectedTasks.length) {
          clearInterval(intervalId);
          dispatch(setLoading(false));
        }
      }, REQUEST_INTERVAL);
    }
  };
};

// 3-new - получение типов задача
export const searchTasksTypes = () => {
  return async function (dispatch: Dispatch<any>) {
    // find current perfomer data
    const selectedTasks = Object.keys(
      store.getState().worklogs.selectedTasks || [],
    );

    if (!selectedTasks.length) {
      dispatch(setLoading(false));
      dispatch(setErrors('Выбранные задачи отсутствуют'));
      return;
    }

    const { data, success, error } =
      await SearchService.searchTasks(selectedTasks);

    // success
    if (success && data) {
      // no data
      if (!data.length) {
        dispatch(setLoading(false));
        dispatch(setErrors('Отсутсвуют данные по выбранным задачам'));
        return;
      }

      // data
      const _data = data.reduce<Record<string, TTaskData>>((total, item) => {
        const _item: TTaskData = {
          id: item.id,
          name: item.summary,
          key: item.key,
          status: item.status.display,
          originalEstimation: item.originalEstimation,
          totalDuration: CalculateHoursFromTrackerTask(item.spent),
          type: item.type.key,
          priority: item.priority.key,
          assignee: item.assignee.display,
          createdAt: item.createdAt,
          createdBy: item.createdBy.display,
          sprint: item.sprint[0].display,
        };

        total[item.key] = _item;

        return total;
      }, {});

      dispatch(setTasksData(_data));
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
          performer: selectedPerformer?.trackerDisplay || id,
          data: newData,
        }),
      );

      // сохраняем коды полученных задач
      dispatch(setTasksCodes(tasksCodes));

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
        // dispatch(getTasksTypesMulti()); // так было раньше --> отдельные запросы по каждой задаче
        dispatch(searchTasksTypes()); // так сейчас --> получение типов задач одним запросом
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
            // dispatch(getTasksTypesMulti()); // так было раньше --> отдельные запросы по каждой задаче
            dispatch(searchTasksTypes()); // так сейчас --> получение типов задач одним запросом
          }, REQUEST_INTERVAL);
        }
      }, REQUEST_INTERVAL);
    }
  };
};
