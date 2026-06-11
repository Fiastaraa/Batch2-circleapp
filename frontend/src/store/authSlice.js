import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const savedTheme = localStorage.getItem('theme') || 'dark';

const initialState = {
  user: null,
  token: token || null,
  isAuthenticated: !!token,
  theme: savedTheme,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setProfile: (state, action) => {
      state.user = action.payload;
    },
    updateProfileSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  setProfile,
  updateProfileSuccess,
  logout,
  toggleTheme,
} = authSlice.actions;

export default authSlice.reducer;
