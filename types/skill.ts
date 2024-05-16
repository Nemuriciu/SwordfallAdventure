export interface Skill {
    id: string;
    points: number;
}

export function compareSkills(skill1: Skill | null, skill2: Skill | null) {
    return JSON.stringify(skill1) === JSON.stringify(skill2);
}
