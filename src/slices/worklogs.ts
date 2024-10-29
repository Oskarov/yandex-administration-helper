import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

export type TPerformetOption = {
  label: string;
  key: number;
};

type TState = {
  loading: boolean;
  error: string | null;
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
  error: null,
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
    resetState: () => initialState,

    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    },

    // setError
    setError(state, { payload }: PayloadAction<string>) {
      state.error = payload;
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

    // resetWorklogs
    resetWorklogs(state) {
      state.worklogs = null;
    },

    // resetWorklogs
    resetTasksCodes(state) {
      state.selectedTasks = null;
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
  setLoading,
  setError,
  setPerformers,
  setDates,
  setWorklogs,
  resetWorklogs,
  setTasksCodes,
  setSingleTaskCode,
  resetTasksCodes,
} = worklogsSlice.actions;
