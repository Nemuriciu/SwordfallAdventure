import itemsJson from '../assets/json/items.json';
import craftingJson from '../assets/json/crafting.json';
import {Item} from '../types/item.ts';

export const getCraftingResourcesList = (level: number): [Item[], Item[][]] => {
    const resourcesList: Item[] = [];
    const materialsList: Item[][] = [];

    for (const i in craftingJson.resources) {
        const materialIds = craftingJson.resources[i].materials;
        const item: Item = {
            id: craftingJson.resources[i].id,
            level: level,
            quantity: 1,
            variant: 0,
            upgrade: 0,
        };
        resourcesList.push(item);

        const materialList = [];
        for (let j = 0; j < materialIds.length; j++) {
            const material: Item = {
                id: materialIds[j],
                level: level,
                quantity: craftingJson.resources[i].materialsCount[j],
                variant: 0,
                upgrade: 0,
            };
            materialList.push(material);
        }
        materialsList.push(materialList);
    }

    return [resourcesList, materialsList];
};

export const getCraftingEquipmentList = (level: number): [Item[], Item[][]] => {
    const equipmentList: Item[] = [];
    const materialsList: Item[][] = [];

    for (const i in craftingJson.equipment) {
        const materialIds = craftingJson.equipment[i].materials;
        const item: Item = {
            id: craftingJson.equipment[i].id,
            level: level,
            quantity: 1,
            variant: 0,
            upgrade: 0,
        };
        equipmentList.push(item);

        const materialList = [];
        for (let j = 0; j < materialIds.length; j++) {
            const material: Item = {
                id: materialIds[j],
                level: level,
                quantity: craftingJson.equipment[i].materialsCount[j],
                variant: 0,
                upgrade: 0,
            };
            materialList.push(material);
        }
        materialsList.push(materialList);
    }

    return [equipmentList, materialsList];
};

export const getCraftingConsumablesList = (
    level: number,
): [Item[], Item[][]] => {
    const consumablesList: Item[] = [];
    const materialsList: Item[][] = [];

    for (const i in craftingJson.consumables) {
        const materialIds = craftingJson.consumables[i].materials;
        const item: Item = {
            id: craftingJson.consumables[i].id,
            level: level,
            quantity: 1,
            variant: 0,
            upgrade: 0,
        };
        consumablesList.push(item);

        const materialList = [];
        for (let j = 0; j < materialIds.length; j++) {
            const material: Item = {
                id: materialIds[j],
                level: level,
                quantity: 1,
                variant: 0,
                upgrade: 0,
            };
            materialList.push(material);
        }
        materialsList.push(materialList);
    }

    return [consumablesList, materialsList];
};

export const rand = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
