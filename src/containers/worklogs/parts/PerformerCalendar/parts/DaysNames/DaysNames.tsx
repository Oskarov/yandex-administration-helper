import { ruNamesOfDays } from 'utils/date';
import cn from 'classnames';
import styles from './DaysNames.module.scss';

const DaysNames = (): any => {
  return ruNamesOfDays.map((day, index) => (
    <div
      key={index}
      className={cn(styles.DaysNames, {
        [styles.weekend]: day === 'Сб' || day === 'Вс',
      })}
    >
      {day}
    </div>
  ));
};

export default DaysNames;
