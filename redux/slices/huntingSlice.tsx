import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Creature} from '../../types/creature.ts';

export interface HuntingState {
    creatureList: Creature[];
}

const initialState: HuntingState = {
    creatureList: [],
};

export const huntingSlice = createSlice({
    name: 'hunting',
    initialState,
    reducers: {
        huntingUpdate: (state, action: PayloadAction<Creature[]>) => {
            state.creatureList = action.payload;
        },
    },
});

export const {huntingUpdate} = huntingSlice.actions;
