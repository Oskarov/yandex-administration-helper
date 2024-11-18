import dayjs from 'dayjs';
import { FORMAT_TYPE } from 'effects/worklogsEffects';

export const ruNamesOfDays: string[] = [
  'Пн',
  'Вт',
  'Ср',
  'Чт',
  'Пт',
  'Сб',
  'Вс',
];

const ruNamesOfMounts: string[] = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export type TCellType = 'from' | 'to' | 'space' | 'empty';

export type TDate = {
  date: number | string;
  dayOrder: number;
  nameOfDay: string;

  // month
  month: number | string; // from 0
  nameOfMonth: string;
  daysInMonth: number;

  // year
  year: number;

  // value
  value: string;

  cellType?: TCellType; // 'from' or 'to'

  unix: number;
};

export const returnDate = (day: dayjs.Dayjs | null): TDate | null => {
  if (!day) return null;

  const _dayOrder = day?.day() === 0 ? 6 : day?.day() - 1;

  return {
    // day
    date: day?.date() < 10 ? `0${day?.date()}` : day?.date(),
    dayOrder: _dayOrder,

    // Исправляет Воскресенье на 6-ой индекс
    nameOfDay: ruNamesOfDays[_dayOrder],

    // month
    month: day?.month() < 9 ? `0${day?.month() + 1}` : day?.month() + 1,
    nameOfMonth: ruNamesOfMounts[day?.month()],
    daysInMonth: day?.daysInMonth(),

    // year
    year: day?.year(),

    // value
    value: day?.format(FORMAT_TYPE),

    // direction,

    unix: day?.unix(),
  };
};

export function returnCalendarInterval(
  dayFrom: dayjs.Dayjs,
  dayTo: dayjs.Dayjs,
): TDate[] {
  let currentDayUnix = dayFrom.unix();
  let result = [];
  let addDays = 0;

  // добавление промежуточных дней
  while (currentDayUnix <= dayTo.unix()) {
    result.push({
      ...returnDate(dayFrom.add(addDays, 'day')),

      // direction
      cellType:
        currentDayUnix === dayFrom.unix()
          ? 'from'
          : currentDayUnix >= dayTo.unix()
            ? 'to'
            : 'space',
    });
    currentDayUnix += 86400; // add one day
    addDays++;
  }

  // номера дней dayFrom и dateTo
  const firstIntervalDay = result[0]?.dayOrder;
  const lastIntervalDay = result[result.length - 1]?.dayOrder;

  // вставка пустых дат в начало, если dayFrom не Понедельник
  if (firstIntervalDay !== ruNamesOfDays.indexOf('Пн')) {
    let startDiff = Number(firstIntervalDay) - 1;
    let dayIterator = 1;

    while (startDiff >= 0) {
      // добавление пустых дней в начало до Понедельника вклюяительно
      result.unshift({
        ...returnDate(dayFrom.add(-dayIterator, 'day')),
        cellType: 'empty',
      });
      startDiff--;
      dayIterator++;
    }
  }

  // вставка пустых дат в конец, если dayTo не Воскресенье
  if (lastIntervalDay !== ruNamesOfDays.indexOf('Вс')) {
    let endDiff = 6 - Number(lastIntervalDay);
    let dayIterator = 1;

    while (endDiff) {
      // добавление пустых дней в конец до Воскресенья вклюяительно
      result.push({
        ...returnDate(dayTo.add(dayIterator, 'day')),
        cellType: 'empty',
      });
      endDiff--;
      dayIterator++;
    }
  }

  return result as TDate[];
}

// 86400 - unix one day
