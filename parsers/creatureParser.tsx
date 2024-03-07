import creaturesJson from '../assets/json/creatures.json';
import statsJson from '../assets/json/stats.json';
import {Creature} from '../types/creature.ts';
import {Stats} from './attributeParser.tsx';
import {rand} from './itemParser.tsx';
import cloneDeep from 'lodash.clonedeep';

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
    const stats: Stats = cloneDeep(statsJson.creatures[level.toString()]);

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
