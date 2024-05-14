import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {isItem, Item} from '../../types/item.ts';
import {addItem} from '../../utils/arrayUtils.ts';

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
        inventoryUpdate: (state, action: PayloadAction<(Item | {})[]>) => {
            state.list = Array.from(action.payload);
        },
        inventoryAddItems: (state, action: PayloadAction<Item[]>) => {
            let list = state.list;
            for (let i = 0; i < action.payload.length; i++) {
                addItem(action.payload[i], list);
            }

            state.list = list;
        },
        inventoryAddItemAt: (
            state,
            action: PayloadAction<[Item | {}, number]>,
        ) => {
            state.list[action.payload[1]] = action.payload[0];
        },
        inventoryRemoveItemAt: (
            state,
            action: PayloadAction<{index: number; quantity: number}>,
        ) => {
            if (
                (state.list[action.payload.index] as Item).quantity >
                action.payload.quantity
            ) {
                (state.list[action.payload.index] as Item).quantity -=
                    action.payload.quantity;
            } else {
                state.list[action.payload.index] = {};
            }
        },
        inventoryRemoveMultipleItemsAt: (
            state,
            action: PayloadAction<{index: number[]; quantity: number[]}>,
        ) => {
            for (let i = 0; i < action.payload.index.length; i++) {
                if (
                    (state.list[action.payload.index[i]] as Item).quantity >
                    action.payload.quantity[i]
                ) {
                    (state.list[action.payload.index[i]] as Item).quantity -=
                        action.payload.quantity[i];
                } else {
                    state.list[action.payload.index[i]] = {};
                }
            }
        },
        inventoryUpgradeItem: (state, action: PayloadAction<number>) => {
            if (isItem(state.list[action.payload])) {
                // @ts-ignore
                state.list[action.payload].upgrade += 1;
            }
        },
    },
});

export const {
    inventoryUpdate,
    inventoryAddItems,
    inventoryAddItemAt,
    inventoryRemoveItemAt,
    inventoryRemoveMultipleItemsAt,
    inventoryUpgradeItem,
} = inventorySlice.actions;
