// store/checkoutSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CheckoutState {
    name: string;
    city: string;
    phone: string;
    isConfirmed: boolean;
}

const initialState: CheckoutState = {
    name: '',
    city: '',
    phone: '',
    isConfirmed: false,
};

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setCity: (state, action: PayloadAction<string>) => {
            state.city = action.payload;
        },
        setPhone: (state, action: PayloadAction<string>) => {
            state.phone = action.payload;
        },
        confirmOrder: (state) => {
            state.isConfirmed = true;
        },
        resetCheckout: (state) => {
            return initialState;
        },
    },
});

export const { setName, setCity, setPhone, confirmOrder, resetCheckout } = checkoutSlice.actions;

export const selectCheckoutInfo = (state: { checkout: CheckoutState }) => state.checkout;
export const selectIsConfirmed = (state: { checkout: CheckoutState }) => state.checkout.isConfirmed;

export default checkoutSlice.reducer;