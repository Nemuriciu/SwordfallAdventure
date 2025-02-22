import {isItem, isItemIdentical, Item} from '../types/item';
import {
    getItemCategory,
    getItemCategoryAsValue,
    getItemRarityAsValue,
    getKey,
} from '../parsers/itemParser.tsx';

export function addItem(item: Item, list: (Item | {})[]) {
    const category = getItemCategory(item.id);
    let index;

    if (category !== 'equipment' && itemExists(item, list)) {
        index = getInventoryIndex(item, list);
        (list[index] as Item).quantity += item.quantity;
    } else {
        index = list.findIndex(itemSlot => !isItem(itemSlot));

        if (index !== -1) {
            list[index] = item;
        }
    }
}

export function clearInventory(list: (Item | {})[]): (Item | {})[] {
    return new Array(list.length).fill({});
}

export function isFull(list: (Item | {})[]): boolean {
    for (let item of list) {
        if (!isItem(item)) {
            return false;
        }
    }
    return true;
}

export function hasTreasureKey(
    list: (Item | {})[],
    rarity: string,
    level: number,
): boolean {
    const key = getKey(rarity, level, 1);
    return itemExists(key, list);
}

export function sortInventoryList(list: (Item | {})[]) {
    list.sort((a, b): number => {
        const isEmptyA = Object.keys(a).length === 0;
        const isEmptyB = Object.keys(b).length === 0;

        // Place empty objects at the end
        if (isEmptyA && !isEmptyB) {
            return 1;
        }
        if (!isEmptyA && isEmptyB) {
            return -1;
        }
        if (isEmptyA && isEmptyB) {
            return 0;
        }

        if (isItem(a) && isItem(b)) {
            if (a.level !== b.level) {
                // Sort by level first
                return b.level - a.level;
            }

            // Sort by rarity
            if (getItemRarityAsValue(a.id) !== getItemRarityAsValue(b.id)) {
                return getItemRarityAsValue(a.id) - getItemRarityAsValue(b.id);
            }

            // Sort by category
            return getItemCategoryAsValue(a.id) - getItemCategoryAsValue(b.id);
        }

        return 0;
    });
}

export function areListsIdentical(
    list1: (Item | {})[],
    list2: (Item | {})[],
): boolean {
    return list1.every((item, index) => {
        let item2 = list2[index];

        if (isItem(item) && isItem(item2)) {
            return isItemIdentical(item, item2);
        } else {
            return !isItem(item) && !isItem(item2);
        }
    });
}

export function getInventoryIndex(item: Item, list: (Item | {})[]): number {
    for (let i = 0; i < list.length; i++) {
        const _item = list[i];
        if (isItem(_item)) {
            if (
                _item.id === item.id &&
                _item.level === item.level &&
                _item.variant === item.variant &&
                _item.upgrade === item.upgrade
            ) {
                return i;
            }
        }
    }

    return -1;
}

function itemExists(item: Item, list: (Item | {})[]) {
    for (let i = 0; i < list.length; i++) {
        const _item = list[i];
        if (isItem(_item)) {
            if (
                _item.id === item.id &&
                _item.level === item.level &&
                _item.variant === item.variant &&
                _item.upgrade === item.upgrade
            ) {
                return true;
            }
        }
    }
    return false;
}
