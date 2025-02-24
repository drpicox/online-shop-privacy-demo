// store/navigationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Route = 'home' | 'product' | 'cart' | 'likes' | 'checkout' | 'search';

interface NavigationState {
    currentRoute: Route;
    params: Record<string, string>;
}

const initialState: NavigationState = {
    currentRoute: 'home',
    params: {},
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        navigate: (state, action: PayloadAction<{ route: Route; params?: Record<string, string> }>) => {
            state.currentRoute = action.payload.route;
            state.params = action.payload.params || {};
        },
        syncWithBrowserHistory: (state, action: PayloadAction<{ route: Route; params?: Record<string, string> }>) => {
            state.currentRoute = action.payload.route;
            state.params = action.payload.params || {};
        },
    },
});

export const { navigate, syncWithBrowserHistory } = navigationSlice.actions;
export default navigationSlice.reducer;

export function selectNavigation(state: { navigation: NavigationState }) {
    return state.navigation;
}