// src/slices/blogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

// Async thunk to fetch posts (global)
export const fetchPosts = createAsyncThunk(
  "blog/fetchPosts",
  async ({ status = "published", page = 1 }) => {
    const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
      params: { status, page },
    });
    return response.data;
  },
);

// NEW: Async thunk to fetch posts by tag (paginated)
export const fetchPostsByTag = createAsyncThunk(
  "blog/fetchPostsByTag",
  async ({ tag, status = "published", page = 1 }) => {
    // Backend expects tag in the path - GET_BY_TAG returns { posts, page, totalPages, totalCount }
    const path =
      typeof API_PATHS.POSTS.GET_BY_TAG === "function"
        ? API_PATHS.POSTS.GET_BY_TAG(tag)
        : `/api/posts/tag/${tag}`;

    const response = await axiosInstance.get(path, {
      params: { status, page },
    });
    return { tag, ...response.data };
  },
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

    // NEW: tag-specific caches to support pagination per tag
    tagPages: {
      // example shape:
      // Journals: { posts: [], page: 1, totalPages: 1, totalCount: 0, status: 'idle' }
    },
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
      state.tagPages = {};
    },
    removeLastPage: (state) => {
      if (state.page > 1) {
        const lastSize = state.pageSizes.pop() || 0;
        state.posts = state.posts.slice(0, state.posts.length - lastSize);
        state.page -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // global fetch
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
      })

      // tag-specific fetch lifecycle
      .addCase(fetchPostsByTag.pending, (state, action) => {
        const tag = action.meta.arg.tag;
        if (!state.tagPages[tag]) {
          state.tagPages[tag] = {
            posts: [],
            page: 1,
            totalPages: 1,
            totalCount: 0,
            status: "loading",
            error: null,
          };
        } else {
          state.tagPages[tag].status = "loading";
          state.tagPages[tag].error = null;
        }
      })
      .addCase(fetchPostsByTag.fulfilled, (state, action) => {
        const {
          tag,
          posts = [],
          page = 1,
          totalPages = 1,
          totalCount = 0,
        } = action.payload;
        const current = state.tagPages[tag] || {
          posts: [],
          page: 1,
          totalPages: 1,
          totalCount: 0,
        };

        current.status = "succeeded";
        current.totalPages = totalPages;
        current.totalCount = totalCount;
        current.page = page;

        if (page === 1) {
          current.posts = posts;
        } else {
          current.posts = (current.posts || []).concat(posts);
        }

        state.tagPages[tag] = current;
      })
      .addCase(fetchPostsByTag.rejected, (state, action) => {
        const tag = action.meta.arg.tag;
        if (!state.tagPages[tag])
          state.tagPages[tag] = {
            posts: [],
            page: 1,
            totalPages: 1,
            totalCount: 0,
            status: "failed",
            error: action.error.message,
          };
        else {
          state.tagPages[tag].status = "failed";
          state.tagPages[tag].error = action.error.message;
        }
      });
  },
});

export const { resetBlogState, removeLastPage } = blogSlice.actions;

export default blogSlice.reducer;
