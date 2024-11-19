import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ITasksTrackerState } from '../interfaces/ITasksTracker';

const initialState: ITasksTrackerState = {
  loading: false,
  error: '',
  query: '',
  tasks: [],
};

const tasksTrackerSlice = createSlice({
  name: 'tasksTracker',
  initialState,
  reducers: {
    // setLoading
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    },

    // setError
    setError(state, { payload }: PayloadAction<string>) {
      state.error = payload;
    },

    // setQuery
    setQuery(state, { payload }: PayloadAction<string>) {
      state.query = payload;
    },

    // addTask
    addTask(state, { payload }: PayloadAction<any>) {},

    // removeTask
    removeTask(state, { payload }: PayloadAction<any>) {},

    // updateTaskData
    updateTaskData(state, { payload }: PayloadAction<any>) {},

    // updateAllTaskData
    updateAllTaskData(state, { payload }: PayloadAction<any>) {},
  },
});

export const tasksTrackerReducer = tasksTrackerSlice.reducer;

export const {
  setLoading,
  setError,
  setQuery,
  addTask,
  removeTask,
  updateTaskData,
  updateAllTaskData,
} = tasksTrackerSlice.actions;
