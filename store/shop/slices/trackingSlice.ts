// store/trackingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface TrackingState {
  clientId: string;
  viewport: {
    width: number;
    height: number;
  };
  scroll: {
    x: number;
    y: number;
  };
  cursor: {
    x: number;
    y: number;
  };
  lastUpdated: number;
}

const initialState: TrackingState = {
  clientId: '',
  viewport: {
    width: 0,
    height: 0,
  },
  scroll: {
    x: 0,
    y: 0,
  },
  cursor: {
    x: 0,
    y: 0,
  },
  lastUpdated: 0,
};

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    initializeClientId: (state) => {
      if (!state.clientId) {
        state.clientId = uuidv4();
      }
    },
    updateViewport: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.viewport = action.payload;
      state.lastUpdated = Date.now();
    },
    updateScroll: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.scroll = action.payload;
      state.lastUpdated = Date.now();
    },
    updateCursor: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.cursor = action.payload;
      state.lastUpdated = Date.now();
    },
  },
});

export const { initializeClientId, updateViewport, updateScroll, updateCursor } = trackingSlice.actions;
export default trackingSlice.reducer;

// Full tracking selector (use sparingly to avoid unnecessary re-renders)
export function selectTracking(state: { tracking: TrackingState }) {
  return state.tracking;
}

// Specific selectors for granular component updates
export function selectViewportSize(state: { tracking: TrackingState }) {
  return state.tracking.viewport;
}

export function selectViewportWidth(state: { tracking: TrackingState }) {
  return state.tracking.viewport.width;
}

export function selectViewportHeight(state: { tracking: TrackingState }) {
  return state.tracking.viewport.height;
}

export function selectScrollPosition(state: { tracking: TrackingState }) {
  return state.tracking.scroll;
}

export function selectCursorPosition(state: { tracking: TrackingState }) {
  return state.tracking.cursor;
}