import {create} from 'zustand';
import {Skill} from '../types/skill.ts';

export interface SkillDetailsState {
    modalVisible: boolean;
    skill: Skill | null;
    skillsDetailsShow: (skill: Skill) => void;
    skillsDetailsHide: () => void;
    skillsDetailsUpdateSkill: (skill: Skill) => void;
}

export const skillDetailsStore = create<SkillDetailsState>()(set => ({
    modalVisible: false,
    skill: null,

    skillsDetailsShow: (skill: Skill) =>
        set(() => ({
            modalVisible: true,
            skill: skill,
        })),
    skillsDetailsHide: () =>
        set(() => ({
            modalVisible: false,
        })),
    skillsDetailsUpdateSkill: (skill: Skill) =>
        set(() => ({
            skill: skill,
        })),
}));
