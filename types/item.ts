export interface Item {
    id: string;
    name: string;
    category: string;
    type: string;
    rarity: string;
    img: string;
    level: number;
    quantity: number;
    variant: number;
    enhancement: number;
}

export enum Category {
    equipment,
    resource,
    consumable,
}
