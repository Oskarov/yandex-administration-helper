import {createSlice, PayloadAction}                              from '@reduxjs/toolkit';
import {IPerformerItem, IPerformersState, IPerformerTaskPayload} from "../interfaces/IPerformers";
import {ITask}                                                   from "../interfaces/ITask";
import {
    IProjects,
    ITrackerBoard,
    ITrackerNoMemoState,
    ITrackerQueueImport, ITrackerQueueTask, ITrackerSprint,
    ITrackerState, ITrackerUser
} from "../interfaces/ITracker";

const initialState: ITrackerNoMemoState = {
    boards: [],
    sprints: [],
    users: [],
    tasksForTime: []
}

const trackerNoMemoSlice = createSlice({
    name: 'trackerNoMemo',
    initialState: initialState,
    reducers: {
        changeBoards: (state, {payload}: PayloadAction<ITrackerBoard[]>) => {
            return {
                ...state,
                boards: payload
            };
        },
        changeSprints: (state, {payload}: PayloadAction<ITrackerSprint[]>) => {
            return {
                ...state,
                sprints: payload
            };
        },
        changeUsers: (state, {payload}: PayloadAction<ITrackerUser[]>) => {
            return {
                ...state,
                users: payload
            };
        },
        changeTasks: (state, {payload}: PayloadAction<ITrackerQueueTask[]>) => {
            return {
                ...state,
                tasksForTime: payload
            };
        },

    }
})

export const trackerNoMemoReducer = trackerNoMemoSlice.reducer;
export const {
    changeBoards,
    changeSprints,
    changeUsers,
    changeTasks
} = trackerNoMemoSlice.actions;
