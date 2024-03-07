import {isItem, Item} from '../types/item';
import {getItemCategory} from '../parsers/itemParser.tsx';

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

function getInventoryIndex(item: Item, list: (Item | {})[]): number {
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
