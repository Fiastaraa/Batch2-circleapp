import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import threadReducer from './threadSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadReducer,
  },
});
