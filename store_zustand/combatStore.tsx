import {create} from 'zustand';
import {Creature} from '../types/creature.ts';
import cloneDeep from 'lodash.clonedeep';
import {emptyStats, Stats} from '../types/stats.ts';
import {Effect} from '../types/effect.ts';
import {Log} from '../types/log.ts';

export interface CombatState {
    modalVisible: boolean;
    creature: Creature | null;
    index: number;
    statsPlayer: Stats;
    statsEnemy: Stats;
    effectsPlayer: Effect[];
    effectsEnemy: Effect[];
    combatLog: Log[];
    playerTurn: boolean;

    combatShow: (
        creature: Creature,
        index: number,
        statsPlayer: Stats,
        statsEnemy: Stats,
    ) => void;
    combatHide: () => void;
    combatUpdate: (
        statsPlayer: Stats,
        statsEnemy: Stats,
        effectsPlayer: Effect[],
        effectsEnemy: Effect[],
        combatLog: Log[],
    ) => void;
    combatSetLog: (combatLog: Log[]) => void;
}

export const combatStore = create<CombatState>()(set => ({
    modalVisible: false,
    creature: null,
    index: -1,
    statsPlayer: emptyStats,
    statsEnemy: emptyStats,
    effectsPlayer: [],
    effectsEnemy: [],
    combatLog: [],
    playerTurn: true,

    combatShow: (
        creature: Creature,
        index: number,
        statsPlayer: Stats,
        statsEnemy: Stats,
    ) =>
        set(() => {
            const statsCopy = cloneDeep(statsEnemy);

            return {
                modalVisible: true,
                creature: cloneDeep(creature),
                index: index,
                statsPlayer: cloneDeep(statsPlayer),
                statsEnemy: {
                    health: statsCopy.health + statsCopy.bonusHealth,
                    physicalAtk:
                        statsCopy.physicalAtk + statsCopy.bonusPhysicalAtk,
                    magicalAtk:
                        statsCopy.magicalAtk + statsCopy.bonusMagicalAtk,
                    physicalRes:
                        statsCopy.physicalRes + statsCopy.bonusPhysicalRes,
                    magicalRes:
                        statsCopy.magicalRes + statsCopy.bonusMagicalRes,
                    critical: statsCopy.critical + statsCopy.bonusCritical,
                    dodge: statsCopy.dodge + statsCopy.bonusDodge,
                    bonusHealth: 0,
                    bonusPhysicalAtk: 0,
                    bonusPhysicalRes: 0,
                    bonusMagicalAtk: 0,
                    bonusMagicalRes: 0,
                    bonusCritical: 0,
                    bonusDodge: 0,
                },
                effectsPlayer: [],
                effectsEnemy: [],
                combatLog: [],
                playerTurn: true,
            };
        }),
    combatHide: () => set(() => ({modalVisible: false})),
    combatUpdate: (
        statsPlayer: Stats,
        statsEnemy: Stats,
        effectsPlayer: Effect[],
        effectsEnemy: Effect[],
        combatLog: Log[],
    ) =>
        set(state => {
            return {
                statsPlayer: statsPlayer,
                statsEnemy: statsEnemy,
                effectsPlayer: effectsPlayer,
                effectsEnemy: effectsEnemy,
                combatLog: combatLog,
                playerTurn: !state.playerTurn,
            };
        }),
    combatSetLog: (combatLog: Log[]) => set(() => ({combatLog: combatLog})),
}));
