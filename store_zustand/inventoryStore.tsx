import {create} from 'zustand';
import {isItem, Item} from '../types/item.ts';
import {addItem} from '../utils/arrayUtils.ts';

export interface InventoryState {
    inventoryList: (Item | {})[];
    inventoryUpdate: (list: (Item | {})[]) => void;
    inventoryAddItems: (items: Item[]) => void;
    inventoryAddItemAt: (item: Item, index: number) => void;
    inventoryRemoveItemAt: (index: number, quantity: number) => void;
    inventoryRemoveMultipleItemsAt: (
        index: number[],
        quantity: number[],
    ) => void;
    inventoryUpgradeItemAt: (index: number) => void;
}

export const inventoryStore = create<InventoryState>()(set => ({
    inventoryList: new Array(36).fill({}),
    inventoryUpdate: (list: (Item | {})[]) =>
        set({
            inventoryList: Array.from(list),
        }),
    inventoryAddItems: (items: Item[]) =>
        set(state => ({
            inventoryList: items.reduce(
                (newList, item) => {
                    addItem(item, newList);
                    return newList;
                },
                [...state.inventoryList],
            ),
        })),

    inventoryAddItemAt: (item: Item, index: number) =>
        set(state => ({
            inventoryList: state.inventoryList.map((_item, i) =>
                i === index ? item : _item,
            ),
        })),

    inventoryRemoveItemAt: (index: number, quantity: number) =>
        set(state => ({
            inventoryList: state.inventoryList.map((item, i) => {
                if (i !== index) {
                    return item;
                }
                const typedItem = item as Item;
                return typedItem.quantity > quantity
                    ? {...typedItem, quantity: typedItem.quantity - quantity}
                    : {};
            }),
        })),

    inventoryRemoveMultipleItemsAt: (index: number[], quantity: number[]) =>
        set(state => {
            const inventoryList = [...state.inventoryList];

            for (let i = 0; i < index.length; i++) {
                const idx = index[i];
                const qty = quantity[i];
                const item = inventoryList[idx] as Item;

                if (item.quantity > qty) {
                    inventoryList[idx] = {
                        ...item,
                        quantity: item.quantity - qty,
                    };
                } else {
                    inventoryList[idx] = {};
                }
            }

            return {inventoryList};
        }),

    inventoryUpgradeItemAt: (index: number) =>
        set(state => ({
            inventoryList: state.inventoryList.map((item, i) => {
                if (i !== index || !isItem(item)) {
                    return item;
                }
                const typedItem = item as Item;
                return {...typedItem, upgrade: typedItem.upgrade + 1};
            }),
        })),
}));
