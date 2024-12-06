import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  ITasksTrackerState,
  TaskStatuses,
  TSortedTaskFields,
} from '../interfaces/ITasksTracker';
import { TShortTask } from 'interfaces/ITask';

const initialState: ITasksTrackerState = {
  loading: false,
  error: '',
  query: '',
  tasks: [],

  // sort
  sortField: 'key',
  sortDirecion: 'ASC', // 'ASC' | 'DESC'

  // filter
  filterStatus: TaskStatuses.ALL,
  showOnlyUpdatedTasks: false,
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

    setSortField(state, { payload }: PayloadAction<TSortedTaskFields>): void {
      state.sortField = payload;
    },

    // setSortDirection
    setSortDirection(state) {
      state.sortDirecion = state.sortDirecion === 'ASC' ? 'DESC' : 'ASC';
    },

    // setSortDirection
    setCheckTask(state, { payload }: PayloadAction<string>) {
      state.tasks = state.tasks.map(task => {
        if (task.key === payload) {
          return { ...task, newStatusChecked: true };
        }

        return task;
      });
    },

    // setFilterStatus
    setFilterStatus(state, { payload }: PayloadAction<TaskStatuses>): void {
      state.filterStatus = payload;
    },

    // setFilterStatus
    setUpdatedTasks(state): void {
      state.showOnlyUpdatedTasks = !state.showOnlyUpdatedTasks;
    },

    // setResetFilters
    setResetFilters(state): void {
      state.filterStatus = TaskStatuses.ALL;
      state.showOnlyUpdatedTasks = false;
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
  setSortField,
  setSortDirection,
  setCheckTask,
  setFilterStatus,
  setUpdatedTasks,
  setResetFilters,
} = tasksTrackerSlice.actions;
