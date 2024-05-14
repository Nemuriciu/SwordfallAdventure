import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {isItem, Item} from '../../types/item.ts';

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
        itemDetailsShow: (
            state,
            action: PayloadAction<[Item | {}, number]>,
        ) => {
            state.modalVisible = true;
            state.item = action.payload[0];
            state.index = action.payload[1];
        },
        itemDetailsHide: state => {
            state.modalVisible = false;
            state.item = {};
            state.index = -1;
        },
        upgradeSelectedItem: state => {
            if (isItem(state.item)) {
                state.item.upgrade += 1;
            }
        },
    },
});

export const {itemDetailsShow, itemDetailsHide, upgradeSelectedItem} =
    itemDetailsSlice.actions;
