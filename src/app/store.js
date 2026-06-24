import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from '../store';

// Custom storage adapter to fix Vite CommonJS interop issues with redux-persist
const customStorage = {
  setItem(key, value) {
    return Promise.resolve(window.localStorage.setItem(key, value));
  },
  getItem(key) {
    return Promise.resolve(window.localStorage.getItem(key));
  },
  removeItem(key) {
    return Promise.resolve(window.localStorage.removeItem(key));
  },
};

const persistConfig = {
  key: 'root',
  storage: customStorage,
  whitelist: ['auth'], // only auth will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);
