// store/viewer/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import clientsReducer from './slices/clientsSlice';
import shopReducers from './reducers/shopReducers';
import clientStateMiddleware from './middleware/clientStateMiddleware';

// Export actions and selectors
export * from './slices/clientsSlice';

// Root reducers for the viewer
const rootReducer = {
  clients: clientsReducer
};

// Create the store
export const viewerStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(clientStateMiddleware),
});

export type ViewerRootState = ReturnType<typeof viewerStore.getState>;
export type ViewerAppDispatch = typeof viewerStore.dispatch;

export const useViewerDispatch: () => ViewerAppDispatch = useDispatch;
export const useViewerSelector: TypedUseSelectorHook<ViewerRootState> = useSelector;