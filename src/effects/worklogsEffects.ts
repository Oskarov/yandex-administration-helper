import dayjs, { Dayjs } from 'dayjs';
import { Dispatch } from 'react';
import { setLoading, setWorklogs } from 'slices/worklogs';

// 2024-10-20T16:07:17+03:00 - full valid date
export const FORMAT_TYPE = 'YYYY-MM-DD';

export const getWorklogs = (
  performersIds: string[],
  dateFrom: Dayjs | null,
  dateTo: Dayjs | null,
) => {
  return async function (dispatch: Dispatch<any>) {
    // reset state before fetching new data
    dispatch(setLoading(true));
    dispatch(setWorklogs(null));

    // fix date format to API request
    const _dateFrom = `${dayjs(dateFrom).format(FORMAT_TYPE)}T00:00:00`;
    const _dateTo = `${dayjs(dateTo).format(FORMAT_TYPE)}T23:59:59`;

    // fetch data
    console.log('performersIds', performersIds);
    console.log('_dateFrom', _dateFrom);
    console.log('_dateTo', _dateTo);
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
