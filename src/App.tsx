import React, {useEffect}         from 'react';
import styles                     from './app.module.scss';
import {useDispatch, useSelector} from "react-redux";
import Main                       from "./containers/main/main";
import ReduxConfirmationDialog    from "./components/reduxConfirmationDialog";
import ReduxInformationDialog     from "./components/reduxInformationDialog";
import {TStore}                   from "./store/store";
import Loader                     from "./components/loader";
import {setLoading}               from "./slices/app";

export const hourDefinition = 20;
export const maxSprintHours = 60;


function App() {
    const {loadingText} = useSelector((state: TStore) => ({
        loadingText: state.app.loadingText
    }));
    const dispatch = useDispatch();
    useEffect(()=>{
        setTimeout(()=>{
            dispatch(setLoading(''))
        },1000)
    },[])

    return (
        <div className={styles.app}>
            <Loader loading={!!loadingText} content={loadingText}/>
            <Main/>
            <ReduxConfirmationDialog/>
            <ReduxInformationDialog/>
        </div>
    );
}

export default App;
