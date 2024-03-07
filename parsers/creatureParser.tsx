import creaturesJson from '../assets/json/creatures.json';
//import statsJson from '../assets/json/stats.json';
import {Creature} from '../types/creature.ts';
import {Stats} from './attributeParser.tsx';
import {rand} from './itemParser.tsx';

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

    //const stats = statsJson.creatures[level - 1];
    const stats: Stats = {
        health: 1000,
        physicalAtk: 100,
        magicalAtk: 100,
        physicalRes: 100,
        magicalRes: 100,
        bonusHealth: 0,
        bonusPhysicalAtk: 0,
        bonusMagicalAtk: 0,
        bonusPhysicalRes: 0,
        bonusMagicalRes: 0,
    };

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

    /*let {health, physicalAtk, magicalAtk, physicalRes, magicalRes} = stats;

    health = rand(Math.round(health * 0.9), Math.round(health * 1.1));
    physicalAtk = rand(
        Math.round(physicalAtk * 0.9),
        Math.round(physicalAtk * 1.1),
    );
    magicalAtk = rand(
        Math.round(magicalAtk * 0.9),
        Math.round(magicalAtk * 1.1),
    );
    physicalRes = rand(
        Math.round(physicalRes * 0.8),
        Math.round(physicalRes * 1.2),
    );
    magicalRes = rand(
        Math.round(magicalRes * 0.8),
        Math.round(magicalRes * 1.2),
    );

    let bonusHealth =
        depth <= 10
            ? Math.round(health * (0.15 * depth))
            : Math.round(health * (0.15 * 10) + health * (0.2 * (depth - 10)));
    let bonusPhysicalRes =
        depth <= 10
            ? Math.round(physicalRes * (0.15 * depth))
            : Math.round(
                  physicalRes * (0.15 * 10) +
                      physicalRes * (0.2 * (depth - 10)),
              );
    let bonusMagicalRes =
        depth <= 10
            ? Math.round(magicalRes * (0.15 * depth))
            : Math.round(
                  magicalRes * (0.15 * 10) + magicalRes * (0.2 * (depth - 10)),
              );
    let bonusPhysicalAtk =
        depth <= 10
            ? Math.round(physicalAtk * (0.1 * depth))
            : Math.round(
                  physicalAtk * (0.1 * 10) +
                      physicalAtk * (0.15 * (depth - 10)),
              );
    let bonusMagicalAtk =
        depth <= 10
            ? Math.round(magicalAtk * (0.1 * depth))
            : Math.round(
                  magicalAtk * (0.1 * 10) + magicalAtk * (0.15 * (depth - 10)),
              );*/

    /*switch (rarity) {
        case 'uncommon':
            bonusHealth += Math.ceil(health * 0.25);
            bonusPhysicalAtk += Math.ceil(physicalAtk * 0.25);
            bonusMagicalAtk += Math.ceil(magicalAtk * 0.25);
            bonusPhysicalRes += Math.ceil(physicalRes * 0.25);
            bonusMagicalRes += Math.ceil(magicalRes * 0.25);
            break;
        case 'rare':
            bonusHealth += Math.ceil(health * 0.5);
            bonusPhysicalAtk += Math.ceil(physicalAtk * 0.5);
            bonusMagicalAtk += Math.ceil(magicalAtk * 0.5);
            bonusPhysicalRes += Math.ceil(physicalRes * 0.5);
            bonusMagicalRes += Math.ceil(magicalRes * 0.5);
            break;
        case 'epic':
            bonusHealth += Math.ceil(health * 0.75);
            bonusPhysicalAtk += Math.ceil(physicalAtk * 0.75);
            bonusMagicalAtk += Math.ceil(magicalAtk * 0.75);
            bonusPhysicalRes += Math.ceil(physicalRes * 0.75);
            bonusMagicalRes += Math.ceil(magicalRes * 0.75);
            break;
        default:
            break;
    }*/

    /*const creatureStats: Stats = {
        health,
        bonusHealth,
        physicalAtk,
        bonusPhysicalAtk,
        magicalAtk,
        bonusMagicalAtk,
        physicalRes,
        bonusPhysicalRes,
        magicalRes,
        bonusMagicalRes,
    );*/

    return {
        id: creatureId,
        level: level,
        rarity: rarity,
        stats: stats,
    } as Creature;
}
