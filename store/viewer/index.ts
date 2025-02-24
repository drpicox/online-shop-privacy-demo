// store/viewer/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// This will be expanded as the viewer functionality is implemented
export const viewerStore = configureStore({
  reducer: {
    // No reducers yet
  },
});

export type ViewerRootState = ReturnType<typeof viewerStore.getState>;
export type ViewerAppDispatch = typeof viewerStore.dispatch;

export const useViewerDispatch: () => ViewerAppDispatch = useDispatch;
export const useViewerSelector: TypedUseSelectorHook<ViewerRootState> = useSelector;