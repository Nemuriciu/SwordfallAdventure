export interface Effect {
    id: string;
    type: EffectType;
    value: number;
    percent?: number;
    turns: number;
}

export enum EffectType {
    Bleeding = 'Bleeding',
    Poison = 'Poison',
    Burning = 'Burning',
    Healing = 'Healing',
    PhyAtkInc = 'PhyAtkInc',
    PhyAtkDec = 'PhyAtkDec',
    MagAtkInc = 'MagAtkInc',
    MagAtkDec = 'MagAtkDec',
    PhyResInc = 'PhyResInc',
    PhyResDec = 'PhyResDec',
    MagResInc = 'MagResInc',
    MagResDec = 'MagResDec',
    CritInc = 'CritInc',
    CritDec = 'CritDec',
    DodgeInc = 'DodgeInc',
    DodgeDec = 'DodgeDec',
}

export function isBuff(effect: Effect): boolean {
    return (
        effect.type === EffectType.PhyAtkInc ||
        effect.type === EffectType.MagAtkInc ||
        effect.type === EffectType.PhyResInc ||
        effect.type === EffectType.MagResInc ||
        effect.type === EffectType.CritInc ||
        effect.type === EffectType.DodgeInc
    );
}

export function isDOT(effect: Effect): boolean {
    return (
        effect.type === EffectType.Bleeding ||
        effect.type === EffectType.Poison ||
        effect.type === EffectType.Burning
    );
}
