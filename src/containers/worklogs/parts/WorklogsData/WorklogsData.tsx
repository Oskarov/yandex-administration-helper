type TProps = {
  data: Record<string, any>;
};

const WorklogsData: React.FC<TProps> = ({ data }) => {
  if (data && !!Object.keys(data).length) {
    return (
      <>
        {Object.keys(data).map((performer, index) => {
          return (
            <section key={index}>
              <h2>{performer}</h2>
            </section>
          );
        })}
      </>
    );
  }

  return <></>;
};

export default WorklogsData;
