import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: storage,

  // список названий слайсов, которые не нужно персистить
  blacklist: ['modalSlice', 'trackerNoMemo', 'worklogs'],
};

export const rootReducers = combineReducers({
  ...reducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export type TStore = ReturnType<typeof store.getState>;
