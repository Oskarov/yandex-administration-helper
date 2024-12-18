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
  sortedTasks: [],

  // filter
  filterStatus: TaskStatuses.ALL,
  showOnlyUpdatedTasks: false,

  // selected tasks
  selectedTasks: [],
  selectAllTasks: false,
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
      // удаляем задачу из списка задач
      state.tasks = state.tasks.filter(task => task.key !== payload);

      // если задача выла выделена чекбоксом
      const isSelected = state.selectedTasks.includes(payload);

      // удаляем из выделенных
      if (isSelected) {
        state.selectedTasks = state.selectedTasks.filter(
          task => task !== payload,
        );
      }
    },

    // setSortField
    setSortField(state, { payload }: PayloadAction<TSortedTaskFields>): void {
      state.sortField = payload;
    },

    // setSortDirection
    setSortDirection(state) {
      state.sortDirecion = state.sortDirecion === 'ASC' ? 'DESC' : 'ASC';
    },

    // setCheckTask
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

    // setUpdatedTasks
    setUpdatedTasks(state): void {
      state.showOnlyUpdatedTasks = !state.showOnlyUpdatedTasks;
    },

    // resetFilters
    resetFilters(state): void {
      state.filterStatus = initialState.filterStatus;
      state.showOnlyUpdatedTasks = initialState.showOnlyUpdatedTasks;
    },

    // setSelectTask
    setSelectTask(state, { payload }: PayloadAction<string>): void {
      state.selectAllTasks = false;

      const isTaskInclude = state.selectedTasks.includes(payload);

      state.selectedTasks = isTaskInclude
        ? state.selectedTasks.filter(task => task !== payload)
        : [...state.selectedTasks, payload];
    },

    // setSelectAllTasks
    setSelectAllTasks(state): void {
      state.selectAllTasks = !state.selectAllTasks;

      if (state.selectAllTasks) {
        state.selectedTasks = state.sortedTasks;
      } else {
        state.selectedTasks = [];
      }
    },

    // resetSelectedTasks
    resetSelectedTasks(state): void {
      state.selectAllTasks = initialState.selectAllTasks;
      state.selectedTasks = initialState.selectedTasks;
    },

    // setSortedTasks
    setSortedTasks(state, { payload }: PayloadAction<string[]>): void {
      state.sortedTasks = payload;
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
  resetFilters,
  setSelectTask,
  setSelectAllTasks,
  resetSelectedTasks,
  setSortedTasks,
} = tasksTrackerSlice.actions;
