import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Item} from '../../types/item.ts';

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
        updateEquip: (state, action: PayloadAction<EquipmentState>) => {
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
    },
});

export const {
    updateEquip,
    equipHelmet,
    equipWeapon,
    equipChest,
    equipOffhand,
    equipGloves,
    equipPants,
    equipBoots,
} = equipmentSlice.actions;
