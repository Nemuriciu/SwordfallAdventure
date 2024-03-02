import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Item} from '../../types/item.ts';

export interface ItemDetailsState {
    modalVisible: boolean;
    item: Item | {};
    index: number;
}

const initialState: ItemDetailsState = {
    modalVisible: false,
    item: {},
    index: -1,
};

export const itemDetailsSlice = createSlice({
    name: 'itemDetails',
    initialState,
    reducers: {
        showItemDetails: (
            state,
            action: PayloadAction<[Item | {}, number]>,
        ) => {
            state.modalVisible = true;
            state.item = action.payload[0];
            state.index = action.payload[1];
        },
        hideItemDetails: state => {
            state.modalVisible = false;
            state.item = {};
            state.index = -1;
        },
    },
});

export const {showItemDetails, hideItemDetails} = itemDetailsSlice.actions;
