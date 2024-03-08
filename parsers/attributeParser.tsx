import cloneDeep from 'lodash.clonedeep';
import {Item} from '../types/item.ts';
import {getItemRarity, getItemType} from './itemParser.tsx';
import {Stats} from '../types/stats.ts';

export function getStats(item: Item): Stats {
    let stats: Stats = {
        health: 0,
        physicalAtk: 0,
        magicalAtk: 0,
        physicalRes: 0,
        magicalRes: 0,
        critical: 0,
        dodge: 0,
        bonusHealth: 0,
        bonusPhysicalAtk: 0,
        bonusMagicalAtk: 0,
        bonusPhysicalRes: 0,
        bonusMagicalRes: 0,
        bonusCritical: 0,
        bonusDodge: 0,
    };
    const itemCopy = cloneDeep(item);
    itemCopy.level += 1;
    const type = getItemType(item.id);

    switch (type) {
        case 'weapon':
            stats.physicalAtk = getBaseStatValue(item, 'PhysicalAtk');
            stats.magicalAtk = getBaseStatValue(item, 'MagicalAtk');
            stats.bonusPhysicalAtk = getUpgradeValue(
                item,
                stats.physicalAtk,
                getBaseStatValue(itemCopy, 'PhysicalAtk'),
            );
            stats.bonusMagicalAtk = getUpgradeValue(
                item,
                stats.magicalAtk,
                getBaseStatValue(itemCopy, 'MagicalAtk'),
            );
            break;
        case 'offhand':
        case 'gloves':
        case 'boots':
            stats.physicalAtk = getBaseStatValue(item, 'PhysicalAtk');
            stats.magicalAtk = getBaseStatValue(item, 'MagicalAtk');
            stats.physicalRes = getBaseStatValue(item, 'PhysicalRes');
            stats.magicalRes = getBaseStatValue(item, 'MagicalRes');
            stats.bonusPhysicalAtk = getUpgradeValue(
                item,
                stats.physicalAtk,
                getBaseStatValue(itemCopy, 'PhysicalAtk'),
            );
            stats.bonusMagicalAtk = getUpgradeValue(
                item,
                stats.magicalAtk,
                getBaseStatValue(itemCopy, 'MagicalAtk'),
            );
            stats.bonusPhysicalRes = getUpgradeValue(
                item,
                stats.physicalRes,
                getBaseStatValue(itemCopy, 'PhysicalRes'),
            );
            stats.bonusMagicalRes = getUpgradeValue(
                item,
                stats.magicalRes,
                getBaseStatValue(itemCopy, 'MagicalRes'),
            );
            break;
        case 'helmet':
        case 'chest':
        case 'pants':
            stats.health = getBaseStatValue(item, 'Health');
            stats.physicalRes = getBaseStatValue(item, 'PhysicalRes');
            stats.magicalRes = getBaseStatValue(item, 'MagicalRes');
            stats.bonusHealth = getUpgradeValue(
                item,
                stats.health,
                getBaseStatValue(itemCopy, 'Health'),
            );
            stats.bonusPhysicalRes = getUpgradeValue(
                item,
                stats.physicalRes,
                getBaseStatValue(itemCopy, 'PhysicalRes'),
            );
            stats.bonusMagicalRes = getUpgradeValue(
                item,
                stats.magicalRes,
                getBaseStatValue(itemCopy, 'MagicalRes'),
            );
            break;
    }

    return stats;
}

export function getResistancePercent(resVal: number, level: number): number {
    /* Values defined in Sheet */
    const resFormula: number = 240 * Math.pow(level, 19.0 / 10.0);

    return (resVal / resFormula) * 100;
}

function getBaseStatValue(item: Item, statType: string): number {
    let value = 0,
        nextValue = 0;
    let rarityBonus = 0;

    /* Get Base Stat value */
    const type = getItemType(item.id);
    const rarity = getItemRarity(item.id);
    switch (type) {
        case 'weapon':
            if (statType === 'PhysicalAtk') {
                if (item.variant === 1) {
                    value = Math.round(
                        (15 + 8 * Math.pow(item.level, 1.9)) * 1.2,
                    );
                    nextValue = Math.round(
                        (15 + 8 * Math.pow(item.level + 1, 1.9)) * 1.2,
                    );
                    rarityBonus = getRarityBonus(rarity, value, nextValue);
                    value += rarityBonus;
                } else if (item.variant === 2) {
                    value = Math.round(
                        (15 + 8 * Math.pow(item.level, 1.9)) * 0.8,
                    );
                    nextValue = Math.round(
                        (15 + 8 * Math.pow(item.level + 1, 1.9)) * 0.8,
                    );
                    rarityBonus = getRarityBonus(rarity, value, nextValue);
                    value += rarityBonus;
                }
            } else if (statType === 'MagicalAtk') {
                if (item.variant === 1) {
                    value = Math.round(
                        (15 + 8 * Math.pow(item.level, 1.9)) * 0.8,
                    );
                    nextValue = Math.round(
                        (15 + 8 * Math.pow(item.level + 1, 1.9)) * 0.8,
                    );
                    rarityBonus = getRarityBonus(rarity, value, nextValue);
                    value += rarityBonus;
                } else if (item.variant === 2) {
                    value = Math.round(
                        (15 + 8 * Math.pow(item.level, 1.9)) * 1.2,
                    );
                    nextValue = Math.round(
                        (15 + 8 * Math.pow(item.level + 1, 1.9)) * 1.2,
                    );
                    rarityBonus = getRarityBonus(rarity, value, nextValue);
                    value += rarityBonus;
                }
            }
            break;
        case 'offhand':
            switch (statType) {
                case 'PhysicalAtk':
                    if (item.variant === 1 || item.variant === 3) {
                        value = Math.round(5 + 2.5 * Math.pow(item.level, 1.9));
                        nextValue = Math.round(
                            5 + 2.5 * Math.pow(item.level + 1, 1.9),
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    }
                    break;
                case 'MagicalAtk':
                    if (item.variant === 2 || item.variant === 4) {
                        value = Math.round(5 + 2.5 * Math.pow(item.level, 1.9));
                        nextValue = Math.round(
                            5 + 2.5 * Math.pow(item.level + 1, 1.9),
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    }
                    break;
                case 'PhysicalRes':
                    if (item.variant === 1 || item.variant === 2) {
                        value = Math.round(5 * Math.pow(item.level, 1.9) * 1.2);
                        nextValue = Math.round(
                            5 * Math.pow(item.level + 1, 1.9) * 1.2,
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    } else if (item.variant === 3 || item.variant === 4) {
                        value = Math.round(5 * Math.pow(item.level, 1.9) * 0.8);
                        nextValue = Math.round(
                            5 * Math.pow(item.level + 1, 1.9) * 0.8,
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    }
                    break;
                case 'MagicalRes':
                    if (item.variant === 1 || item.variant === 2) {
                        value = Math.round(5 * Math.pow(item.level, 1.9) * 0.8);
                        nextValue = Math.round(
                            5 * Math.pow(item.level + 1, 1.9) * 0.8,
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    } else if (item.variant === 3 || item.variant === 4) {
                        value = Math.round(5 * Math.pow(item.level, 1.9) * 1.2);
                        nextValue = Math.round(
                            5 * Math.pow(item.level + 1, 1.9) * 1.2,
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    }
                    break;
            }
            break;
        case 'helmet':
        case 'pants':
            switch (statType) {
                case 'Health':
                    if (item.variant === 1 || item.variant === 2) {
                        value = Math.round(
                            (4 + 48 * Math.pow(item.level, 2)) * 1.2,
                        );
                        nextValue = Math.round(
                            (4 + 48 * Math.pow(item.level + 1, 2)) * 1.2,
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    } else if (item.variant === 3 || item.variant === 4) {
                        value = Math.round(
                            (4 + 48 * Math.pow(item.level, 2)) * 0.8,
                        );
                        nextValue = Math.round(
                            (4 + 48 * Math.pow(item.level + 1, 2)) * 0.8,
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    }
                    break;
                case 'PhysicalRes':
                    if (item.variant === 1) {
                        value = Math.round(9 * Math.pow(item.level, 1.9) * 0.8);
                        nextValue = Math.round(
                            9 * Math.pow(item.level + 1, 1.9) * 0.8,
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    } else if (item.variant === 3) {
                        value = Math.round(9 * Math.pow(item.level, 1.9) * 1.2);
                        nextValue = Math.round(
                            9 * Math.pow(item.level + 1, 1.9) * 1.2,
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    }
                    break;
                case 'MagicalRes':
                    if (item.variant === 2) {
                        value = Math.round(9 * Math.pow(item.level, 1.9) * 0.8);
                        nextValue = Math.round(
                            9 * Math.pow(item.level + 1, 1.9) * 0.8,
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    } else if (item.variant === 4) {
                        value = Math.round(9 * Math.pow(item.level, 1.9) * 1.2);
                        nextValue = Math.round(
                            9 * Math.pow(item.level + 1, 1.9) * 1.2,
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    }
                    break;
            }
            break;
        case 'chest':
            switch (statType) {
                case 'Health':
                    value = Math.round(31 * Math.pow(item.level, 2));
                    nextValue = Math.round(31 * Math.pow(item.level + 1, 2));
                    rarityBonus = getRarityBonus(rarity, value, nextValue);
                    value += rarityBonus;
                    break;
                case 'PhysicalRes':
                    if (item.variant === 1) {
                        value = Math.round(7 * Math.pow(item.level, 1.9) * 1.2);
                        nextValue = Math.round(
                            7 * Math.pow(item.level + 1, 1.9) * 1.2,
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    } else if (item.variant === 2) {
                        value = Math.round(7 * Math.pow(item.level, 1.9) * 0.8);
                        nextValue = Math.round(
                            7 * Math.pow(item.level + 1, 1.9) * 0.8,
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    }
                    break;
                case 'MagicalRes':
                    if (item.variant === 1) {
                        value = Math.round(7 * Math.pow(item.level, 1.9) * 0.8);
                        nextValue = Math.round(
                            7 * Math.pow(item.level + 1, 1.9) * 0.8,
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    } else if (item.variant === 2) {
                        value = Math.round(7 * Math.pow(item.level, 1.9) * 1.2);
                        nextValue = Math.round(
                            7 * Math.pow(item.level + 1, 1.9) * 1.2,
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    }
                    break;
            }
            break;
        case 'gloves':
        case 'boots':
            switch (statType) {
                case 'PhysicalAtk':
                    if (item.variant === 1 || item.variant === 2) {
                        value = Math.round(5 + 4 * Math.pow(item.level, 1.9));
                        nextValue = Math.round(
                            5 + 4 * Math.pow(item.level + 1, 1.9),
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    }
                    break;
                case 'MagicalAtk':
                    if (item.variant === 3 || item.variant === 4) {
                        value = Math.round(5 + 4 * Math.pow(item.level, 1.9));
                        nextValue = Math.round(
                            5 + 4 * Math.pow(item.level + 1, 1.9),
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    }
                    break;
                case 'PhysicalRes':
                    if (item.variant === 1 || item.variant === 3) {
                        value = Math.round(1 + 3 * Math.pow(item.level, 1.9));
                        nextValue = Math.round(
                            1 + 3 * Math.pow(item.level + 1, 1.9),
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    }
                    break;
                case 'MagicalRes':
                    if (item.variant === 2 || item.variant === 4) {
                        value = Math.round(1 + 3 * Math.pow(item.level, 1.9));
                        nextValue = Math.round(
                            1 + 3 * Math.pow(item.level + 1, 1.9),
                        );
                        rarityBonus = getRarityBonus(rarity, value, nextValue);
                        value += rarityBonus;
                    }
                    break;
            }
            break;
    }

    return value;
}

function getUpgradeValue(
    item: Item,
    statValue: number,
    statNextValue: number,
): number {
    if (item.upgrade <= 0) {
        return 0;
    }

    let upgradeValue = 0;
    /* Get Enhancement Value */
    for (let upgradeLevel = 1; upgradeLevel <= item.upgrade; upgradeLevel++) {
        switch (upgradeLevel) {
            case 1:
            case 2:
                upgradeValue += Math.round((statNextValue - statValue) * 0.1);
                break;
            case 3:
            case 4:
                upgradeValue += Math.round((statNextValue - statValue) * 0.15);
                break;
            case 5:
            case 6:
                upgradeValue += Math.round((statNextValue - statValue) * 0.24);
                break;
        }
    }

    return upgradeValue;
}

function getRarityBonus(
    rarity: string,
    baseValue: number,
    nextValue: number,
): number {
    let rarityBonus: number = 0;

    switch (rarity) {
        case 'uncommon':
            rarityBonus = Math.round((nextValue - baseValue) * 0.6);
            break;
        case 'rare':
            rarityBonus = Math.round((nextValue - baseValue) * 1.2);
            break;
        case 'epic':
            rarityBonus = Math.round((nextValue - baseValue) * 2);
            break;
    }

    return rarityBonus;
}

/*const rand = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};*/
