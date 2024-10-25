import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

type IWorklogsState = {
  loading: boolean;
  error: string | null;
  filter: {
    performers: string[];
    dateFrom: Dayjs | null;
    dateTo: Dayjs | null;
  };
  worklogs: any[]; // TODO: Define type for worklogs array
};

const initialState: IWorklogsState = {
  loading: false,
  error: null,
  filter: {
    performers: [],
    dateFrom: dayjs(new Date()),
    dateTo: dayjs(new Date()),
  },
  worklogs: [],
};

const worklogsSlice = createSlice({
  name: 'worklogs',
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

    // setPerformers
    setPerformers(state, { payload }: PayloadAction<string>) {
      const { performers } = state.filter;
      const isInclude = state.filter.performers.includes(payload);

      if (isInclude) {
        state.filter.performers = performers.filter(id => id !== payload);
      } else {
        state.filter.performers = [...performers, payload];
      }
    },

    // setDates
    setDates(state, { payload }: PayloadAction<string>) {
      const { dateFrom, dateTo } = state.filter;
    },

    // setWorklogs
    setWorklogs(state, { payload }: PayloadAction<any[]>) {
      state.worklogs = payload;
    },
  },
});

export const worklogsReducer = worklogsSlice.reducer;

export const { setLoading, setError, setDates, setPerformers, setWorklogs } =
  worklogsSlice.actions;
