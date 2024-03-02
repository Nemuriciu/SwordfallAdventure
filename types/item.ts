export interface Item {
    id: string;
    level: number;
    quantity: number;
    variant: number;
    upgrade: number;
}

export interface Equip {
    helmet: Item | {};
    weapon: Item | {};
    chest: Item | {};
    offhand: Item | {};
    gloves: Item | {};
    pants: Item | {};
    boots: Item | {};
}

export enum Category {
    equipment = 'equipment',
    resource = 'resource',
    consumable = 'consumable',
}

export function isItem(obj: any): obj is Item {
    return (
        'id' in obj &&
        'level' in obj &&
        'quantity' in obj &&
        'variant' in obj &&
        'upgrade' in obj
    );
}
