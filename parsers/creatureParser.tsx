import creaturesJson from '../assets/json/creatures.json';
import statsJson from '../assets/json/stats.json';
import {Creature} from '../types/creature.ts';
import {
    getChest,
    getCloth,
    getKey,
    getRandomEquip,
    rand,
} from './itemParser.tsx';
import cloneDeep from 'lodash.clonedeep';
import {Item} from '../types/item.ts';

export function getCreatureName(id: string): string {
    // @ts-ignore
    return creaturesJson[id].name;
}
export function getCreatureImg(id: string): string {
    // @ts-ignore
    return creaturesJson[id].img;
}

export function getCreature(level: number, depth: number): Creature {
    const creatures = Object.keys(creaturesJson);
    const creatureId = creatures[rand(0, creatures.length - 1)];

    // @ts-ignore
    const stats = cloneDeep(statsJson.creatures[level.toString()]);

    let rarity = 'common';
    const r = Math.random();
    let epicBase = 0.0005,
        rareBase = 0.0025,
        uncommonBase = 0.01;
    let epicChance = epicBase,
        rareChance = rareBase,
        uncommonChance = uncommonBase;

    epicChance +=
        depth <= 10
            ? epicBase * (0.1 * depth)
            : epicBase + epicBase * (0.2 * (depth - 10));
    rareChance +=
        depth <= 10
            ? rareBase * (0.1 * depth)
            : rareBase + rareBase * (0.2 * (depth - 10));
    uncommonChance +=
        depth <= 10
            ? uncommonBase * (0.1 * depth)
            : uncommonBase + uncommonBase * (0.2 * (depth - 10));

    /* Purple - 0.05% */
    if (r <= epicChance) {
        rarity = 'epic';
        /* Blue - 0.25% */
    } else if (r <= epicChance + rareChance) {
        rarity = 'rare';
        /* Green - 1% */
    } else if (r <= epicChance + rareChance + uncommonChance) {
        rarity = 'uncommon';
    }

    stats.health = rand(
        Math.round(stats.health * 0.9),
        Math.round(stats.health * 1.1),
    );
    stats.physicalAtk = rand(
        Math.round(stats.physicalAtk * 0.9),
        Math.round(stats.physicalAtk * 1.1),
    );
    stats.magicalAtk = rand(
        Math.round(stats.magicalAtk * 0.9),
        Math.round(stats.magicalAtk * 1.1),
    );
    stats.physicalRes = rand(
        Math.round(stats.physicalRes * 0.8),
        Math.round(stats.physicalRes * 1.2),
    );
    stats.magicalRes = rand(
        Math.round(stats.magicalRes * 0.8),
        Math.round(stats.magicalRes * 1.2),
    );

    stats.bonusHealth =
        depth <= 10
            ? Math.round(stats.health * (0.15 * depth))
            : Math.round(
                  stats.health * (0.15 * 10) +
                      stats.health * (0.2 * (depth - 10)),
              );
    stats.bonusPhysicalRes =
        depth <= 10
            ? Math.round(stats.physicalRes * (0.15 * depth))
            : Math.round(
                  stats.physicalRes * (0.15 * 10) +
                      stats.physicalRes * (0.2 * (depth - 10)),
              );
    stats.bonusMagicalRes =
        depth <= 10
            ? Math.round(stats.magicalRes * (0.15 * depth))
            : Math.round(
                  stats.magicalRes * (0.15 * 10) +
                      stats.magicalRes * (0.2 * (depth - 10)),
              );
    stats.bonusPhysicalAtk =
        depth <= 10
            ? Math.round(stats.physicalAtk * (0.1 * depth))
            : Math.round(
                  stats.physicalAtk * (0.1 * 10) +
                      stats.physicalAtk * (0.15 * (depth - 10)),
              );
    stats.bonusMagicalAtk =
        depth <= 10
            ? Math.round(stats.magicalAtk * (0.1 * depth))
            : Math.round(
                  stats.magicalAtk * (0.1 * 10) +
                      stats.magicalAtk * (0.15 * (depth - 10)),
              );

    switch (rarity) {
        case 'uncommon':
            stats.bonusHealth += Math.ceil(stats.health * 0.25);
            stats.bonusPhysicalAtk += Math.ceil(stats.physicalAtk * 0.25);
            stats.bonusMagicalAtk += Math.ceil(stats.magicalAtk * 0.25);
            stats.bonusPhysicalRes += Math.ceil(stats.physicalRes * 0.25);
            stats.bonusMagicalRes += Math.ceil(stats.magicalRes * 0.25);
            break;
        case 'rare':
            stats.bonusHealth += Math.ceil(stats.health * 0.5);
            stats.bonusPhysicalAtk += Math.ceil(stats.physicalAtk * 0.5);
            stats.bonusMagicalAtk += Math.ceil(stats.magicalAtk * 0.5);
            stats.bonusPhysicalRes += Math.ceil(stats.physicalRes * 0.5);
            stats.bonusMagicalRes += Math.ceil(stats.magicalRes * 0.5);
            break;
        case 'epic':
            stats.bonusHealth += Math.ceil(stats.health * 0.75);
            stats.bonusPhysicalAtk += Math.ceil(stats.physicalAtk * 0.75);
            stats.bonusMagicalAtk += Math.ceil(stats.magicalAtk * 0.75);
            stats.bonusPhysicalRes += Math.ceil(stats.physicalRes * 0.75);
            stats.bonusMagicalRes += Math.ceil(stats.magicalRes * 0.75);
            break;
        default:
            break;
    }

    return {
        id: creatureId,
        level: level,
        rarity: rarity,
        stats: stats,
    } as Creature;
}

export function getCombatRewards(
    rarity: string,
    depth: number,
    level: number,
): Item[] {
    const rewards: Item[] = [];
    let r = Math.random();
    let equipDrop = false,
        keyDrop = false,
        chestDrop = false,
        clothDrop = false;

    let equipBase, keyBase, chestBase, clothBase;

    switch (rarity) {
        case 'common':
            equipBase = 0.25;
            if (r <= equipBase + getDepthDropBonus(equipBase, depth)) {
                equipDrop = true;
            }
            r = Math.random();

            keyBase = 0.05;
            if (r <= keyBase + getDepthDropBonus(keyBase, depth)) {
                keyDrop = true;
            }
            r = Math.random();

            chestBase = 0.075;
            if (r <= chestBase + getDepthDropBonus(chestBase, depth)) {
                chestDrop = true;
            }
            r = Math.random();

            clothBase = 0.4;
            if (r <= clothBase + getDepthDropBonus(clothBase, depth)) {
                clothDrop = true;
            }
            break;
        case 'uncommon':
            equipBase = 0.35;
            if (r <= equipBase + getDepthDropBonus(equipBase, depth)) {
                equipDrop = true;
            }
            r = Math.random();

            keyBase = 0.15;
            if (r <= keyBase + getDepthDropBonus(keyBase, depth)) {
                keyDrop = true;
            }
            r = Math.random();

            chestBase = 0.2;
            if (r <= chestBase + getDepthDropBonus(chestBase, depth)) {
                chestDrop = true;
            }
            r = Math.random();

            clothBase = 0.6;
            if (r <= clothBase + getDepthDropBonus(clothBase, depth)) {
                clothDrop = true;
            }
            break;
        case 'rare':
            equipBase = 0.6;
            if (r <= equipBase + getDepthDropBonus(equipBase, depth)) {
                equipDrop = true;
            }
            r = Math.random();

            keyBase = 0.25;
            if (r <= keyBase + getDepthDropBonus(keyBase, depth)) {
                keyDrop = true;
            }
            r = Math.random();

            chestBase = 0.3;
            if (r <= chestBase + getDepthDropBonus(chestBase, depth)) {
                chestDrop = true;
            }
            r = Math.random();

            clothBase = 0.75;
            if (r <= clothBase + getDepthDropBonus(clothBase, depth)) {
                clothDrop = true;
            }
            break;
        case 'epic':
            equipDrop = true;

            keyBase = 0.35;
            if (r <= keyBase + getDepthDropBonus(keyBase, depth)) {
                keyDrop = true;
            }
            r = Math.random();

            chestBase = 0.45;
            if (r <= chestBase + getDepthDropBonus(chestBase, depth)) {
                chestDrop = true;
            }
            r = Math.random();

            clothBase = 0.85;
            if (r <= clothBase + getDepthDropBonus(clothBase, depth)) {
                clothDrop = true;
            }
            break;
    }

    let itemRarity = 'common';
    if (equipDrop) {
        let equipBasePurple, equipBaseBlue, equipBaseGreen;
        r = Math.random();
        switch (rarity) {
            case 'common':
                equipBaseGreen = 0.02;
                if (
                    r <=
                    equipBaseGreen + getDepthRarityBonus(equipBaseGreen, depth)
                ) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'uncommon':
                equipBaseBlue = 0.01;
                equipBaseGreen = 0.8;
                equipBaseBlue += getDepthRarityBonus(equipBaseBlue, depth);
                equipBaseGreen += getDepthRarityBonus(equipBaseGreen, depth);
                if (r <= equipBaseBlue) {
                    itemRarity = 'rare';
                } else if (r <= equipBaseBlue + equipBaseGreen) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'rare':
                equipBasePurple = 0.01;
                equipBaseBlue = 0.64;
                equipBasePurple += getDepthRarityBonus(equipBasePurple, depth);
                equipBaseBlue += getDepthRarityBonus(equipBaseBlue, depth);
                if (r <= equipBasePurple) {
                    itemRarity = 'epic';
                } else if (r <= equipBasePurple + equipBaseBlue) {
                    itemRarity = 'rare';
                } else {
                    itemRarity = 'uncommon';
                }
                break;
            case 'epic':
                equipBasePurple = 0.35;
                if (
                    r <=
                    equipBasePurple +
                        getDepthRarityBonus(equipBasePurple, depth)
                ) {
                    itemRarity = 'epic';
                } else {
                    itemRarity = 'rare';
                }
                break;
        }

        rewards.push(getRandomEquip(itemRarity, level));
    }

    itemRarity = 'common';
    if (keyDrop) {
        let keyBasePurple, keyBaseBlue, keyBaseGreen;
        r = Math.random();
        switch (rarity) {
            case 'common':
                /* Green - 10% */
                keyBaseGreen = 0.1;
                if (
                    r <=
                    keyBaseGreen + getDepthRarityBonus(keyBaseGreen, depth)
                ) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'uncommon':
                /* Blue - 5% */
                /* Green - 90% */
                keyBaseBlue = 0.05;
                keyBaseGreen = 0.9;
                keyBaseBlue += getDepthRarityBonus(keyBaseBlue, depth);
                keyBaseGreen += getDepthRarityBonus(keyBaseGreen, depth);
                if (r <= keyBaseBlue) {
                    itemRarity = 'rare';
                } else if (r <= keyBaseBlue + keyBaseGreen) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'rare':
                keyBasePurple = 0.025;
                keyBaseBlue = 0.9;
                keyBasePurple += getDepthRarityBonus(keyBasePurple, depth);
                keyBaseBlue += getDepthRarityBonus(keyBaseBlue, depth);
                if (r <= keyBasePurple) {
                    itemRarity = 'epic';
                } else if (r <= keyBasePurple + keyBaseBlue) {
                    itemRarity = 'rare';
                } else {
                    itemRarity = 'uncommon';
                }
                break;
            case 'epic':
                keyBasePurple = 0.7;
                if (
                    r <=
                    keyBasePurple + getDepthRarityBonus(keyBasePurple, depth)
                ) {
                    itemRarity = 'epic';
                } else {
                    itemRarity = 'rare';
                }
                break;
        }

        rewards.push(getKey(itemRarity, level, 1));
    }

    itemRarity = 'common';
    if (chestDrop) {
        let chestBasePurple, chestBaseBlue, chestBaseGreen;
        r = Math.random();
        switch (rarity) {
            case 'common':
                chestBaseGreen = 0.1;
                if (
                    r <=
                    chestBaseGreen + getDepthRarityBonus(chestBaseGreen, depth)
                ) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'uncommon':
                chestBaseBlue = 0.05;
                chestBaseGreen = 0.9;
                chestBaseBlue += getDepthRarityBonus(chestBaseBlue, depth);
                chestBaseGreen += getDepthRarityBonus(chestBaseGreen, depth);
                if (r <= chestBaseBlue) {
                    itemRarity = 'rare';
                } else if (r <= chestBaseBlue + chestBaseGreen) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'rare':
                chestBasePurple = 0.025;
                chestBaseBlue = 0.9;
                chestBasePurple += getDepthRarityBonus(chestBasePurple, depth);
                chestBaseBlue += getDepthRarityBonus(chestBaseBlue, depth);
                if (r <= chestBasePurple) {
                    itemRarity = 'epic';
                } else if (r <= chestBasePurple + chestBaseBlue) {
                    itemRarity = 'rare';
                } else {
                    itemRarity = 'uncommon';
                }
                break;
            case 'epic':
                chestBasePurple = 0.7;
                if (
                    r <=
                    chestBasePurple +
                        getDepthRarityBonus(chestBasePurple, depth)
                ) {
                    itemRarity = 'epic';
                } else {
                    itemRarity = 'rare';
                }
                break;
        }

        rewards.push(getChest(itemRarity, level, 1));
    }

    itemRarity = 'common';
    if (clothDrop) {
        let clothBasePurple, clothBaseBlue, clothBaseGreen;
        r = Math.random();
        switch (rarity) {
            case 'common':
                clothBaseGreen = 0.02;
                if (
                    r <=
                    clothBaseGreen + getDepthRarityBonus(clothBaseGreen, depth)
                ) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'uncommon':
                clothBaseBlue = 0.01;
                clothBaseGreen = 0.8;
                clothBaseBlue += getDepthRarityBonus(clothBaseBlue, depth);
                clothBaseGreen += getDepthRarityBonus(clothBaseGreen, depth);
                if (r <= clothBaseBlue) {
                    itemRarity = 'rare';
                } else if (r <= clothBaseBlue + clothBaseGreen) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'rare':
                clothBasePurple = 0.01;
                clothBaseBlue = 0.8;
                clothBasePurple += getDepthRarityBonus(clothBasePurple, depth);
                clothBaseBlue += getDepthRarityBonus(clothBaseBlue, depth);
                if (r <= clothBasePurple) {
                    itemRarity = 'epic';
                } else if (r <= clothBasePurple + clothBaseBlue) {
                    itemRarity = 'rare';
                } else {
                    itemRarity = 'uncommon';
                }
                break;
            case 'epic':
                clothBasePurple = 0.7;
                if (
                    r <=
                    clothBasePurple +
                        getDepthRarityBonus(clothBasePurple, depth)
                ) {
                    itemRarity = 'epic';
                } else {
                    itemRarity = 'rare';
                }
                break;
        }

        //TODO: Cloth or Fur depending on creature type
        rewards.push(getCloth(itemRarity, level, getClothFurQuantity(rarity)));
    }

    return rewards;
}

export function getCombatExperience(rarity: string, level: number): number {
    let exp = Math.round(5 * Math.pow(level, 1.7) + Math.pow(level, 3.2));

    /* Green +100% / Blue +150% / Purple +250% */
    switch (rarity) {
        case 'uncommon':
            exp *= 2;
            break;
        case 'rare':
            exp *= 2.5;
            break;
        case 'epic':
            exp *= 3.5;
            break;
    }

    /* Variation ~5% of exp */
    const expMin: number = Math.round(exp * 0.95);

    return rand(expMin, exp);
}

export function getCombatShards(rarity: string, level: number): number {
    /* Creature Shards Formula */
    const cLevel = level % 10 === 0 ? 9 : (level % 10) - 1;
    let shardsValue = Math.round(
        12 * Math.pow(cLevel + 1, 2) + Math.pow(3, cLevel),
    );

    /* Increase Shards by Creature Rarity */
    switch (rarity) {
        /* Green +100% Shards */
        case 'uncommon':
            shardsValue *= 2;
            break;
        /* Blue +150% Shards */
        case 'rare':
            shardsValue *= 2.5;
            break;
        /* Purple +250% Shards */
        case 'epic':
            shardsValue *= 3.5;
            break;
    }

    /* Variation ~2% of Shards */
    const shardsMin = Math.round(shardsValue * 0.98);

    return rand(shardsMin, shardsValue);
}

function getDepthDropBonus(value: number, depth: number): number {
    /* 5% Drop bonus (1->10)
     * 10% Drop bonus (11->20)*/
    return depth <= 10
        ? value * (0.05 * depth)
        : value * (0.05 * 10) + value * (0.1 * (depth - 10));
}

function getDepthRarityBonus(value: number, depth: number): number {
    /* 5% Rarity bonus (1->10)
     * 10% Rarity bonus (11->20)*/
    return depth <= 10
        ? value * (0.05 * depth)
        : value * (0.05 * 10) + value * (0.1 * (depth - 10));
}

function getClothFurQuantity(rarity: string): number {
    /* Values defined in Sheet */
    const grayMin: number = 3,
        greenMin: number = 2,
        blueMin: number = 1,
        purpleMin: number = 1;
    const grayMax: number = 5,
        greenMax: number = 4,
        blueMax: number = 2,
        purpleMax: number = 2;
    let quantity: number = 0;

    switch (rarity) {
        case 'common':
            quantity = rand(grayMin, grayMax);
            break;
        case 'uncommon':
            quantity = rand(greenMin, greenMax);
            break;
        case 'rare':
            quantity = rand(blueMin, blueMax);
            break;
        case 'epic':
            quantity = rand(purpleMin, purpleMax);
            break;
    }

    return quantity;
}
