import {create} from 'zustand';
import {Item} from '../types/item.ts';

export interface CraftingDetailsState {
    modalVisible: boolean;
    item: Item | {};
    materials: Item[];
    index: number;
    craftingDetailsShow: (
        item: Item | {},
        materials: Item[],
        index: number,
    ) => void;
    craftingDetailsHide: () => void;
}

export const craftingDetailsStore = create<CraftingDetailsState>()(set => ({
    modalVisible: false,
    item: {},
    materials: [],
    index: -1,
    craftingDetailsShow: (item: Item | {}, materials: Item[], index: number) =>
        set({
            modalVisible: true,
            item: item,
            materials: materials,
            index: index,
        }),
    craftingDetailsHide: () =>
        set({
            modalVisible: false,
        }),
}));
