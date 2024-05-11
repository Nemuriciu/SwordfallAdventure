//import missionsJson from '../assets/json/missions.json';
import creatureJson from '../assets/json/creatures.json';
import {Mission} from '../types/mission.ts';
import {getChest, getKey, getRandomEquip, rand} from './itemParser.tsx';
import {getCreatureName} from './creatureParser.tsx';
import {Item} from '../types/item.ts';

export function generateMission(level: number): Mission {
    /* Select random Type */
    const r = Math.random();
    let type: string;
    /* Hunt - 55% */
    if (r <= 0.55) {
        type = 'hunt';
    } else if (r <= 0.85) {
        /* Gather 30% */
        type = 'gather';
    } else {
        /* Craft - 15% */
        type = 'craft';
    }

    /* Create Mission by type */
    let amount: number;
    switch (type) {
        case 'hunt':
            amount = rand(4, 8);
            const creatureId =
                Object.keys(creatureJson)[
                    rand(0, Object.keys(creatureJson).length - 1)
                ];

            return {
                type: type,
                rarity: 'common',
                description: `Hunt ${amount} ${getCreatureName(creatureId)}`,
                progress: 0,
                maxProgress: amount,
                shards: 250,
                exp: 58,
                rewards: getMissionRewards('common', level),
                isActive: false,
            };
        case 'craft':
        case 'gather':
            amount = Math.round(rand(30, 90) / 10) * 10;
            /* Get random resource type */
            const gatherType = ['ore', 'wood', 'herb'][rand(0, 2)];

            return {
                type: type,
                rarity: 'common',
                description: `Gather ${gatherType} for ${amount} min`,
                progress: 0,
                maxProgress: amount,
                shards: 250,
                exp: 58,
                rewards: getMissionRewards('common', level),
                isActive: false,
            };
        /*case 'craft':
            amount = rand(1, 2);*/
        default:
            throw new Error('Unexpected value: ' + type);
    }
}

export function isMissionComplete(mission: Mission): boolean {
    return mission.progress >= mission.maxProgress;
}

export function sortMissions(list: Mission[]) {
    list.sort((a, b) => {
        if (a.isActive && b.isActive) {
            if (isMissionComplete(a) && isMissionComplete(b)) {
                return 0;
            } else if (isMissionComplete(a)) {
                return -1;
            } else if (isMissionComplete(b)) {
                return 1;
            }
            return 0;
        } else if (a.isActive) {
            return -1;
        } else if (b.isActive) {
            return 1;
        }
        return 0;
    });
}

function getMissionRewards(missionRarity: string, level: number): Item[] {
    const rewards: Item[] = [];
    const r = Math.random();
    let equipmentDropped = false;
    let keyDropped = false;
    let treasureDropped = false;

    /* Check what items dropped */
    switch (missionRarity) {
        case 'common':
            /* Equipment drop */
            if (r <= 0.5) {
                equipmentDropped = true;
            }
            /* Key drop */
            if (Math.random() <= 0.25) {
                keyDropped = true;
            }
            /* Treasure drop */
            if (Math.random() <= 0.15) {
                treasureDropped = true;
            }
            break;
        case 'uncommon':
            /* Equipment drop */
            if (r <= 0.75) {
                equipmentDropped = true;
            }
            /* Key drop 100% */
            if (Math.random() <= 0.5) {
                keyDropped = true;
            }
            /* Treasure drop */
            if (Math.random() <= 0.3) {
                treasureDropped = true;
            }
            break;
        case 'rare':
        case 'epic':
            /* Equipment Drop */
            equipmentDropped = true;
            /* Key Drop */
            if (Math.random() <= 0.75) {
                keyDropped = true;
            }
            /* Treasure Drop */
            if (Math.random() <= 0.5) {
                treasureDropped = true;
            }
            break;
    }

    /* Generate Dropped item Rarity */
    let itemRarity = 'common';
    /* Equipment */
    if (equipmentDropped) {
        const randVal = Math.random();
        /* Equipment Rarity Chance */
        switch (missionRarity) {
            case 'common':
                /* uncommon - 2.5% */
                if (randVal <= 0.025 && level >= 3) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'uncommon':
                /* rare - 0.1% */
                if (randVal <= 0.001 && level >= 5) {
                    itemRarity = 'rare';
                } else if (randVal > 0.001 && randVal <= 0.151 && level >= 3) {
                    /* uncommon - 15% */
                    itemRarity = 'uncommon';
                }
                break;
            case 'rare':
                /* epic - 0.1% */
                if (randVal <= 0.001 && level >= 10) {
                    itemRarity = 'epic';
                } else if (randVal > 0.001 && randVal <= 0.051 && level >= 5) {
                    /* rare - 5% */
                    itemRarity = 'rare';
                } else if (randVal > 0.051 && randVal <= 0.301 && level >= 3) {
                    /* uncommon - 25% */
                    itemRarity = 'uncommon';
                }
                break;
            case 'epic':
                /* epic - 1% */
                if (randVal <= 0.01 && level >= 10) {
                    itemRarity = 'epic';
                } else if (randVal > 0.01 && randVal <= 0.11 && level >= 5) {
                    /* rare - 10% */
                    itemRarity = 'rare';
                } else if (randVal > 0.11 && randVal <= 0.61 && level >= 3) {
                    /* uncommon - 50% */
                    itemRarity = 'uncommon';
                }
                break;
        }

        rewards.push(getRandomEquip(itemRarity, level));
    }

    itemRarity = 'common';
    /* Treasure */
    if (treasureDropped) {
        const randVal = Math.random();
        /* Treasure Rarity Chance */
        switch (missionRarity) {
            case 'common':
                /* uncommon - 5% */
                if (randVal <= 0.05 && level >= 3) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'uncommon':
                /* rare - 1% */
                if (randVal <= 0.01 && level >= 5) {
                    itemRarity = 'rare';
                } else if (randVal > 0.01 && randVal <= 0.21 && level >= 3) {
                    /* uncommon - 20% */
                    itemRarity = 'uncommon';
                }
                break;
            case 'rare':
                /* epic - 1% */
                if (randVal <= 0.01 && level >= 10) {
                    itemRarity = 'epic';
                } else if (randVal > 0.01 && randVal <= 0.26 && level >= 5) {
                    /* rare - 25% */
                    itemRarity = 'rare';
                } else if (level >= 3) {
                    /* uncommon - 74% */
                    itemRarity = 'uncommon';
                }
                break;
            case 'epic':
                /* epic - 60% */
                if (randVal <= 0.6 && level >= 10) {
                    itemRarity = 'epic';
                } else if (level >= 5) {
                    /* rare - 40% */
                    itemRarity = 'rare';
                }
                break;
        }

        rewards.push(getChest(itemRarity, level, 1));
    }

    itemRarity = 'common';
    /* Key */
    if (keyDropped) {
        const randVal = Math.random();
        /* Key Rarity Chance */
        switch (missionRarity) {
            case 'common':
                /* uncommon - 5% */
                if (randVal <= 0.05 && level >= 3) {
                    itemRarity = 'uncommon';
                }
                break;
            case 'uncommon':
                /* rare - 1% */
                if (randVal <= 0.01 && level >= 5) {
                    itemRarity = 'rare';
                } else if (randVal > 0.01 && randVal <= 0.21 && level >= 3) {
                    /* uncommon - 20% */
                    itemRarity = 'uncommon';
                }
                break;
            case 'rare':
                /* epic - 1% */
                if (randVal <= 0.01 && level >= 10) {
                    itemRarity = 'epic';
                } else if (randVal > 0.01 && randVal <= 0.26 && level >= 5) {
                    /* rare - 25% */
                    itemRarity = 'rare';
                } else if (level >= 3) {
                    /* uncommon - 74% */
                    itemRarity = 'uncommon';
                }
                break;
            case 'epic':
                /* epic - 60% */
                if (randVal <= 0.6 && level >= 10) {
                    itemRarity = 'epic';
                } else if (level >= 5) {
                    /* rare - 40% */
                    itemRarity = 'rare';
                }
                break;
        }

        rewards.push(getKey(itemRarity, level, 1));
    }

    return rewards;
}
