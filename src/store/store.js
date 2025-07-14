// src/store.js
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
import storage from "redux-persist/lib/storage"; // uses localStorage
import rootReducer from "./reducer/rootReducer"; // see next step

// 1️⃣ Configure redux-persist
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// 2️⃣ Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3️⃣ Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist actions need to be ignored for serializability
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 4️⃣ Create the persistor
export const persistor = persistStore(store);
