import skillsJson from '../assets/json/skills.json';
import {Skill} from '../types/skill.ts';

export function getSkillName(id: string): string {
    // @ts-ignore
    return skillsJson[id].name;
}
export function getSkillImg(id: string): string {
    // @ts-ignore
    return skillsJson[id].img;
}
export function getSkillType(id: string): string {
    // @ts-ignore
    return skillsJson[id].type;
}
export function getSkillElement(id: string): string {
    // @ts-ignore
    return skillsJson[id].element;
}
export function getSkillMaxPoints(id: string): number {
    // @ts-ignore
    return skillsJson[id].points;
}
export function getSkillDescription(id: string): string {
    // @ts-ignore
    return skillsJson[id].description;
}
export function getSkillPrimaryEffect(id: string): number[] | undefined {
    // @ts-ignore
    return 'primaryEffect' in skillsJson[id]
        ? // @ts-ignore
          skillsJson[id].primaryEffect
        : undefined;
}
export function getSkillSecondaryEffect(id: string): number[] | undefined {
    // @ts-ignore
    return 'secondaryEffect' in skillsJson[id]
        ? // @ts-ignore
          skillsJson[id].secondaryEffect
        : undefined;
}
export function getSkillCooldown(id: string): number | undefined {
    // @ts-ignore
    return 'cooldown' in skillsJson[id]
        ? // @ts-ignore
          skillsJson[id].cooldown
        : undefined;
}
export function getSkillEffectTurns(id: string): number | undefined {
    // @ts-ignore
    return 'effectTurns' in skillsJson[id]
        ? // @ts-ignore
          skillsJson[id].effectTurns
        : undefined;
}

export function generateSkillsList(): {[key: string]: Skill} {
    const skillsList: {[key: string]: Skill} = {};

    for (const key in skillsJson) {
        skillsList[key] = {
            id: key,
            points: 0,
        };
    }

    return skillsList;
}

export function fetchSkillById(id: string, list: Skill[]): Skill | null {
    const skills = list.filter(skill => skill.id === id);
    return skills.length ? skills[0] : null;
}

export const rand = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
