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

    // addTask(state, { payload }: PayloadAction<TShortTask[]>) {
    //   if (state.tasks.length > 0) {
    //     const newTasksKeys = payload.map(task => task.key);

    //     state.tasks = [
    //       // old tasks without updated
    //       ...state.tasks.filter(task => !newTasksKeys.includes(task.key)),

    //       // updated
    //       ...payload,
    //     ].sort((a, b) =>
    //       state.sortDirecion === 'ASC'
    //         ? a[state.sortField].localeCompare(b[state.sortField])
    //         : b[state.sortField].localeCompare(a[state.sortField]),
    //     );
    //   } else {
    //     state.tasks = payload.sort((a, b) =>
    //       state.sortDirecion === 'ASC'
    //         ? a[state.sortField].localeCompare(b[state.sortField])
    //         : b[state.sortField].localeCompare(a[state.sortField]),
    //     );
    //   }
    // },

    // addTask + sorting
    addTask: (state, { payload }: PayloadAction<TShortTask[]>) => {
      const isAsc = state.sortDirecion === 'ASC';
      const newTasksKeys = payload.map(task => task.key);

      if (state.tasks.length > 0) {
        return {
          ...state,
          tasks: [
            // old tasks without updated
            ...state.tasks.filter(task => !newTasksKeys.includes(task.key)),

            // updated
            ...payload,

            // sorting
          ].sort((a, b) =>
            isAsc
              ? a[state.sortField].localeCompare(b[state.sortField])
              : b[state.sortField].localeCompare(a[state.sortField]),
          ),
        };
      } else {
        return {
          ...state,
          tasks: payload.sort((a, b) =>
            isAsc
              ? a[state.sortField].localeCompare(b[state.sortField])
              : b[state.sortField].localeCompare(a[state.sortField]),
          ),
        };
      }
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
