import {create} from 'zustand';
import {compareSkills, Skill} from '../types/skill.ts';

export interface SkillsState {
    skillsList: {[key: string]: Skill};
    spell_1: Skill | null;
    spell_2: Skill | null;
    spell_3: Skill | null;
    skillsUpdate: (
        skills: {[key: string]: Skill},
        spell_1: Skill | null,
        spell_2: Skill | null,
        spell_3: Skill | null,
    ) => void;
    skillsUpdateSkill: (id: string, skill: Skill) => void;
    skillsSpellSet: (slot: number, skill: Skill | null) => void;
}

export const skillsStore = create<SkillsState>()(set => ({
    skillsList: {},
    spell_1: null,
    spell_2: null,
    spell_3: null,

    skillsUpdate: (
        skills: {[key: string]: Skill},
        spell_1: Skill | null,
        spell_2: Skill | null,
        spell_3: Skill | null,
    ) =>
        set(() => ({
            skillsList: skills,
            spell_1: spell_1,
            spell_2: spell_2,
            spell_3: spell_3,
        })),
    skillsUpdateSkill: (id: string, skill: Skill) =>
        set(state => {
            const skillsList = {...state.skillsList, [id]: skill};

            let {spell_1, spell_2, spell_3} = state;

            // remove active spell if points set to 0
            if (!skill.points) {
                if (spell_1 && spell_1.id === id) {
                    spell_1 = null;
                }
                if (spell_2 && spell_2.id === id) {
                    spell_2 = null;
                }
                if (spell_3 && spell_3.id === id) {
                    spell_3 = null;
                }
            }

            return {skillsList, spell_1, spell_2, spell_3};
        }),
    skillsSpellSet: (slot: number, skill: Skill | null) =>
        set(state => {
            let {spell_1, spell_2, spell_3} = state;

            if (slot === 1) {
                spell_1 = skill;
                if (skill) {
                    if (compareSkills(spell_2, skill)) {
                        spell_2 = null;
                    }
                    if (compareSkills(spell_3, skill)) {
                        spell_3 = null;
                    }
                }
            } else if (slot === 2) {
                spell_2 = skill;
                if (skill) {
                    if (compareSkills(spell_1, skill)) {
                        spell_1 = null;
                    }
                    if (compareSkills(spell_3, skill)) {
                        spell_3 = null;
                    }
                }
            } else if (slot === 3) {
                spell_3 = skill;
                if (skill) {
                    if (compareSkills(spell_1, skill)) {
                        spell_1 = null;
                    }
                    if (compareSkills(spell_2, skill)) {
                        spell_2 = null;
                    }
                }
            }

            return {spell_1, spell_2, spell_3};
        }),
}));
