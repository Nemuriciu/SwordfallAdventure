import craftingJson from '../assets/json/crafting.json';
import {Item} from '../types/item.ts';
import experienceJson from '../assets/json/experience.json';
import {rand} from './itemParser.tsx';

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

export function getCraftingExperience(level: number): number {
    const exp = experienceJson.craftingExp[level - 1];

    /* Variation ~5% of Exp */
    const expMin = Math.round(exp * 0.95);

    return rand(expMin, exp);
}
