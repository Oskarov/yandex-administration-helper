import { useSelector } from 'react-redux';
import { TStore } from 'store/store';
import PerformerCalendar from '../PerformerCalendar/PerformerCalendar';
import styles from './WorklogsData.module.scss';

const WorklogsData = () => {
  // selectors
  const { worklogs } = useSelector((store: TStore) => ({
    worklogs: store.worklogs.worklogs,
  }));

  const performersList = worklogs && Object.keys(worklogs);

  if (worklogs && !!performersList?.length) {
    return (
      <>
        {Object.keys(worklogs).map((performer, index) => (
          <section key={index} className={styles.WorklogsData}>
            <PerformerCalendar
              performer={performer}
              performerData={worklogs[performer]}
            />
          </section>
        ))}
      </>
    );
  }

  return <></>;
};

export default WorklogsData;
