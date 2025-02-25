// store/navigationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Route = 'home' | 'product' | 'cart' | 'likes' | 'checkout' | 'search';

interface NavigationState {
    currentRoute: Route;
    params: Record<string, string>;
    basePath: string;
}

const initialState: NavigationState = {
    currentRoute: 'home',
    params: {},
    basePath: '/shop', // Default base path for the shop section
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
        setBasePath: (state, action: PayloadAction<string>) => {
            state.basePath = action.payload;
        },
    },
});

export const { navigate, syncWithBrowserHistory, setBasePath } = navigationSlice.actions;
export default navigationSlice.reducer;

export function selectNavigation(state: { navigation: NavigationState }) {
    return state.navigation;
}

// Helper function to get the full path including base path
export function getFullPath(path: string, basePath: string = '/shop'): string {
    // Ensure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // For home route, just return the basePath
    if (normalizedPath === '/') {
        return basePath;
    }
    
    // Otherwise, combine basePath with the path
    return `${basePath}${normalizedPath}`;
}