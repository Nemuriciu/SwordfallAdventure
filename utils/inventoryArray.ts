import {Item} from '../types/item';

function isEmptySlot(obj: Item) {
    return Object.keys(obj).length === 0;
}
export function isFull(list: Item[]) {
    for (let item of list) {
        if (isEmptySlot(item)) {
            return false;
        }
    }
    return true;
}

export function itemExists(item: Item, list: Item[]) {
    return list.some(obj => obj && obj.name === item.name); //TODO: check id and more
}

//TODO: addItems()
export function addItem(item: Item, list: Item[]) {
    const listCopy = Array.from(list);
    const index = listCopy.findIndex(obj => !obj);

    if (index !== -1) {
        listCopy[index] = item;
        return listCopy;
    } else {
        return null;
    }
}

export function removeItemAt(
    index: number,
    list: (Item | null)[],
    quantity: number,
) {
    const listCopy = Array.from(list);
    const item = listCopy[index];
    if (!item) {
        return null;
    }

    if (item.quantity > quantity) {
        item.quantity -= quantity;
    } else {
        listCopy[index] = null;
    }

    return listCopy;
}

//export function removeItem(item: Item, list: Item[]) {}
