// noinspection DuplicatedCode

import nodesJson from '../assets/json/nodes.json';
import experienceJson from '../assets/json/experience.json';
import {Item} from '../types/item.ts';
import {getHerb, getOre, getWood, rand} from './itemParser.tsx';
import shardsJson from '../assets/json/shards.json';

export interface Node {
    id: string;
    rarity: string;
    type: string;
    time: number;
}

export function getNodeName(id: string): string {
    // @ts-ignore
    return nodesJson[id].name;
}

export function getNodeImg(id: string): string {
    // @ts-ignore
    return nodesJson[id].img;
}

export function getNode(type: string, gatherLevel: number): Node {
    const r = Math.random();
    const gatherLevelMultiplier =
        gatherLevel > 1 ? 1 + getGatherLevelBonus(gatherLevel) : 1;
    let epicBase = 0.0001,
        rareBase = 0.001,
        uncommonBase = 0.005;
    let rarity = 'common';

    /* Node Rarity */
    // TODO: disable rarity by level
    if (r <= epicBase * gatherLevelMultiplier) {
        rarity = 'epic';
    } else if (
        r <=
        epicBase * gatherLevelMultiplier + rareBase * gatherLevelMultiplier
    ) {
        rarity = 'rare';
    } else if (
        r <=
        epicBase * gatherLevelMultiplier +
            rareBase * gatherLevelMultiplier +
            uncommonBase * gatherLevelMultiplier
    ) {
        rarity = 'uncommon';
    }

    // @ts-ignore
    const nodeID = nodesJson[type][rarity];
    const time = getRandomTime();

    return {
        id: nodeID,
        rarity: rarity,
        type: type,
        time: time,
    };
}

export function getGatherLevelBonus(gatherLevel: number): number {
    let bonusGatherLevel: number = 0;

    for (let i = 0; i < gatherLevel - 1; i++) {
        bonusGatherLevel += nodesJson.gatherBonus[i];
    }

    return bonusGatherLevel;
}

export function getNodeRewards(node: Node, level: number): Item[] {
    // @ts-ignore
    const rewards: Item[] = [];

    switch (node.type) {
        case 'ore': {
            rewards.push(getOre(node.rarity, level, getOreQuantity(node)));
            break;
        }
        case 'wood': {
            rewards.push(getWood(node.rarity, level, getWoodQuantity(node)));
            break;
        }
        case 'herb': {
            rewards.push(getHerb(node.rarity, level, getHerbQuantity(node)));
            break;
        }
    }

    return rewards;
}

export function getNodeExperience(node: Node, level: number): number {
    const timeMultiplier = getTimeMultiplier(node.time);
    const exp = experienceJson.userGatheringExp[level - 1] * timeMultiplier;

    /* Variation ~2% of Exp */
    const expMin = Math.round(exp * 0.98);

    return rand(expMin, exp);
}

export function getNodeGatheringExp(node: Node, level: number): number {
    const timeMultiplier = getTimeMultiplier(node.time);
    const exp = experienceJson.gatheringExp[level - 1] * timeMultiplier;

    /* Variation ~2% of Exp */
    const expMin = Math.round(exp * 0.98);

    return rand(expMin, exp);
}

export function getNodeShards(node: Node): number {
    let shards = shardsJson.gatheringShards * getTimeMultiplier(node.time);

    /* Increase Shards by Creature Rarity */
    switch (node.rarity) {
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

    /* Variation ~10% of Shards */
    const shardsMin: number = Math.round(shards * 0.9);

    return rand(shardsMin, shards);
}

export function getTimeMultiplier(time: number): number {
    let multiplier: number = 0;

    /* Set time multiplier */
    switch (time) {
        case 10:
            multiplier = 1;
            break;
        case 15:
            multiplier = 1.5;
            break;
        case 30:
            multiplier = 2.5;
            break;
        case 60:
            multiplier = 4.5;
            break;
    }

    return multiplier;
}

function getRandomTime(): number {
    const r = Math.random();
    /* 10 - 35%
       15 - 25%
       30 - 20%
       60 - 20% */
    if (r <= 0.35) {
        return 10;
    } else if (r <= 0.6) {
        return 15;
    } else if (r <= 0.8) {
        return 30;
    } else {
        return 60;
    }
}

function getOreQuantity(node: Node): number {
    /* Values defined in Sheet */
    const grayMin: number = 6,
        greenMin: number = 3,
        blueMin: number = 2,
        purpleMin: number = 2;
    const grayMax: number = 8,
        greenMax: number = 5,
        blueMax: number = 3,
        purpleMax: number = 3;
    let quantity: number = 0;

    const timeMultiplier: number = getTimeMultiplier(node.time);

    switch (node.rarity) {
        case 'common':
            quantity = Math.round(rand(grayMin, grayMax) * timeMultiplier);
            break;
        case 'uncommon':
            quantity = Math.round(rand(greenMin, greenMax) * timeMultiplier);
            break;
        case 'rare':
            quantity = Math.round(rand(blueMin, blueMax) * timeMultiplier);
            break;
        case 'epic':
            quantity = Math.round(rand(purpleMin, purpleMax) * timeMultiplier);
            break;
    }

    return quantity;
}

function getWoodQuantity(node: Node): number {
    /* Values defined in Sheet */
    const grayMin: number = 6,
        greenMin: number = 2,
        blueMin: number = 1,
        purpleMin: number = 1;
    const grayMax: number = 8,
        greenMax: number = 4,
        blueMax: number = 2,
        purpleMax: number = 2;
    let quantity: number = 0;

    const timeMultiplier: number = getTimeMultiplier(node.time);

    switch (node.rarity) {
        case 'common':
            quantity = Math.round(rand(grayMin, grayMax) * timeMultiplier);
            break;
        case 'uncommon':
            quantity = Math.round(rand(greenMin, greenMax) * timeMultiplier);
            break;
        case 'rare':
            quantity = Math.round(rand(blueMin, blueMax) * timeMultiplier);
            break;
        case 'epic':
            quantity = Math.round(rand(purpleMin, purpleMax) * timeMultiplier);
            break;
    }

    return quantity;
}

function getHerbQuantity(node: Node): number {
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

    const timeMultiplier: number = getTimeMultiplier(node.time);

    switch (node.rarity) {
        case 'common':
            quantity = Math.round(rand(grayMin, grayMax) * timeMultiplier);
            break;
        case 'uncommon':
            quantity = Math.round(rand(greenMin, greenMax) * timeMultiplier);
            break;
        case 'rare':
            quantity = Math.round(rand(blueMin, blueMax) * timeMultiplier);
            break;
        case 'epic':
            quantity = Math.round(rand(purpleMin, purpleMax) * timeMultiplier);
            break;
    }

    return quantity;
}
