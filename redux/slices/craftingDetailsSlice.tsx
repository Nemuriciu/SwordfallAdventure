import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Item} from '../../types/item.ts';

export interface CraftingDetailsState {
    modalVisible: boolean;
    item: Item | {};
    materials: Item[];
    index: number;
}

const initialState: CraftingDetailsState = {
    modalVisible: false,
    item: {},
    materials: [],
    index: -1,
};

export const craftingDetailsSlice = createSlice({
    name: 'craftingDetails',
    initialState,
    reducers: {
        craftingDetailsShow: (
            state,
            action: PayloadAction<[Item | {}, Item[], number]>,
        ) => {
            state.modalVisible = true;
            state.item = action.payload[0];
            state.materials = action.payload[1];
            state.index = action.payload[2];
        },
        craftingDetailsHide: state => {
            state.modalVisible = false;
        },
    },
});

export const {craftingDetailsShow, craftingDetailsHide} =
    craftingDetailsSlice.actions;
