import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import dataReducer from './redux/dataSlice';
import pipelineReducer from './redux/pipelineSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedDataReducer = persistReducer(persistConfig, dataReducer);
const persistedPipelineReducer = persistReducer(persistConfig, pipelineReducer);

const rootReducer = combineReducers({
  data: persistedDataReducer,
  pipeline: persistedPipelineReducer,
});

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer:  rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ["persist/PERSIST"],
    },
  }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch