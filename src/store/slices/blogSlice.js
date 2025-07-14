// src/slices/blogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

// Async thunk to fetch posts
export const fetchPosts = createAsyncThunk(
  "blog/fetchPosts",
  async ({ status = "published", page = 1 }) => {
    const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
      params: { status, page },
    });
    return response.data;
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    posts: [],
    page: 1,
    totalPages: 1,
    totalCount: 0,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    pageSizes: [], // <-- track how many posts came back for each page
  },
  reducers: {
    resetBlogState: (state) => {
      state.posts = [];
      state.page = 1;
      state.totalPages = 1;
      state.totalCount = 0;
      state.status = "idle";
      state.error = null;
      state.pageSizes = [];
    },
    removeLastPage: (state) => {
      if (state.page > 1) {
        // drop the last N posts that were loaded
        const lastSize = state.pageSizes.pop() || 0;
        state.posts = state.posts.slice(0, state.posts.length - lastSize);
        state.page -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const { posts, page, totalPages, totalCount } = action.payload;
        state.status = "succeeded";
        state.page = page;
        state.totalPages = totalPages;
        state.totalCount = totalCount;

        if (page === 1) {
          state.posts = posts;
          state.pageSizes = [posts.length];
        } else {
          state.posts = state.posts.concat(posts);
          state.pageSizes.push(posts.length);
        }
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetBlogState, removeLastPage } = blogSlice.actions;

export default blogSlice.reducer;
