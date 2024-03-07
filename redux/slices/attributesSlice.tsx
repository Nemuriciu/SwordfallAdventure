import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Stats} from '../../parsers/attributeParser.tsx';

export const startingStats: Stats = {
    health: 0,
    physicalAtk: 0,
    magicalAtk: 0,
    physicalRes: 0,
    magicalRes: 0,
    critical: 0.05,
    dodge: 0.05,
    bonusHealth: 0,
    bonusPhysicalAtk: 0,
    bonusMagicalAtk: 0,
    bonusPhysicalRes: 0,
    bonusMagicalRes: 0,
    bonusCritical: 0,
    bonusDodge: 0,
};

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
