import creatureJson from '../assets/json/creatures.json';
import experienceJson from '../assets/json/experience.json';
import questsJson from '../assets/json/quests.json';
import {Quest} from '../types/quest.ts';
import {getChest, getKey, getRandomEquip, rand} from './itemParser.tsx';
import {getCreatureName} from './creatureParser.tsx';
import {Item} from '../types/item.ts';
import shardsJson from '../assets/json/shards.json';
import {
    QUESTS_CRAFTING_AMOUNT,
    QUESTS_GATHERING_AMOUNT,
    QUESTS_HUNTING_AMOUNT,
} from '../screens/townTab/quests/quests.tsx';

export function generateQuest(type: string, level: number): Quest {
    let amount: number;
    let minAmount: number, maxAmount: number;

    switch (type) {
        case 'hunting':
            minAmount = questsJson.hunting.minAmount;
            maxAmount = questsJson.hunting.maxAmount;
            amount = rand(minAmount, maxAmount);
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
                rewards: getQuestRewards('common', level),
                isActive: false,
            };
        case 'gathering':
            minAmount = questsJson.gathering.minAmount;
            maxAmount = questsJson.gathering.maxAmount;
            amount = Math.round(rand(minAmount, maxAmount) / 10) * 10;
            /* Get random resource type */
            const gatherType = ['ore', 'wood', 'herb'][rand(0, 2)];

            return {
                type: type,
                rarity: 'common',
                description: `Gather ${gatherType} for ${amount} min`,
                progress: 0,
                maxProgress: amount,
                rewards: getQuestRewards('common', level),
                isActive: false,
            };
        case 'crafting':
            minAmount = questsJson.crafting.minAmount;
            maxAmount = questsJson.crafting.maxAmount;
            amount = rand(minAmount, maxAmount);

            return {
                type: type,
                rarity: 'common',
                description: `Craft ${amount} item(s)`,
                progress: 0,
                maxProgress: amount,
                rewards: getQuestRewards('common', level),
                isActive: false,
            };

        default:
            throw new Error('Unexpected value: ' + type);
    }
}

export function isQuestComplete(quest: Quest): boolean {
    return quest.progress >= quest.maxProgress;
}

export function sortQuests(list: Quest[]) {
    list.sort((a, b) => {
        if (a.isActive && b.isActive) {
            if (isQuestComplete(a) && isQuestComplete(b)) {
                return 0;
            } else if (isQuestComplete(a)) {
                return -1;
            } else if (isQuestComplete(b)) {
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

export function getQuestShards(quest: Quest): number {
    // @ts-ignore
    let shards: number;
    let multiplier: number;

    switch (quest.type) {
        case 'hunting':
            multiplier = quest.maxProgress / questsJson.hunting.minAmount;
            shards = Math.round(shardsJson.questShards.hunting * multiplier);
            break;
        case 'gathering':
            multiplier = quest.maxProgress / questsJson.gathering.minAmount;
            shards = Math.round(shardsJson.questShards.gathering * multiplier);
            break;
        case 'crafting':
            multiplier = quest.maxProgress / questsJson.crafting.minAmount;
            shards = Math.round(shardsJson.questShards.crafting * multiplier);
            break;
        default:
            throw new Error('Unexpected value: ' + quest.type);
    }

    return shards;
}

export function getQuestExp(quest: Quest, level: number): number {
    let exp: number;
    let multiplier: number;

    switch (quest.type) {
        case 'hunting':
            multiplier = quest.maxProgress / questsJson.hunting.minAmount;
            exp = Math.round(
                experienceJson.questExp.hunting[level - 1] * multiplier,
            );
            break;
        case 'gathering':
            multiplier = quest.maxProgress / questsJson.gathering.minAmount;
            exp = Math.round(
                experienceJson.questExp.gathering[level - 1] * multiplier,
            );
            break;
        case 'crafting':
            multiplier = quest.maxProgress / questsJson.crafting.minAmount;
            exp = Math.round(
                experienceJson.questExp.crafting[level - 1] * multiplier,
            );
            break;
        default:
            throw new Error('Unexpected value: ' + quest.type);
    }

    return exp;
}

export function initializeQuests(level: number): Quest[] {
    let questsList: Quest[] = [];

    for (let i = 0; i < QUESTS_HUNTING_AMOUNT; i++) {
        questsList.push(generateQuest('hunting', level));
    }

    for (let i = 0; i < QUESTS_GATHERING_AMOUNT; i++) {
        questsList.push(generateQuest('gathering', level));
    }

    for (let i = 0; i < QUESTS_CRAFTING_AMOUNT; i++) {
        questsList.push(generateQuest('crafting', level));
    }

    return questsList;
}

function getQuestRewards(questRarity: string, level: number): Item[] {
    const rewards: Item[] = [];
    const r = Math.random();
    let equipmentDropped = false;
    let keyDropped = false;
    let treasureDropped = false;

    /* Check what items dropped */
    switch (questRarity) {
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
        switch (questRarity) {
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
        switch (questRarity) {
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
        switch (questRarity) {
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
