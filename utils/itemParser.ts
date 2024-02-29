import itemsJson from '../assets/json/items_old.json';
import {Item} from '../types/item';

export const getRandomEquip = (rarity: string, level: number): Item => {
    const equip = itemsJson.equipment;

    /* Choose a Random Type */
    let keys = Object.keys(equip);
    const type = keys[Math.floor(Math.random() * keys.length)];

    /* Choose a Random Item */
    // @ts-ignore
    keys = Object.keys(equip[type][rarity]);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    // @ts-ignore
    const randomItem = equip[type][rarity][randomKey];
    const item: Item = {
        id: randomKey,
        name: randomItem.name,
        category: 'equipment',
        type: type,
        rarity: rarity,
        img: randomItem.img,
        level: level,
        quantity: 1,
        variant: 0,
        enhancement: 0,
    };

    switch (type) {
        case 'weapon':
        case 'chest':
            item.variant = rand(1, 2);
            break;
        case 'offhand':
        case 'helmet':
        case 'pants':
        case 'gloves':
        case 'boots':
            item.variant = rand(1, 4);
            break;
        default:
            break;
    }

    return item;
};

const rand = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
