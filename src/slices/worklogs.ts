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
};

type TDate = {
  name: 'dateFrom' | 'dateTo';
  value: Dayjs | null;
};

const worklogsSlice = createSlice({
  name: 'worklogs',
  initialState: initialState,
  reducers: {
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
  },
});

export const worklogsReducer = worklogsSlice.reducer;

export const { setLoading, setError, setPerformers, setDates, setWorklogs } =
  worklogsSlice.actions;
