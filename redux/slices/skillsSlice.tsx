import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {compareSkills, Skill} from '../../types/skill.ts';

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
        skillsUpdateSkill: (state, action: PayloadAction<[string, Skill]>) => {
            state.list[action.payload[0]] = action.payload[1];
            /* Remove active spell if points set to 0 */
            if (!action.payload[1].points) {
                if (state.spell_1 && action.payload[0] === state.spell_1.id) {
                    state.spell_1 = null;
                }
                if (state.spell_2 && action.payload[0] === state.spell_2.id) {
                    state.spell_2 = null;
                }
                if (state.spell_3 && action.payload[0] === state.spell_3.id) {
                    state.spell_3 = null;
                }
            }
        },
        skillsSpellSet: (
            state,
            action: PayloadAction<[number, Skill | null]>,
        ) => {
            if (action.payload[0] === 1) {
                state.spell_1 = action.payload[1];
                /* Clear slot if spell selected twice */
                if (action.payload[1]) {
                    if (compareSkills(state.spell_2, action.payload[1])) {
                        state.spell_2 = null;
                    }
                    if (compareSkills(state.spell_3, action.payload[1])) {
                        state.spell_3 = null;
                    }
                }
            } else if (action.payload[0] === 2) {
                state.spell_2 = action.payload[1];
                /* Clear slot if spell selected twice */
                if (action.payload[1]) {
                    if (compareSkills(state.spell_1, action.payload[1])) {
                        state.spell_1 = null;
                    }
                    if (compareSkills(state.spell_3, action.payload[1])) {
                        state.spell_3 = null;
                    }
                }
            } else if (action.payload[0] === 3) {
                state.spell_3 = action.payload[1];
                /* Clear slot if spell selected twice */
                if (action.payload[1]) {
                    if (compareSkills(state.spell_1, action.payload[1])) {
                        state.spell_1 = null;
                    }
                    if (compareSkills(state.spell_2, action.payload[1])) {
                        state.spell_2 = null;
                    }
                }
            }
        },
    },
});

export const {skillsUpdate, skillsUpdateSkill, skillsSpellSet} =
    skillsSlice.actions;
