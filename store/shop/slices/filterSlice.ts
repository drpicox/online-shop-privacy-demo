import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
    category: string;
}

const initialState: FilterState = {
    category: 'Tots',
};

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setCategory: (state, action: PayloadAction<string>) => {
            state.category = action.payload;
        },
    },
});

export const { setCategory } = filterSlice.actions;
export default filterSlice.reducer;

export function selectCategory(state: { filter: FilterState }) {
    return state.filter.category;
}
