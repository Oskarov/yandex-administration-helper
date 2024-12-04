import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ITasksTrackerState } from '../interfaces/ITasksTracker';
import { TShortTask } from 'interfaces/ITask';

const initialState: ITasksTrackerState = {
  loading: false,
  error: '',
  query: '',
  tasks: [],
  sortField: 'key',
  sortDirecion: 'ASC', // 'ASC' | 'DESC'
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
    addTask(state, { payload }: PayloadAction<TShortTask[]>) {
      // updated tasks from payload
      const newTasksKeys = payload.map(task => task.key);

      state.tasks = !!state.tasks.length
        ? [
            // old tasks without updated
            ...state.tasks.filter(task => !newTasksKeys.includes(task.key)),

            // updated tasks
            ...payload,
          ]
        : payload;
    },

    // removeTask
    removeTask(state, { payload }: PayloadAction<string>) {
      state.tasks = state.tasks.filter(task => task.key !== payload);
    },

    // setSortDirection
    setSortDirection(state) {
      state.sortDirecion = state.sortDirecion === 'ASC' ? 'DESC' : 'ASC';
    },
  },
});

export const tasksTrackerReducer = tasksTrackerSlice.reducer;

export const {
  setLoading,
  setError,
  setQuery,
  addTask,
  removeTask,
  setSortDirection,
} = tasksTrackerSlice.actions;
