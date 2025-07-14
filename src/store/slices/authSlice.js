// src/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,          // the logged‑in user object
  openAuthForm: false, // controls whether your login/signup modal is open
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
    setOpenAuthForm(state, action) {
      state.openAuthForm = action.payload;
    },
  },
});

export const { setUser, logout, setOpenAuthForm } = authSlice.actions;
export default authSlice.reducer;
