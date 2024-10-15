import {createSlice, PayloadAction}                              from '@reduxjs/toolkit';
import {IPerformerItem, IPerformersState, IPerformerTaskPayload} from "../interfaces/IPerformers";
import {ITask, ITasksState}                                      from "../interfaces/ITask";
import {IAppState, IConfirmation, IInformation}                  from "../interfaces/IApp";
import {ITrackerQueueImport}                                     from "../interfaces/ITracker";

const initialState: IAppState = {
    rowSize: 60,
    sprintSize: 60,
    valueOfDivision: 20,
    lastQueue: null,
    loadingText: '',
    taskLighting: true,
    sprintLighting: true
}


const appSlice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setRowSize: (state, {payload}: PayloadAction<number>) => {
            return {
                ...state,
                rowSize: payload
            };
        },
        setSprintSize: (state, {payload}: PayloadAction<number>) => {
            return {
                ...state,
                sprintSize: payload
            };
        },
        setValueOfDivision: (state, {payload}: PayloadAction<number>) => {
            return {
                ...state,
                valueOfDivision: payload
            };
        },
        setAppFromJson: (state, {payload}: PayloadAction<IAppState>) => {
            return {
                ...payload
            }
        },
        setLastQueue: (state, {payload}: PayloadAction<ITrackerQueueImport>) => {
            return {
                ...state,
                lastQueue: payload
            }
        },
        setLoading: (state, {payload}: PayloadAction<string>) => {
            return {
                ...state,
                loadingText: payload
            }
        },
        setTaskLighting: (state, {payload}: PayloadAction<boolean>) => {
            return {
                ...state,
                taskLighting: payload
            }
        },
        setSprintLighting: (state, {payload}: PayloadAction<boolean>) => {
            return {
                ...state,
                sprintLighting: payload
            }
        },
    }
})

export const appReducer = appSlice.reducer;
export const {
    setValueOfDivision,
    setSprintSize,
    setRowSize,
    setAppFromJson,
    setLastQueue,
    setLoading,
    setTaskLighting,
    setSprintLighting
} = appSlice.actions;
