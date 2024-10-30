import { useSelector } from 'react-redux';
import { TStore } from 'store/store';

const Debug = () => {
  // selectors
  const { worklogs, selectedTasks } = useSelector((store: TStore) => {
    return {
      worklogs: store.worklogs.worklogs,
      selectedTasks: store.worklogs.selectedTasks,
    };
  });

  return (
    <>
      {selectedTasks && (
        <section>
          <h2>Список задач из ворклогов</h2>

          <div>
            <div>
              <pre>{JSON.stringify(selectedTasks, null, 2)}</pre>
            </div>
          </div>
        </section>
      )}

      {worklogs && (
        <section>
          <h2>Ворклоги</h2>

          <div>
            <div>
              <pre>{JSON.stringify(worklogs, null, 2)}</pre>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Debug;
