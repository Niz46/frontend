// src/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import blogReducer from "../slices/blogSlice";
import authReducer from "../slices/authSlice";
import usersReducer from '../slices/usersSlice';
// import other reducers here…

export default combineReducers({
  blog: blogReducer,
  auth: authReducer,
  users: usersReducer
  // other slices…
});
