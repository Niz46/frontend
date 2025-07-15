// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducer/rootReducer";

// 1️⃣ Persist config: blacklist the blog slice so it's never stored
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["blog"],
};

// 2️⃣ Create a persisted reducer wrapping your rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3️⃣ Configure the store with the persisted reducer and middleware settings
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignore redux‑persist actions in serializable checks
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 4️⃣ Create the persistor instance
export const persistor = persistStore(store);
