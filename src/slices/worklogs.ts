import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';
import { TTaskData } from 'effects/worklogsEffects';

export type TPerformetOption = {
  label: string;
  key: number;
};

type TState = {
  loading: boolean;
  errors: string[];
  filters: {
    performers: TPerformetOption[];
    dateFrom: Dayjs | null;
    dateTo: Dayjs | null;
  };
  worklogs: any; // TODO: Define type for worklogs array
  tasksData: Record<string, TTaskData | null> | null;
};

const initialState: TState = {
  loading: false,
  errors: [],
  filters: {
    performers: [],
    dateFrom: dayjs(new Date()),
    dateTo: dayjs(new Date()),
  },
  worklogs: null,
  tasksData: null,
};

type TDate = {
  name: 'dateFrom' | 'dateTo';
  value: Dayjs | null;
};

const worklogsSlice = createSlice({
  name: 'worklogs',
  initialState,
  reducers: {
    // resetState
    resetData(state) {
      state.errors = [];
      state.worklogs = null;
      state.tasksData = null;
    },

    resetFilters(state) {
      state.filters = initialState.filters;
      state.worklogs = null;
      state.errors = [];
    },

    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    },

    // setError
    setErrors(state, { payload }: PayloadAction<string>) {
      state.errors = [...state.errors, payload];
    },

    // setPerformers
    setPerformers(state, { payload }: PayloadAction<TPerformetOption[]>) {
      state.filters.performers = payload;
    },

    // setDates
    setDates(state, { payload }: PayloadAction<TDate>) {
      state.filters[payload.name] = payload.value;
    },

    // setWorklogs
    setWorklogs(state, { payload }: PayloadAction<Record<string, any>>) {
      state.worklogs = {
        ...state.worklogs,
        [payload.performer]: payload.data,
      };
    },

    // setPrepareTaskData
    setPrepareTasksData(state, { payload }: PayloadAction<string[]>) {
      payload.forEach(code => {
        state.tasksData = {
          // возвращаем уже сохранненные данные
          ...state.tasksData,

          // добавляем ключи с названием задачи со значением null
          [code]: null,
        };
      });
    },

    // setPrepareTaskData
    setFillTaskData(state, { payload }: PayloadAction<TTaskData>) {
      (state.tasksData as Record<string, any>)[payload.key] = payload;
    },
  },
});

export const worklogsReducer = worklogsSlice.reducer;

export const {
  resetData,
  resetFilters,
  setLoading,
  setErrors,
  setPerformers,
  setDates,
  setWorklogs,
  setPrepareTasksData,
  setFillTaskData,
} = worklogsSlice.actions;
