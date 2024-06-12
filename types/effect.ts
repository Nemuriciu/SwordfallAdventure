export interface Effect {
    id: string;
    type: EffectType;
    value: number;
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

export function getEffectImage(type: EffectType): string {
    return 'effect_icon_' + type.toLowerCase();
}
