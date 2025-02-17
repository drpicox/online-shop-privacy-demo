// store/navigationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Route = 'home' | 'product' | 'cart' | 'likes' | 'checkout' | 'search';

interface NavigationState {
    currentRoute: Route;
    params: Record<string, string>;
    searchQuery: string;
}

const initialState: NavigationState = {
    currentRoute: 'home',
    params: {},
    searchQuery: '',
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        navigate: (state, action: PayloadAction<{ route: Route; params?: Record<string, string> }>) => {
            state.currentRoute = action.payload.route;
            state.params = action.payload.params || {};
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
    },
});

export const { navigate, setSearchQuery } = navigationSlice.actions;
export default navigationSlice.reducer;