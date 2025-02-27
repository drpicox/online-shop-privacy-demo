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
import socketMiddleware from './middleware/socketMiddleware';
import { useClientContext } from '../context/ClientContext';
import { selectClientState } from '../viewer';
import { useViewerSelector } from '../viewer';

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
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(socketMiddleware),
});

export type ShopRootState = ReturnType<typeof shopStore.getState>;
export type ShopAppDispatch = typeof shopStore.dispatch;

export const useShopDispatch: () => ShopAppDispatch = useDispatch;

// Modified useShopSelector to handle client context
export const useShopSelector: TypedUseSelectorHook<ShopRootState> = (selector) => {
  // Get current client context
  const { clientId } = useClientContext();
  
  // If no client ID is specified in context, behave like normal useSelector
  if (!clientId) {
    return useSelector(selector);
  }
  
  // Use the viewer selector to get the client state
  const clientState = useViewerSelector(state => selectClientState(state, clientId));
  
  // If we have a client state, use it with the selector
  if (clientState?.state) {
    try {
      return selector(clientState.state as ShopRootState);
    } catch (error) {
      console.error('Error selecting from client state:', error);
      // Fallback to regular selector if there was an issue
      return useSelector(selector);
    }
  }
  
  // Fallback to regular selector if client state is not available
  return useSelector(selector);
};