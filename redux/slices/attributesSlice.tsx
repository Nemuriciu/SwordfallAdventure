import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {startingStats, Stats} from '../../types/stats.ts';

export const attributesSlice = createSlice({
    name: 'attributes',
    initialState: startingStats,
    reducers: {
        updateAttributes: (state, action: PayloadAction<Stats>) => {
            state.health = action.payload.health + action.payload.bonusHealth;
            state.physicalAtk =
                action.payload.physicalAtk + action.payload.bonusPhysicalAtk;
            state.magicalAtk =
                action.payload.magicalAtk + action.payload.bonusMagicalAtk;
            state.physicalRes =
                action.payload.physicalRes + action.payload.bonusPhysicalRes;
            state.magicalRes =
                action.payload.magicalRes + action.payload.bonusMagicalRes;
            state.critical =
                action.payload.critical + action.payload.bonusCritical;
            state.dodge = action.payload.dodge + action.payload.bonusDodge;
        },
    },
});

export const {updateAttributes} = attributesSlice.actions;
