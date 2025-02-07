import {Item} from './item.ts';

export interface Mission {
    type: string;
    rarity: string;
    description: string;
    progress: number;
    maxProgress: number;
    isActive: boolean;
    rewards: Item[];
}
