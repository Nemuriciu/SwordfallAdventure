import {isItem, Item} from '../types/item';

export function isFull(list: (Item | {})[]): boolean {
    for (let item of list) {
        if (!isItem(item)) {
            return false;
        }
    }
    return true;
}

//TODO: addItems()
export function addItem(item: Item, list: (Item | {})[]): (Item | {})[] {
    const listCopy = Array.from(list);
    const index = listCopy.findIndex(itemSlot => !isItem(itemSlot));

    if (index !== -1) {
        listCopy[index] = item;
    }

    return listCopy;
}

export function removeLastItem(
    list: (Item | {})[],
    quantity: number,
): (Item | {})[] {
    const listCopy: (Item | {})[] = Array.from(list);

    for (let i = listCopy.length - 1; i >= 0; i--) {
        const item: Item | {} = listCopy[i];
        if (isItem(item)) {
            if (item.quantity > quantity) {
                item.quantity -= quantity;
            } else {
                listCopy[i] = {};
            }
            break;
        }
    }

    return listCopy;
}

export function clearInventory(list: (Item | {})[]): (Item | {})[] {
    return new Array(list.length).fill({});
}
