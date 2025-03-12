// store/viewer/reducers/shopReducers.ts
// Import the original shop reducers to reuse them
import cartReducer from '../../shop/slices/cartSlice';
import filterReducer from '../../shop/slices/filterSlice';
import searchReducer from '../../shop/slices/searchSlice';
import navigationReducer from '../../shop/slices/navigationSlice';
import trackingReducer from '../../shop/slices/trackingSlice';
import wishlistReducer from '../../shop/slices/wishlistSlice';
import checkoutReducer from '../../shop/slices/checkoutSlice';
import uiReducer from '../../shop/slices/uiSlice';
import { combineReducers } from '@reduxjs/toolkit';

// Combine all shop reducers
const shopReducers = combineReducers({
  cart: cartReducer,
  filter: filterReducer,
  search: searchReducer,
  navigation: navigationReducer,
  tracking: trackingReducer,
  wishlist: wishlistReducer,
  checkout: checkoutReducer,
  ui: uiReducer,
});

export default shopReducers;