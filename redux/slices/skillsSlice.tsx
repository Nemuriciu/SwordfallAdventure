import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Skill} from '../../types/skill.ts';

export interface SkillsState {
    list: {[key: string]: Skill};
    spell_1: Skill | null;
    spell_2: Skill | null;
    spell_3: Skill | null;
}

const initialState: SkillsState = {
    list: {},
    spell_1: null,
    spell_2: null,
    spell_3: null,
};

export const skillsSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {
        skillsUpdate: (
            state,
            action: PayloadAction<{
                list: {[key: string]: Skill};
                spell_1: Skill | null;
                spell_2: Skill | null;
                spell_3: Skill | null;
            }>,
        ) => {
            state.list = action.payload.list;
            state.spell_1 = action.payload.spell_1;
            state.spell_2 = action.payload.spell_2;
            state.spell_3 = action.payload.spell_3;
        },
        skillsListSet: (
            state,
            action: PayloadAction<{[key: string]: Skill}>,
        ) => {
            state.list = action.payload;
        },
        skillsSpellSet: (
            state,
            action: PayloadAction<[number, Skill | null]>,
        ) => {
            if (action.payload[0] === 1) {
                state.spell_1 = action.payload[1];
            } else if (action.payload[0] === 2) {
                state.spell_2 = action.payload[1];
            } else if (action.payload[0] === 3) {
                state.spell_3 = action.payload[1];
            }
        },
    },
});

export const {skillsUpdate, skillsListSet, skillsSpellSet} =
    skillsSlice.actions;
