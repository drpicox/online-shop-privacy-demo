// store/shop/index.ts
import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './slices/navigationSlice';
import wishlistReducer from './slices/wishlistSlice';
import cartReducer from './slices/cartSlice';
import filterReducer from './slices/filterSlice';
import searchReducer from './slices/searchSlice';
import checkoutReducer from './slices/checkoutSlice';
import trackingReducer from './slices/trackingSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Re-export actions and selectors from slices
export * from './slices/cartSlice';
export * from './slices/checkoutSlice';
export * from './slices/filterSlice';
export * from './slices/navigationSlice';
export * from './slices/searchSlice';
export * from './slices/trackingSlice';
export * from './slices/wishlistSlice';

export const shopStore = configureStore({
  reducer: {
    cart: cartReducer,
    checkout: checkoutReducer,
    filter: filterReducer,
    navigation: navigationReducer,
    search: searchReducer,
    wishlist: wishlistReducer,
    tracking: trackingReducer,
  },
});

export type ShopRootState = ReturnType<typeof shopStore.getState>;
export type ShopAppDispatch = typeof shopStore.dispatch;

export const useShopDispatch: () => ShopAppDispatch = useDispatch;
export const useShopSelector: TypedUseSelectorHook<ShopRootState> = useSelector;