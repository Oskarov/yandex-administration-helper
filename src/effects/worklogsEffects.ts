import QueueService from 'api/queue-service';
import WorklogService from 'api/worklog-service';
import dayjs, { Dayjs } from 'dayjs';
import { Dispatch } from 'react';
import {
  resetState,
  setErrors,
  setLoading,
  setSingleTaskCode,
  setTasksCodes,
  setWorklogs,
  TPerformetOption,
} from 'slices/worklogs';
import { store } from 'store/store';
import CalculateHoursFromTrackerTask from 'utils/calculateHoursFromTrackerTack';

// 2024-10-20T16:07:17+03:00 - full valid date
export const FORMAT_TYPE = 'YYYY-MM-DD';
export const REQUEST_INTERVAL = 330;

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

// интервальные экшены для получения ворклогов всех переданных пользователей
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

    // если задача одни
    if (selectedTasks.length === 1) {
      dispatch(getTasksTypesSingle(selectedTasks[0]));
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

// точеные экшены для получения ворклога одного исполнителя
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

    const { data, success, error } = await WorklogService.searchWorklogs(
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

      dispatch(
        setWorklogs({
          performer: selectedPerformer?.trackerDisplay || id,
          data: newData,
        }),
      );

      dispatch(setTasksCodes(tasksCodes));

      // error
    } else {
      const errorMessage = error?.message || 'Ошибка загрузки ворклогов';
      dispatch(setLoading(false));
      dispatch(setErrors(errorMessage));
    }
  };
};

// интервальные экшены для получения ворклогов всех переданных пользователей
export const getWorklogsMultiply = (
  selectedPerformers: TPerformetOption[],
  dateFrom: Dayjs | null,
  dateTo: Dayjs | null,
) => {
  return async function (dispatch: Dispatch<any>) {
    // pre-request reset state
    dispatch(resetState());
    dispatch(setLoading(true));

    const firstPerformerId = `${selectedPerformers[0].key}`;

    // если выбран только один исполнитель - делаем только один запрос
    if (selectedPerformers.length === 1) {
      dispatch(getWorklogSingle(firstPerformerId, dateFrom, dateTo));

      // и спустя таймаут делаем запросы по типам задач
      setTimeout(() => {
        dispatch(getTasksTypesMulti());
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
            dispatch(getTasksTypesMulti());
          }, REQUEST_INTERVAL);
        }
      }, REQUEST_INTERVAL);
    }
  };
};
