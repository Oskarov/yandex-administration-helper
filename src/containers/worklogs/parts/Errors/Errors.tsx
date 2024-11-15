import { ReactElement } from 'react';

type TProps = {
  errors: string[];
};

const Errors: React.FC<TProps> = ({ errors }): any => {
  if (errors.length) {
    return errors.map(error => (
      <section>
        <div>
          <div style={{ color: 'red' }}>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        </div>
      </section>
    ));
  }

  return null;
};

export default Errors;
