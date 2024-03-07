import {Stats} from '../parsers/attributeParser.tsx';

export interface Creature {
    id: string;
    rarity: string;
    level: number;
    stats: Stats;
}
