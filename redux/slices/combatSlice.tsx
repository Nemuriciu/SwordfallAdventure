import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Creature} from '../../types/creature.ts';
export interface CombatState {
    modalVisible: boolean;
    creature: Creature | null;
    index: number;
}

const initialState: CombatState = {
    modalVisible: false,
    creature: null,
    index: -1,
};

export const combatSlice = createSlice({
    name: 'combat',
    initialState,
    reducers: {
        combatShow: (state, action: PayloadAction<[Creature, number]>) => {
            state.modalVisible = true;
            state.creature = action.payload[0];
            state.index = action.payload[1];
        },
        combatHide: state => {
            state.modalVisible = initialState.modalVisible;
            state.creature = initialState.creature;
            state.index = initialState.index;
        },
    },
});

export const {combatShow, combatHide} = combatSlice.actions;
