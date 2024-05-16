import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Skill} from '../../types/skill.ts';

export interface SkillsDetailsState {
    modalVisible: boolean;
    skill: Skill | null;
}

const initialState: SkillsDetailsState = {
    modalVisible: false,
    skill: null,
};

export const skillsDetailsSlice = createSlice({
    name: 'skillsDetails',
    initialState,
    reducers: {
        skillsDetailsShow: (state, action: PayloadAction<Skill>) => {
            state.modalVisible = true;
            state.skill = action.payload;
        },
        skillsDetailsHide: state => {
            state.modalVisible = false;
            state.skill = null;
        },
        skillsDetailsUpdateSkill: (state, action: PayloadAction<Skill>) => {
            state.skill = action.payload;
        },
    },
});

export const {skillsDetailsShow, skillsDetailsHide, skillsDetailsUpdateSkill} =
    skillsDetailsSlice.actions;
