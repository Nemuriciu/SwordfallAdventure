import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Stats} from '../../parsers/attributeParser.tsx';

const initialState: Stats = {
    health: 0,
    physicalAtk: 0,
    magicalAtk: 0,
    physicalRes: 0,
    magicalRes: 0,
    bonusHealth: 0,
    bonusPhysicalAtk: 0,
    bonusMagicalAtk: 0,
    bonusPhysicalRes: 0,
    bonusMagicalRes: 0,
};

export const attributesSlice = createSlice({
    name: 'attributes',
    initialState,
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
        },
    },
});

export const {updateAttributes} = attributesSlice.actions;
