import { TStore } from 'store/store';
import { useSelector } from 'react-redux';
import 'dayjs/locale/ru';
import Loader from 'components/loader';
import { Errors, Filters, WorklogsData } from './parts';
import styles from './worklogs.module.scss';

const Worklogs: React.FC = () => {
  const { loading, errors } = useSelector((store: TStore) => ({
    loading: store.worklogs.loading,
    errors: store.worklogs.errors,
  }));

  return (
    <div className={styles.Worklogs}>
      <Filters />

      <div className={styles.Worklogs__bottom}>
        <Loader loading={loading} />

        <main className={styles.Worklogs__content}>
          <Errors errors={errors} />

          <WorklogsData />

          {/* JSON debug output */}
          {/* <Debug /> */}
        </main>
      </div>
    </div>
  );
};

export default Worklogs;

// TODO:
// 1. Добавить типизацию +++
// 2. Проверить worklogsEffects.ts в плане тестирования запросов +++
// 3. Сделать динамически меняющийся homepage в package.json в зависимости от запущенного скрипта +++
// 4. Add calendar-grid +++
// 5. Разбить на под-компоненты файл PerformerCalendar.tsx ---
