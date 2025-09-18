import {create} from 'zustand';
import {Creature} from '../types/creature.ts';

export interface HuntingState {
    depth: number;
    killCount: number;
    creatureList: Creature[];
    creatureLevel: number;
    huntingUpdate: (
        depth: number,
        killCount: number,
        creatureList: Creature[],
    ) => void;
    huntingUpdateCreatureList: (creatureList: Creature[]) => void;
    huntingSetCreatureLevel: (creatureLevel: number) => void;
}

export const huntingStore = create<HuntingState>()(set => ({
    depth: 0,
    killCount: 0,
    creatureList: [],
    creatureLevel: 0,
    huntingUpdate: (
        depth: number,
        killCount: number,
        creatureList: Creature[],
    ) =>
        set({
            depth: depth,
            killCount: killCount,
            creatureList: creatureList,
        }),
    huntingUpdateCreatureList: (creatureList: Creature[]) =>
        set({
            creatureList: creatureList,
        }),
    huntingSetCreatureLevel: (creatureLevel: number) =>
        set({
            creatureLevel: creatureLevel,
        }),
}));
