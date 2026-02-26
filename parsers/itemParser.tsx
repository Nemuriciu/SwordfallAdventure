import itemsJson from '../assets/json/items.json';
import equipJson from '../assets/json/equipment.json';
import chestsJson from '../assets/json/chests.json';
import resourcesJson from '../assets/json/resources.json';
import shardsJson from '../assets/json/shards.json';
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
export function getItemCategoryAsValue(id: string): number {
    // @ts-ignore
    switch (itemsJson[id].category) {
        case 'resource':
            return 0;
        case 'consumable':
            return 1;
        case 'key':
            return 2;
        case 'chest':
            return 3;
        case 'equipment':
            return 4;
        default:
            // @ts-ignore
            throw new Error(`Unrecognized rarity: ${itemsJson[id].category}`);
    }
}
export function getItemType(id: string): string {
    // @ts-ignore
    return itemsJson[id].type;
}
export function getItemRarity(id: string): string {
    // @ts-ignore
    return itemsJson[id].rarity;
}
export function getItemRarityAsValue(id: string): number {
    // @ts-ignore
    switch (itemsJson[id].rarity) {
        case 'common':
            return 3;
        case 'uncommon':
            return 2;
        case 'rare':
            return 1;
        case 'epic':
            return 0;
        default:
            // @ts-ignore
            throw new Error(`Unrecognized rarity: ${itemsJson[id].rarity}`);
    }
}
export function getItemColor(rarity: string): string {
    switch (rarity) {
        case 'common':
            return colors.common;
        case 'uncommon':
            return colors.uncommon;
        case 'rare':
            return colors.rare;
        case 'epic':
            return colors.epic;
        default:
            return 'white';
    }
}
export function getItemDetailsBackgroundImg(item: Item): string {
    switch (getItemRarity(item.id)) {
        case 'common':
            return 'item_background_common';
        case 'uncommon':
            return 'item_background_uncommon';
        case 'rare':
            return 'item_background_rare';
        case 'epic':
            return 'item_background_epic';
        default:
            return 'item_background_default';
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

export const getSpecificEquip = (
    type: string,
    rarity: string,
    level: number,
): Item => {
    /* Choose a Random Item ID */
    // @ts-ignore
    const list = equipJson[rarity][type];
    const id = list[rand(0, list.length - 1)];

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

export function getUpgradeCost(item: Item): number {
    const rarity = getItemRarity(item.id);
    // @ts-ignore
    const equipShards = shardsJson.equipmentShards[rarity];

    return equipShards[item.upgrade + 1];
}

export function getBreakValue(item: Item): number {
    const rarity = getItemRarity(item.id);
    // @ts-ignore
    const equipShards = shardsJson.equipmentShards[rarity];
    const refundValue = shardsJson.breakRefund;
    let breakValue: number = equipShards.break;

    /* Refund each Upgrade Level */
    for (let i = 1; i <= item.upgrade; i++) {
        breakValue += Math.round(equipShards[i] * refundValue);
    }

    return breakValue;
}

function getTreasureDropCount(type: string, rarity: string): number {
    let countMin = 0,
        countMax = 0;

    switch (rarity) {
        case 'common':
            if (type === 'ore') {
                countMin = 2;
                countMax = 5;
            } else if (type === 'wood') {
                countMin = 2;
                countMax = 5;
            } else if (type === 'herb') {
                countMin = 2;
                countMax = 5;
            } else if (type === 'cloth') {
                countMin = 2;
                countMax = 5;
            }
            break;
        case 'uncommon':
            if (type === 'ore') {
                countMin = 5;
                countMax = 8;
            } else if (type === 'wood') {
                countMin = 3;
                countMax = 6;
            } else if (type === 'herb') {
                countMin = 3;
                countMax = 6;
            } else if (type === 'cloth') {
                countMin = 4;
                countMax = 8;
            }
            break;
        case 'rare':
            if (type === 'ore') {
                countMin = 3;
                countMax = 5;
            } else if (type === 'wood') {
                countMin = 2;
                countMax = 3;
            } else if (type === 'herb') {
                countMin = 2;
                countMax = 3;
            } else if (type === 'cloth') {
                countMin = 2;
                countMax = 4;
            }
            break;
        case 'epic':
            if (type === 'ore') {
                countMin = 3;
                countMax = 5;
            } else if (type === 'wood') {
                countMin = 2;
                countMax = 3;
            } else if (type === 'herb') {
                countMin = 2;
                countMax = 3;
            } else if (type === 'cloth') {
                countMin = 2;
                countMax = 4;
            }
            break;
        default:
            throw new Error('Undefined treasure drop type');
    }

    return rand(countMin, countMax);
}

export function getTreasureRewards(rarity: string, level: number): Item[] {
    /* Values defined in Sheet */
    const rewards: Item[] = [];
    const loot: string[] = ['ore', 'wood', 'herb', 'cloth'];
    const r: number = Math.random(),
        rr: number = Math.random();
    const drop_4 = 0.1,
        drop_3 = 0.3,
        drop_2 = 0.7;
    let resource: Item;
    let dropCount: number;
    let equipDrop: boolean = false;

    /* Equipment drop */
    switch (rarity) {
        case 'common':
        case 'uncommon':
            if (r <= 0.5) {
                equipDrop = true;
            }
            break;
        case 'rare':
            /* Equipment drop */
            if (r <= 0.3) {
                equipDrop = true;
            }
            break;
        case 'epic':
            /* Equipment drop */
            if (r <= 0.15) {
                equipDrop = true;
            }
            break;
    }

    /* Resource Drop Count */
    if (rr <= drop_4) {
        dropCount = 4;
    } else if (rr <= drop_3) {
        dropCount = 3;
    } else if (rr <= drop_2) {
        dropCount = 2;
    } else {
        dropCount = 1;
    }

    /* Add rewards that dropped */
    if (equipDrop) {
        rewards.push(getRandomEquip(rarity, level));
    }
    for (let i = 0; i < dropCount; i++) {
        const index: number = rand(0, loot.length - 1);
        const droppedLoot: string = loot.splice(index, 1)[0];

        if (droppedLoot === 'ore') {
            resource = getOre(
                rarity,
                level,
                getTreasureDropCount('ore', rarity),
            );
            rewards.push(resource);
        }
        if (droppedLoot === 'wood') {
            resource = getWood(
                rarity,
                level,
                getTreasureDropCount('wood', rarity),
            );
            rewards.push(resource);
        }
        if (droppedLoot === 'herb') {
            resource = getHerb(
                rarity,
                level,
                getTreasureDropCount('herb', rarity),
            );
            rewards.push(resource);
        }
        if (droppedLoot === 'cloth') {
            resource = getCloth(
                rarity,
                level,
                getTreasureDropCount('cloth', rarity),
            );
            rewards.push(resource);
        }
    }

    return rewards;
}

export function getTreasureShards(rarity: string): number {
    let shards = shardsJson.chestShards;

    /* Increase Shards by Chest Rarity */
    switch (rarity) {
        case 'uncommon':
            shards *= 2;
            break;
        case 'rare':
            shards *= 3;
            break;
        case 'epic':
            shards *= 5;
            break;
    }

    /* Variation ~10% of shards */
    const shardsMin: number = Math.round(shards * 0.9);

    return rand(shardsMin, shards);
}

export function getConvertQuantity(item: Item): number {
    const category: string = getItemCategory(item.id);
    const rarity: string = getItemRarity(item.id);

    if (category !== 'resource') {
        return Math.floor(item.quantity / 2);
    }

    switch (rarity) {
        case 'common':
        case 'uncommon':
        case 'rare':
        case 'epic':
            return Math.floor(item.quantity / 3);
        default:
            throw new Error(`Unrecognized rarity ${rarity}`);
    }
}

export function getConvertRatio(item: Item): number {
    const category: string = getItemCategory(item.id);
    const rarity: string = getItemRarity(item.id);

    if (category !== 'resource') {
        return 2;
    }

    switch (rarity) {
        case 'common':
        case 'uncommon':
        case 'rare':
        case 'epic':
            return 3;
        default:
            throw new Error(`Unrecognized rarity ${rarity}`);
    }
}

export function canConvert(item: Item, userLevel: number): boolean {
    return (
        getItemCategory(item.id) !== 'equipment' &&
        item.level < userLevel &&
        item.quantity >= getConvertRatio(item)
    );
}

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

export const getQuestItem = (id: string, level: number): Item => {
    return {
        id: id,
        level: level,
        quantity: 1,
        variant: 0,
        upgrade: 0,
    };
};

export const rand = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
