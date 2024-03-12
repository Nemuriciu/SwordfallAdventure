// noinspection DuplicatedCode

import nodesJson from '../assets/json/nodes.json';
import {Item} from '../types/item.ts';
import {getHerb, getOre, getWood, rand} from './itemParser.tsx';

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

export function getNode(level: number, type: string): Node {
    /* Roll for Rarity */
    const r = Math.random();
    let rarity: string;
    /* Purple - 0.02% */ //TODO: && level > 1
    if (r <= 0.0002) {
        rarity = 'epic';
    } else if (r <= 0.0012) {
        /* Blue - 0.1% */
        rarity = 'rare';
    } else if (r <= 0.0112) {
        /* Green - 1% */
        rarity = 'uncommon';
    } else {
        rarity = 'common';
    }

    // @ts-ignore
    const nodeID = nodesJson[type][rarity];
    const time = getRandomTime(rarity);

    return {
        id: nodeID,
        rarity: rarity,
        type: type,
        time: time,
    };
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

function getRandomTime(rarity: string): number {
    const r = Math.random();
    /* 10 - 30%
       15 - 35%
       30 - 35% */
    if (rarity === 'common') {
        if (r <= 0.3) {
            return 10;
        } else if (r <= 0.65) {
            return 15;
        } else {
            return 30;
        }
    } else {
        /* 60 - 35%
       90 - 35%
       120 - 30% */
        if (r <= 0.35) {
            return 60;
        } else if (r <= 0.7) {
            return 90;
        } else {
            return 120;
        }
    }
}

function getOreQuantity(node: Node): number {
    /* Values defined in Sheet */
    const grayMin: number = 5,
        greenMin: number = 3,
        blueMin: number = 2,
        purpleMin: number = 2;
    const grayMax: number = 7,
        greenMax: number = 5,
        blueMax: number = 3,
        purpleMax: number = 3;
    let quantity: number = 0;

    const timeMultiplier: number = getTimeMultiplier(node.time, node.rarity);

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
    const grayMin: number = 3,
        greenMin: number = 2,
        blueMin: number = 1,
        purpleMin: number = 1;
    const grayMax: number = 5,
        greenMax: number = 4,
        blueMax: number = 2,
        purpleMax: number = 2;
    let quantity: number = 0;

    const timeMultiplier: number = getTimeMultiplier(node.time, node.rarity);

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

    const timeMultiplier: number = getTimeMultiplier(node.time, node.rarity);

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

function getTimeMultiplier(time: number, rarity: string): number {
    let multiplier: number = 0;

    /* Set time multiplier */
    if (rarity === 'common') {
        switch (time) {
            case 10:
                multiplier = 1;
                break;
            case 15:
                multiplier = 1.5;
                break;
            case 30:
                multiplier = 2.75;
                break;
        }
    } else {
        switch (time) {
            case 60:
                multiplier = 1;
                break;
            case 90:
                multiplier = 1.25;
                break;
            case 120:
                multiplier = 1.5;
                break;
        }
    }

    return multiplier;
}
