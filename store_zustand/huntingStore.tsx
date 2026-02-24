import {create} from 'zustand';
import {Creature} from '../types/creature.ts';
import {Zone} from '../types/zone.ts';
import cloneDeep from 'lodash.clonedeep';

export interface HuntingState {
    zoneId: number;
    zoneName: string;
    zoneLevelMin: number;
    zoneLevelMax: number;
    zoneList: Zone[];

    huntingSelectZone: (
        zoneId: number,
        zoneName: string,
        zoneLevelMin: number,
        zoneLevelMax: number,
    ) => void;

    huntingSetZoneList: (zoneList: Zone[]) => void;
    huntingSetCreatureList: (zoneId: number, creatureList: Creature[]) => void;
    huntingSetCreatureLevel: (zoneId: number, creatureLevel: number) => void;
    huntingSetDepth: (zoneId: number, depth: number) => void;
    huntingSetKillCount: (zoneId: number, killCount: number) => void;
}

export const huntingStore = create<HuntingState>()(set => ({
    zoneId: -1,
    zoneName: '',
    zoneLevelMin: -1,
    zoneLevelMax: -1,
    zoneList: [],

    huntingSelectZone: (
        zoneId: number,
        zoneName: string,
        zoneLevelMin: number,
        zoneLevelMax: number,
    ) =>
        set({
            zoneId: zoneId,
            zoneName: zoneName,
            zoneLevelMin: zoneLevelMin,
            zoneLevelMax: zoneLevelMax,
        }),
    huntingSetZoneList: (zoneList: Zone[]) =>
        set({
            zoneList: cloneDeep(zoneList),
        }),
    huntingSetCreatureList: (zoneId: number, creatureList: Creature[]) =>
        set(state => ({
            zoneList: state.zoneList.map((zone, index) =>
                index === zoneId ? {...zone, creatureList} : zone,
            ),
        })),
    huntingSetCreatureLevel: (zoneId: number, creatureLevel: number) =>
        set(state => ({
            zoneList: state.zoneList.map((zone, index) =>
                index === zoneId ? {...zone, creatureLevel} : zone,
            ),
        })),
    huntingSetDepth: (zoneId: number, depth: number) =>
        set(state => ({
            zoneList: state.zoneList.map((zone, index) =>
                index === zoneId ? {...zone, depth} : zone,
            ),
        })),
    huntingSetKillCount: (zoneId: number, killCount: number) =>
        set(state => ({
            zoneList: state.zoneList.map((zone, index) =>
                index === zoneId ? {...zone, killCount} : zone,
            ),
        })),
}));
