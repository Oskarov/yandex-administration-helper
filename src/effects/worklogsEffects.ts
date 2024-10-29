import WorklogService from 'api/worklog-service';
import dayjs, { Dayjs } from 'dayjs';
import { Dispatch } from 'react';
import {
  resetTasksCodes,
  resetWorklogs,
  setError,
  setLoading,
  setTasksCodes,
  setWorklogs,
  TPerformetOption,
} from 'slices/worklogs';
import { store } from 'store/store';
import CalculateHoursFromTrackerTask from 'utils/calculateHoursFromTrackerTack';

// 2024-10-20T16:07:17+03:00 - full valid date
export const FORMAT_TYPE = 'YYYY-MM-DD';
export const REQUEST_INTERVAL = 300;

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
      // чтобы загрузка не оставливалась при промежуточных запросах
      dispatch(setLoading(false));

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
      alert(errorMessage);
      dispatch(setLoading(false));
      dispatch(setError(errorMessage));
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
    // сбрасываем сохраненные ворклоги
    dispatch(resetWorklogs());

    // сбрасываем сохранные выделенные задачи
    dispatch(resetTasksCodes());
    dispatch(setError(''));
    dispatch(setLoading(true));

    const firstPerformerId = `${selectedPerformers[0].key}`;

    // через таймаут делаем запросы, чтобы поле ворклогов успело очиститься
    setTimeout(() => {
      // если выбран только один исполнитель - делаем только один запрос
      if (selectedPerformers.length === 1) {
        return dispatch(getWorklogSingle(firstPerformerId, dateFrom, dateTo));

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
            clearInterval(intervalId);

            // запросы на получение типов задач
            // TODO
          }
        }, REQUEST_INTERVAL);
      }
    }, 50);
  };
};
