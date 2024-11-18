import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  ITrackerBoard,
  ITrackerNoMemoState,
  ITrackerQueueTask,
  ITrackerSprint,
  ITrackerUser,
} from '../interfaces/ITracker';

const initialState: ITrackerNoMemoState = {
  boards: [],
  sprints: [],
  users: [],
  tasksForTime: [],
};

const trackerNoMemoSlice = createSlice({
  name: 'trackerNoMemo',
  initialState: initialState,

  reducers: {
    changeBoards(state, { payload }: PayloadAction<ITrackerBoard[]>) {
      state.boards = payload;
    },

    changeSprints(state, { payload }: PayloadAction<ITrackerSprint[]>) {
      state.sprints = payload;
    },

    changeUsers(state, { payload }: PayloadAction<ITrackerUser[]>) {
      state.users = payload;
    },

    changeTasks(state, { payload }: PayloadAction<ITrackerQueueTask[]>) {
      state.tasksForTime = payload;
    },
  },
});

export const trackerNoMemoReducer = trackerNoMemoSlice.reducer;

export const { changeBoards, changeSprints, changeUsers, changeTasks } =
  trackerNoMemoSlice.actions;
