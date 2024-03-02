import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {isItem, Item} from '../../types/item.ts';

export interface InventoryState {
    list: (Item | {})[];
}

const initialState: InventoryState = {
    list: new Array(36).fill({}),
};

export const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        updateInventory: (state, action: PayloadAction<(Item | {})[]>) => {
            state.list = Array.from(action.payload);
        },
        pushItem: (state, action: PayloadAction<Item | {}>) => {
            for (let i = 0; i < state.list.length; i++) {
                let itemSlot = state.list[i];
                if (!isItem(itemSlot)) {
                    state.list[i] = action.payload;
                    break;
                }
            }
        },
        addItemAt: (state, action: PayloadAction<[Item | {}, number]>) => {
            state.list[action.payload[1]] = action.payload[0];
        },
        removeItemAt: (state, action: PayloadAction<number>) => {
            state.list[action.payload] = {};
        },
    },
});

export const {updateInventory, pushItem, addItemAt, removeItemAt} =
    inventorySlice.actions;
