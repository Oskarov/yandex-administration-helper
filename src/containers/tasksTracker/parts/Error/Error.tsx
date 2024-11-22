import styles from './Error.module.scss';

type TProps = {
  error: string;
};

const Error: React.FC<TProps> = ({ error }: TProps) => (
  <div className={styles.Error} dangerouslySetInnerHTML={{ __html: error }} />
);

export default Error;
