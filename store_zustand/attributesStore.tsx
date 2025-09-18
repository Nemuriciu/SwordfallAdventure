import {create} from 'zustand';
import {startingStats, Stats} from '../types/stats.ts';

export interface AttributesState {
    health: number;
    physicalAtk: number;
    magicalAtk: number;
    physicalRes: number;
    magicalRes: number;
    critical: number;
    dodge: number;
    bonusHealth: number;
    bonusPhysicalAtk: number;
    bonusMagicalAtk: number;
    bonusPhysicalRes: number;
    bonusMagicalRes: number;
    bonusCritical: number;
    bonusDodge: number;
    updateAttributes: (stats: Stats) => void;
}

export const attributesStore = create<AttributesState>()(set => ({
    health: startingStats.health,
    physicalAtk: startingStats.physicalAtk,
    magicalAtk: startingStats.magicalAtk,
    physicalRes: startingStats.physicalRes,
    magicalRes: startingStats.magicalRes,
    critical: startingStats.critical,
    dodge: startingStats.dodge,
    bonusHealth: startingStats.bonusHealth,
    bonusPhysicalAtk: startingStats.bonusPhysicalAtk,
    bonusMagicalAtk: startingStats.bonusMagicalAtk,
    bonusPhysicalRes: startingStats.bonusPhysicalRes,
    bonusMagicalRes: startingStats.bonusMagicalRes,
    bonusCritical: startingStats.bonusCritical,
    bonusDodge: startingStats.bonusDodge,

    updateAttributes: (stats: Stats) =>
        set(() => ({
            health: stats.health + stats.bonusHealth,
            physicalAtk: stats.physicalAtk + stats.bonusPhysicalAtk,
            magicalAtk: stats.magicalAtk + stats.bonusMagicalAtk,
            physicalRes: stats.physicalRes + stats.bonusPhysicalRes,
            magicalRes: stats.magicalRes + stats.bonusMagicalRes,
            critical: stats.critical + stats.bonusCritical,
            dodge: stats.dodge + stats.bonusDodge,
        })),
}));
