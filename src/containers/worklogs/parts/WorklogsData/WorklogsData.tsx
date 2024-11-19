import { useSelector } from 'react-redux';
import { TStore } from 'store/store';
import { PerformerCalendar } from '..';
import styles from './WorklogsData.module.scss';

const WorklogsData = () => {
  // selectors
  const worklogs = useSelector((store: TStore) => store.worklogs.worklogs);
  const performerList = worklogs && Object.keys(worklogs);

  // чтобы отображать данные только тогда, когда данные (worklogs и performerList) уже загрузились
  if (worklogs && !!performerList?.length) {
    return (
      <>
        {Object.keys(worklogs).map(performerName => (
          <section key={performerName} className={styles.WorklogsData}>
            <PerformerCalendar performerName={performerName} />
          </section>
        ))}
      </>
    );
  }

  return <></>;
};

export default WorklogsData;
