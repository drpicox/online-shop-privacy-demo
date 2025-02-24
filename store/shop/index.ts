// store/shop/index.ts
import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../navigationSlice';
import wishlistReducer from '../wishlistSlice';
import cartReducer from '../cartSlice';
import filterReducer from '../filterSlice';
import searchReducer from '../searchSlice';
import checkoutReducer from '../checkoutSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const shopStore = configureStore({
  reducer: {
    cart: cartReducer,
    checkout: checkoutReducer,
    filter: filterReducer,
    navigation: navigationReducer,
    search: searchReducer,
    wishlist: wishlistReducer,
  },
});

export type ShopRootState = ReturnType<typeof shopStore.getState>;
export type ShopAppDispatch = typeof shopStore.dispatch;

export const useShopDispatch: () => ShopAppDispatch = useDispatch;
export const useShopSelector: TypedUseSelectorHook<ShopRootState> = useSelector;