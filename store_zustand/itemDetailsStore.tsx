import {create} from 'zustand';
import {Item} from '../types/item.ts';

export interface ItemDetailsState {
    modalVisible: boolean;
    item: Item | {};
    index: number;
    itemDetailsShow: (item: Item | {}, index: number) => void;
    itemDetailsHide: () => void;
    upgradeSelectedItem: () => void;
}

export const itemDetailsStore = create<ItemDetailsState>()(set => ({
    modalVisible: false,
    item: {},
    index: -1,
    itemDetailsShow: (item: Item | {}, index: number) =>
        set({
            modalVisible: true,
            item: item,
            index: index,
        }),
    itemDetailsHide: () =>
        set({
            modalVisible: false,
        }),
    upgradeSelectedItem: () =>
        set(state => ({
            item: {...state.item, upgrade: (state.item as Item).upgrade + 1},
        })),
}));
