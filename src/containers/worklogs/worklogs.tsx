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
