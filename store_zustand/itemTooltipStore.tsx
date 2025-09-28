import {create} from 'zustand';
import {Item} from '../types/item.ts';

export interface ItemTooltipState {
    visible: boolean;
    item: Item | {};
    itemTooltipShow: (item: Item) => void;
    itemTooltipHide: () => void;
}

export const itemTooltipStore = create<ItemTooltipState>()(set => ({
    visible: false,
    item: {},
    itemTooltipShow: (item: Item) =>
        set({
            visible: true,
            item: item,
        }),
    itemTooltipHide: () =>
        set({
            visible: false,
        }),
}));
