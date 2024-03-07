import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {isItem, Item} from '../../types/item.ts';
import {getItemType} from '../../parsers/itemParser.tsx';

export interface EquipmentState {
    helmet: Item | {};
    weapon: Item | {};
    chest: Item | {};
    offhand: Item | {};
    gloves: Item | {};
    pants: Item | {};
    boots: Item | {};
}

const initialState: EquipmentState = {
    helmet: {},
    weapon: {},
    chest: {},
    offhand: {},
    gloves: {},
    pants: {},
    boots: {},
};

export const equipmentSlice = createSlice({
    name: 'equipment',
    initialState,
    reducers: {
        equipmentUpdate: (state, action: PayloadAction<EquipmentState>) => {
            state.helmet = action.payload.helmet;
            state.weapon = action.payload.weapon;
            state.chest = action.payload.chest;
            state.offhand = action.payload.offhand;
            state.gloves = action.payload.gloves;
            state.pants = action.payload.pants;
            state.boots = action.payload.boots;
        },
        equipHelmet: (state, action: PayloadAction<Item | {}>) => {
            state.helmet = action.payload;
        },
        equipWeapon: (state, action: PayloadAction<Item | {}>) => {
            state.weapon = action.payload;
        },
        equipChest: (state, action: PayloadAction<Item | {}>) => {
            state.chest = action.payload;
        },
        equipOffhand: (state, action: PayloadAction<Item | {}>) => {
            state.offhand = action.payload;
        },
        equipGloves: (state, action: PayloadAction<Item | {}>) => {
            state.gloves = action.payload;
        },
        equipPants: (state, action: PayloadAction<Item | {}>) => {
            state.pants = action.payload;
        },
        equipBoots: (state, action: PayloadAction<Item | {}>) => {
            state.boots = action.payload;
        },
        equippedItemUpgrade: (state, action: PayloadAction<Item>) => {
            switch (getItemType(action.payload.id)) {
                case 'weapon':
                    if (isItem(state.weapon)) {
                        state.weapon.upgrade += 1;
                    }
                    break;
                case 'helmet':
                    if (isItem(state.helmet)) {
                        state.helmet.upgrade += 1;
                    }
                    break;
                case 'chest':
                    if (isItem(state.chest)) {
                        state.chest.upgrade += 1;
                    }
                    break;
                case 'offhand':
                    if (isItem(state.offhand)) {
                        state.offhand.upgrade += 1;
                    }
                    break;
                case 'gloves':
                    if (isItem(state.gloves)) {
                        state.gloves.upgrade += 1;
                    }
                    break;
                case 'pants':
                    if (isItem(state.pants)) {
                        state.pants.upgrade += 1;
                    }
                    break;
                case 'boots':
                    if (isItem(state.boots)) {
                        state.boots.upgrade += 1;
                    }
                    break;
            }
        },
    },
});

export const {
    equipmentUpdate,
    equipHelmet,
    equipWeapon,
    equipChest,
    equipOffhand,
    equipGloves,
    equipPants,
    equipBoots,
    equippedItemUpgrade,
} = equipmentSlice.actions;
