import { CircularProgress } from '@mui/material'
import styles               from './loader.module.scss'

const Loader = ({ loading, content }: { loading: boolean, content?: string }) => {
    if (!loading) return null;

    return (
        <div className={styles.wrapper}>
            <CircularProgress/>
            {content && <p>{content}</p>}
        </div>
    );
}

export default Loader;