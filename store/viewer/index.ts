// store/viewer/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import clientsReducer from './slices/clientsSlice';

// Export actions and selectors
export * from './slices/clientsSlice';

export const viewerStore = configureStore({
  reducer: {
    clients: clientsReducer,
  },
});

export type ViewerRootState = ReturnType<typeof viewerStore.getState>;
export type ViewerAppDispatch = typeof viewerStore.dispatch;

export const useViewerDispatch: () => ViewerAppDispatch = useDispatch;
export const useViewerSelector: TypedUseSelectorHook<ViewerRootState> = useSelector;