export interface Stats {
    health: number;
    physicalAtk: number;
    magicalAtk: number;
    physicalRes: number;
    magicalRes: number;
    critical: number;
    dodge: number;
    bonusHealth: number;
    bonusPhysicalAtk: number;
    bonusMagicalAtk: number;
    bonusPhysicalRes: number;
    bonusMagicalRes: number;
    bonusCritical: number;
    bonusDodge: number;
}

export const startingStats: Stats = {
    health: 0,
    physicalAtk: 0,
    magicalAtk: 0,
    physicalRes: 0,
    magicalRes: 0,
    critical: 0.05,
    dodge: 0.05,
    bonusHealth: 0,
    bonusPhysicalAtk: 0,
    bonusMagicalAtk: 0,
    bonusPhysicalRes: 0,
    bonusMagicalRes: 0,
    bonusCritical: 0,
    bonusDodge: 0,
};

export const emptyStats: Stats = {
    health: 0,
    physicalAtk: 0,
    magicalAtk: 0,
    physicalRes: 0,
    magicalRes: 0,
    critical: 0,
    dodge: 0,
    bonusHealth: 0,
    bonusPhysicalAtk: 0,
    bonusMagicalAtk: 0,
    bonusPhysicalRes: 0,
    bonusMagicalRes: 0,
    bonusCritical: 0,
    bonusDodge: 0,
};
