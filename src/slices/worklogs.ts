import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

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
  selectedTasks: Record<string, string> | null;
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
  selectedTasks: null,
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
    resetState(state) {
      state.errors = [];
      state.worklogs = null;
      state.selectedTasks = null;
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

    setTasksCodes(state, { payload }: PayloadAction<string[]>) {
      const dataObj = payload.reduce<Record<string, string>>((total, item) => {
        total[item] = '';

        return total;
      }, {});

      state.selectedTasks = {
        ...state.selectedTasks,
        ...dataObj,
      };
    },

    setSingleTaskCode(
      state,
      {
        payload,
      }: PayloadAction<{
        code: string;
        type: string;
      }>,
    ) {
      (state.selectedTasks as Record<string, string>)[payload.code] =
        payload.type;
    },
  },
});

export const worklogsReducer = worklogsSlice.reducer;

export const {
  resetState,
  resetFilters,
  setLoading,
  setErrors,
  setPerformers,
  setDates,
  setWorklogs,
  setTasksCodes,
  setSingleTaskCode,
} = worklogsSlice.actions;
