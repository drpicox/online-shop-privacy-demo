// store/wishlistSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types';

interface WishlistState {
    items: Product[];
}

const initialState: WishlistState = {
    items: []
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action: PayloadAction<Product>) => {
            if (!state.items.some(item => item.id === action.payload.id)) {
                state.items.push(action.payload);
            }
        },
        removeFromWishlist: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        clearWishlist: (state) => {
            state.items = [];
        }
    }
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

// Selector
export const selectIsInWishlist = (state: { wishlist: WishlistState }, productId: number) =>
    state.wishlist.items.some(item => item.id === productId);