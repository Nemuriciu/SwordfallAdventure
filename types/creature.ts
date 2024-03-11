import {Stats} from './stats.ts';

export interface Creature {
    id: string;
    rarity: string;
    level: number;
    stats: Stats;
}
