import {Item} from './item.ts';

export interface Quest {
    type: string;
    rarity: string;
    description: string;
    questItem: string;
    progress: number;
    maxProgress: number;
    isActive: boolean;
    rewards: Item[];
}
