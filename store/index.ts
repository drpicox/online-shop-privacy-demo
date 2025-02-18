// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './navigationSlice';
import wishlistReducer from './wishlistSlice';
import cartReducer from "@/store/cartSlice";
import filterReducer from "@/store/filterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        filter: filterReducer,
        navigation: navigationReducer,
        wishlist: wishlistReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;