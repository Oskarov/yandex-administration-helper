import WorklogService from 'api/worklog-service';
import dayjs, { Dayjs } from 'dayjs';
import { Dispatch } from 'react';
import {
  setError,
  setLoading,
  setWorklogs,
  TPerformetOption,
} from 'slices/worklogs';

// 2024-10-20T16:07:17+03:00 - full valid date
export const FORMAT_TYPE = 'YYYY-MM-DD';

export const getWorklogs = (
  selectedPerformers: TPerformetOption[],
  dateFrom: Dayjs | null,
  dateTo: Dayjs | null,
) => {
  return async function (dispatch: Dispatch<any>) {
    // reset state before fetching new data
    dispatch(setLoading(true));
    dispatch(setError(''));
    dispatch(setWorklogs(null));

    // fix date format to API request
    const _dateFrom = `${dayjs(dateFrom).format(FORMAT_TYPE)}T00:00:00`;
    const _dateTo = `${dayjs(dateTo).format(FORMAT_TYPE)}T23:59:59`;

    const { data, success, error } = await WorklogService.searchWorklogs(
      `${selectedPerformers[0].key}`,
      _dateFrom,
      _dateTo,
    );

    // success
    if (success && data) {
      dispatch(setLoading(false));
      dispatch(setWorklogs(data));

      // error
    } else {
      dispatch(setLoading(false));
      dispatch(setError(error));
    }
  };
};

// getWorkLog
// const getWorkLog = async () => {
//   dispatch(setLoading(true));
//   dispatch(setWorklogs(null));

//   try {
//     const { data } = await httpClient.post('/worklog/_search', {
//       createdBy: selectedPerformerIds[0],
//       createdAt: {
//         from: `${dayjs(dateFrom).format(FORMAT_TYPE)}T00:00:00`,
//         to: `${dayjs(dateTo).format(FORMAT_TYPE)}T23:59:59`,
//       },
//     });

//     if (data) {
//       dispatch(setLoading(false));
//       console.log('data', data);

//       const newData = data.reduce((total: any, item: any) => {
//         // обрезаем строку даты до формата YYYY-MM-DD
//         const logDay = item.createdAt.slice(0, 10);

//         // создаем объект задач с нужными нам полями
//         const logTask = {
//           code: item.issue.key,
//           name: item.issue.display,
//           link: item.issue.self,
//           comment: item.comment || null,
//           createdAt: item.createdAt,
//           duration: CalculateHoursFromTrackerTask(item.duration),
//         };

//         // добавляем день как поле объекта со значениям массива залогированных задач
//         total[logDay] = [...(total[logDay] || []), logTask];

//         return total;
//       }, {});

//       dispatch(setWorklogs(newData));
//     }
//   } catch (e) {
//     dispatch(setLoading(false));
//     dispatch(setWorklogs(e));
//   }
// };
