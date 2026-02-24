import {Creature} from './creature.ts';

export interface Zone {
    creatureLevel: number;
    creatureList: Creature[];
    depth: number;
    killCount: number;
}
