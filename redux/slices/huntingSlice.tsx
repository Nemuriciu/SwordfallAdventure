import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Creature} from '../../types/creature.ts';

export interface HuntingState {
    depth: number;
    creatureList: Creature[];
}

const initialState: HuntingState = {
    depth: 0,
    creatureList: [],
};

export const huntingSlice = createSlice({
    name: 'hunting',
    initialState,
    reducers: {
        huntingUpdate: (state, action: PayloadAction<HuntingState>) => {
            state.depth = action.payload.depth;
            state.creatureList = action.payload.creatureList;
        },
        huntingSetCreatures: (state, action: PayloadAction<Creature[]>) => {
            state.creatureList = action.payload;
        },
        huntingSetDepth: (state, action: PayloadAction<number>) => {
            state.depth = action.payload;
        },
    },
});

export const {huntingUpdate, huntingSetCreatures, huntingSetDepth} =
    huntingSlice.actions;
