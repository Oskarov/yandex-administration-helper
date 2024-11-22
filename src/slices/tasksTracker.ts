import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ITasksTrackerState } from '../interfaces/ITasksTracker';
import { TFullTask } from 'interfaces/ITask';

const initialState: ITasksTrackerState = {
  loading: false,
  error: '',
  query: '',
  tasks: {},
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
    addTask(state, { payload }: PayloadAction<TFullTask[]>) {
      payload.forEach(task => {
        state.tasks[task.key] = task;
      });
    },

    // removeTask
    removeTask(state, { payload }: PayloadAction<string>) {
      delete state.tasks[payload];
    },
  },
});

export const tasksTrackerReducer = tasksTrackerSlice.reducer;

export const { setLoading, setError, setQuery, addTask, removeTask } =
  tasksTrackerSlice.actions;
