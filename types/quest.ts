import {Item} from './item.ts';

export interface Quest {
    type: string;
    rarity: string;
    description: string;
    progress: number;
    maxProgress: number;
    isActive: boolean;
    rewards: Item[];
}
