import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';
import counterReducer from './slices/counterSlice';
import f1Reducer from './slices/f1Slice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    counter: counterReducer,
    f1: f1Reducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
