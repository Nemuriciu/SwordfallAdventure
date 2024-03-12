import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Creature} from '../../types/creature.ts';
import {emptyStats, Stats} from '../../types/stats.ts';
import cloneDeep from 'lodash.clonedeep';
import {Log} from '../../types/log.ts';

export interface CombatState {
    modalVisible: boolean;
    creature: Creature | null;
    index: number;
    statsPlayer: Stats;
    statsEnemy: Stats;
    effectsPlayer: [];
    effectsEnemy: [];
    combatLog: Log[];
    playerTurn: boolean;
}

const initialState: CombatState = {
    modalVisible: false,
    creature: null,
    index: -1,
    statsPlayer: emptyStats,
    statsEnemy: emptyStats,
    effectsPlayer: [],
    effectsEnemy: [],
    combatLog: [],
    playerTurn: true,
};

export const combatSlice = createSlice({
    name: 'combat',
    initialState,
    reducers: {
        combatShow: (
            state,
            action: PayloadAction<[Creature, number, Stats, Stats]>,
        ) => {
            state.modalVisible = true;
            state.creature = action.payload[0];
            state.index = action.payload[1];
            state.statsPlayer = cloneDeep(action.payload[2]);
            const statsCopy = cloneDeep(action.payload[3]);
            state.statsEnemy.health = statsCopy.health + statsCopy.bonusHealth;
            state.statsEnemy.physicalAtk =
                statsCopy.physicalAtk + statsCopy.bonusPhysicalAtk;
            state.statsEnemy.magicalAtk =
                statsCopy.magicalAtk + statsCopy.bonusMagicalAtk;
            state.statsEnemy.physicalRes =
                statsCopy.physicalRes + statsCopy.bonusPhysicalRes;
            state.statsEnemy.magicalRes =
                statsCopy.magicalRes + statsCopy.bonusMagicalRes;
            state.statsEnemy.critical =
                statsCopy.critical + statsCopy.bonusCritical;
            state.statsEnemy.dodge = statsCopy.dodge + statsCopy.bonusDodge;
            state.effectsPlayer = [];
            state.effectsEnemy = [];
            state.combatLog = [];
            state.playerTurn = true;
        },
        combatHide: state => {
            state.modalVisible = initialState.modalVisible;
        },
        combatUpdate: (
            state,
            action: PayloadAction<[Stats, Stats, [], [], Log[]]>,
        ) => {
            state.statsPlayer = action.payload[0];
            state.statsEnemy = action.payload[1];
            state.effectsPlayer = action.payload[2];
            state.effectsEnemy = action.payload[3];
            state.combatLog = action.payload[4];
            state.playerTurn = !state.playerTurn;
        },
        combatSetLog: (state, action: PayloadAction<Log[]>) => {
            state.combatLog = action.payload;
        },
    },
});

export const {combatShow, combatHide, combatUpdate, combatSetLog} =
    combatSlice.actions;
