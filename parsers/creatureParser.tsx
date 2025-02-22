import experienceJson from '../assets/json/experience.json';
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

    /* Rarity Chances */
    let rarity = 'common';
    const r = Math.random();
    let epicBaseChance = 0.0001,
        rareBaseChance = 0.001,
        uncommonBaseChance = 0.005;
    let epicBonusChance = epicBaseChance,
        rareBonusChance = rareBaseChance,
        uncommonBonusChance = uncommonBaseChance;

    /* Depth Rarity Chance Bonus */
    epicBonusChance += epicBaseChance * (1.2 * depth);
    rareBonusChance += rareBaseChance * (1.2 * depth);
    uncommonBonusChance += uncommonBaseChance * (1.2 * depth);
    // console.log('Uncommon Bonus Chance: ' + uncommonBonusChance * 100.0 + '%');
    // console.log('Rare Bonus Chance: ' + rareBonusChance * 100.0 + '%');
    // console.log('Epic Bonus Chance: ' + epicBonusChance * 100.0 + '%');
    // console.log('');

    if (r <= epicBonusChance) {
        rarity = 'epic';
    } else if (r <= epicBonusChance + rareBonusChance) {
        rarity = 'rare';
    } else if (r <= epicBonusChance + rareBonusChance + uncommonBonusChance) {
        rarity = 'uncommon';
    }

    /* Randomize stats between 80% and 120% of base value */
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

    /* Depth Bonus Stats */
    stats.bonusHealth = Math.round(
        stats.health * (statsJson.depthBonus.bonusHealth[level - 1] * depth),
    );
    stats.bonusPhysicalRes = Math.round(
        stats.physicalRes * (statsJson.depthBonus.bonusRes[level - 1] * depth),
    );
    stats.bonusMagicalRes = Math.round(
        stats.magicalRes * (statsJson.depthBonus.bonusRes[level - 1] * depth),
    );
    stats.bonusPhysicalAtk = Math.round(
        stats.physicalAtk * (statsJson.depthBonus.bonusAtk[level - 1] * depth),
    );
    stats.bonusMagicalAtk = Math.round(
        stats.magicalAtk * (statsJson.depthBonus.bonusAtk[level - 1] * depth),
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
            equipBase = 0.35;
            if (r <= equipBase) {
                equipDrop = true;
            }
            r = Math.random();

            keyBase = 0.25;
            if (r <= keyBase) {
                keyDrop = true;
            }
            r = Math.random();

            chestBase = 0.2;
            if (r <= chestBase) {
                chestDrop = true;
            }
            r = Math.random();

            clothBase = 0.5;
            if (r <= clothBase) {
                clothDrop = true;
            }
            break;
        case 'uncommon':
            equipBase = 0.95;
            if (r <= equipBase) {
                equipDrop = true;
            }
            r = Math.random();

            keyBase = 0.4;
            if (r <= keyBase) {
                keyDrop = true;
            }
            r = Math.random();

            chestBase = 0.35;
            if (r <= chestBase) {
                chestDrop = true;
            }
            r = Math.random();

            clothBase = 0.8;
            if (r <= clothBase) {
                clothDrop = true;
            }
            break;
        case 'rare':
            equipBase = 0.95;
            if (r <= equipBase) {
                equipDrop = true;
            }
            r = Math.random();

            keyBase = 0.4;
            if (r <= keyBase) {
                keyDrop = true;
            }
            r = Math.random();

            chestBase = 0.35;
            if (r <= chestBase) {
                chestDrop = true;
            }
            r = Math.random();

            clothBase = 0.8;
            if (r <= clothBase) {
                clothDrop = true;
            }
            break;
        case 'epic':
            equipBase = 0.95;
            if (r <= equipBase) {
                equipDrop = true;
            }
            r = Math.random();

            keyBase = 0.4;
            if (r <= keyBase) {
                keyDrop = true;
            }
            r = Math.random();

            chestBase = 0.35;
            if (r <= chestBase) {
                chestDrop = true;
            }
            r = Math.random();

            clothBase = 0.8;
            if (r <= clothBase) {
                clothDrop = true;
            }
            break;
    }

    let itemRarity = 'common';
    if (equipDrop) {
        let epicChance, rareChance, uncommonChance;
        r = Math.random();
        switch (rarity) {
            case 'common':
                uncommonChance = 0.01;
                if (r <= uncommonChance) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'uncommon':
                rareChance = 0.01;
                itemRarity = r <= rareChance ? 'rare' : 'uncommon';
                break;
            case 'rare':
                epicChance = 0.01;
                itemRarity = r <= epicChance ? 'epic' : 'rare';
                break;
            case 'epic':
                itemRarity = 'epic';
                break;
        }

        rewards.push(getRandomEquip(itemRarity, level));
    }

    itemRarity = 'common';
    if (keyDrop) {
        let epicChance, rareChance, uncommonChance;
        r = Math.random();
        switch (rarity) {
            case 'common':
                uncommonChance = 0.01;
                if (r <= uncommonChance) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'uncommon':
                rareChance = 0.01;
                itemRarity = r <= rareChance ? 'rare' : 'uncommon';
                break;
            case 'rare':
                epicChance = 0.01;
                itemRarity = r <= epicChance ? 'epic' : 'rare';
                break;
            case 'epic':
                itemRarity = 'epic';
                break;
        }

        rewards.push(getKey(itemRarity, level, 1));
    }

    itemRarity = 'common';
    if (chestDrop) {
        let epicChance, rareChance, uncommonChance;
        r = Math.random();
        switch (rarity) {
            case 'common':
                uncommonChance = 0.01;
                if (r <= uncommonChance) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'uncommon':
                rareChance = 0.01;
                itemRarity = r <= rareChance ? 'rare' : 'uncommon';
                break;
            case 'rare':
                epicChance = 0.01;
                itemRarity = r <= epicChance ? 'epic' : 'rare';
                break;
            case 'epic':
                itemRarity = 'epic';
                break;
        }

        rewards.push(getChest(itemRarity, level, 1));
    }

    itemRarity = 'common';
    if (clothDrop) {
        let epicChance, rareChance, uncommonChance;
        r = Math.random();
        switch (rarity) {
            case 'common':
                uncommonChance = 0.01;
                if (r <= uncommonChance) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'uncommon':
                rareChance = 0.01;
                itemRarity = r <= rareChance ? 'rare' : 'uncommon';
                break;
            case 'rare':
                epicChance = 0.01;
                itemRarity = r <= epicChance ? 'epic' : 'rare';
                break;
            case 'epic':
                itemRarity = 'epic';
                break;
        }

        rewards.push(getCloth(itemRarity, level, getClothQuantity(rarity)));
    }

    return rewards;
}

export function getCombatExperience(rarity: string, level: number): number {
    let exp = experienceJson.huntingExp[level - 1];
    // let exp = Math.round(5 * Math.pow(level, 1.7) + Math.pow(level, 3.2));

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

// function getDepthDropBonus(value: number, depth: number): number {
//     /* 5% Drop bonus (1->10)
//      * 10% Drop bonus (11->20)*/
//     return depth <= 10
//         ? value * (0.05 * depth)
//         : value * (0.05 * 10) + value * (0.1 * (depth - 10));
// }

// function getDepthRarityBonus(value: number, depth: number): number {
//     /* 5% Rarity bonus (1->10)
//      * 10% Rarity bonus (11->20)*/
//     return depth <= 10
//         ? value * (0.05 * depth)
//         : value * (0.05 * 10) + value * (0.1 * (depth - 10));
// }

function getClothQuantity(rarity: string): number {
    /* Values defined in Sheet */
    const grayMin: number = 3,
        greenMin: number = 2,
        blueMin: number = 1,
        purpleMin: number = 1;
    const grayMax: number = 4,
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
