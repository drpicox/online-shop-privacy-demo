// store/shop/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isSearchVisible: boolean;
}

const initialState: UIState = {
  isSearchVisible: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSearchVisibility: (state) => {
      state.isSearchVisible = !state.isSearchVisible;
    },
    setSearchVisibility: (state, action: PayloadAction<boolean>) => {
      state.isSearchVisible = action.payload;
    },
  },
});

export const { toggleSearchVisibility, setSearchVisibility } = uiSlice.actions;
export default uiSlice.reducer;

export function selectIsSearchVisible(state: any) {
  return state.ui?.isSearchVisible || false;
}