import itemsJson from '../assets/json/items.json';
import equipJson from '../assets/json/equipment.json';
import chestsJson from '../assets/json/chests.json';
import resourcesJson from '../assets/json/resources.json';
import {Item} from '../types/item.ts';
import {colors} from '../utils/colors.ts';

export function getItemName(id: string): string {
    // @ts-ignore
    return itemsJson[id].name;
}
export function getItemImg(id: string): string {
    // @ts-ignore
    return itemsJson[id].img;
}
export function getItemCategory(id: string): string {
    // @ts-ignore
    return itemsJson[id].category;
}
export function getItemType(id: string): string {
    // @ts-ignore
    return itemsJson[id].type;
}
export function getItemRarity(id: string): string {
    // @ts-ignore
    return itemsJson[id].rarity;
}
export function getItemColor(rarity: string) {
    switch (rarity) {
        case 'common':
            return colors.common;
        case 'uncommon':
            return colors.uncommon;
        case 'rare':
            return colors.rare;
        case 'epic':
            return colors.epic;
    }
}

export const getRandomEquip = (rarity: string, level: number): Item => {
    const allRarityItems = [];
    // @ts-ignore
    for (const key in equipJson[rarity]) {
        // @ts-ignore
        allRarityItems.push(...equipJson[rarity][key]);
    }

    /* Choose a Random Item ID */
    const id = allRarityItems[rand(0, allRarityItems.length - 1)];
    const type = getItemType(id);

    /* Choose a Random Item */
    const item: Item = {
        id: id,
        level: level,
        quantity: 1,
        variant: 0,
        upgrade: 0,
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
export const getChest = (
    rarity: string,
    level: number,
    quantity: number,
): Item => {
    return {
        // @ts-ignore
        id: chestsJson[rarity].chest,
        level: level,
        quantity: quantity,
        variant: 0,
        upgrade: 0,
    };
};
export const getKey = (
    rarity: string,
    level: number,
    quantity: number,
): Item => {
    return {
        // @ts-ignore
        id: chestsJson[rarity].key,
        level: level,
        quantity: quantity,
        variant: 0,
        upgrade: 0,
    };
};
export const getHerb = (
    rarity: string,
    level: number,
    quantity: number,
): Item => {
    // @ts-ignore
    // noinspection JSUnresolvedReference
    const herbList = resourcesJson[rarity].herb;
    return {
        // @ts-ignore
        id: herbList[rand(0, herbList.length - 1)],
        level: level,
        quantity: quantity,
        variant: 0,
        upgrade: 0,
    };
};
export const getOre = (
    rarity: string,
    level: number,
    quantity: number,
): Item => {
    // noinspection JSUnresolvedReference
    return {
        // @ts-ignore
        id: resourcesJson[rarity].ore,
        level: level,
        quantity: quantity,
        variant: 0,
        upgrade: 0,
    };
};
export const getWood = (
    rarity: string,
    level: number,
    quantity: number,
): Item => {
    // noinspection JSUnresolvedReference
    return {
        // @ts-ignore
        id: resourcesJson[rarity].wood,
        level: level,
        quantity: quantity,
        variant: 0,
        upgrade: 0,
    };
};
export const getFur = (
    rarity: string,
    level: number,
    quantity: number,
): Item => {
    // noinspection JSUnresolvedReference
    return {
        // @ts-ignore
        id: resourcesJson[rarity].fur,
        level: level,
        quantity: quantity,
        variant: 0,
        upgrade: 0,
    };
};
export const getCloth = (
    rarity: string,
    level: number,
    quantity: number,
): Item => {
    // noinspection JSUnresolvedReference
    return {
        // @ts-ignore
        id: resourcesJson[rarity].cloth,
        level: level,
        quantity: quantity,
        variant: 0,
        upgrade: 0,
    };
};

const rand = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
