import {create} from 'zustand';
import {isItem, Item} from '../types/item.ts';
import {getItemType} from '../parsers/itemParser.tsx';

export interface EquipmentState {
    helmet: Item | {};
    weapon: Item | {};
    chest: Item | {};
    offhand: Item | {};
    gloves: Item | {};
    pants: Item | {};
    boots: Item | {};

    equipmentUpdate: (
        helmet: Item | {},
        weapon: Item | {},
        chest: Item | {},
        offhand: Item | {},
        gloves: Item | {},
        pants: Item | {},
        boots: Item | {},
    ) => void;
    equipHelmet: (item: Item | {}) => void;
    equipWeapon: (item: Item | {}) => void;
    equipChest: (item: Item | {}) => void;
    equipOffhand: (item: Item | {}) => void;
    equipGloves: (item: Item | {}) => void;
    equipPants: (item: Item | {}) => void;
    equipBoots: (item: Item | {}) => void;
    equippedItemUpgrade: (item: Item) => void;
}

export const equipmentStore = create<EquipmentState>()(set => ({
    helmet: {},
    weapon: {},
    chest: {},
    offhand: {},
    gloves: {},
    pants: {},
    boots: {},

    equipmentUpdate: (
        helmet: Item | {},
        weapon: Item | {},
        chest: Item | {},
        offhand: Item | {},
        gloves: Item | {},
        pants: Item | {},
        boots: Item | {},
    ) =>
        set(() => ({
            helmet: helmet,
            weapon: weapon,
            chest: chest,
            offhand: offhand,
            gloves: gloves,
            pants: pants,
            boots: boots,
        })),
    equipHelmet: (item: Item | {}) => set(() => ({helmet: item})),
    equipWeapon: (item: Item | {}) => set(() => ({weapon: item})),
    equipChest: (item: Item | {}) => set(() => ({chest: item})),
    equipOffhand: (item: Item | {}) => set(() => ({offhand: item})),
    equipGloves: (item: Item | {}) => set(() => ({gloves: item})),
    equipPants: (item: Item | {}) => set(() => ({pants: item})),
    equipBoots: (item: Item | {}) => set(() => ({boots: item})),
    equippedItemUpgrade: (item: Item) =>
        set(state => {
            const itemType = getItemType(item.id);

            switch (itemType) {
                case 'weapon':
                    return isItem(state.weapon)
                        ? {
                              weapon: {
                                  ...state.weapon,
                                  upgrade: state.weapon.upgrade + 1,
                              },
                          }
                        : {};
                case 'helmet':
                    return isItem(state.helmet)
                        ? {
                              helmet: {
                                  ...state.helmet,
                                  upgrade: state.helmet.upgrade + 1,
                              },
                          }
                        : {};
                case 'chest':
                    return isItem(state.chest)
                        ? {
                              chest: {
                                  ...state.chest,
                                  upgrade: state.chest.upgrade + 1,
                              },
                          }
                        : {};
                case 'offhand':
                    return isItem(state.offhand)
                        ? {
                              offhand: {
                                  ...state.offhand,
                                  upgrade: state.offhand.upgrade + 1,
                              },
                          }
                        : {};
                case 'gloves':
                    return isItem(state.gloves)
                        ? {
                              gloves: {
                                  ...state.gloves,
                                  upgrade: state.gloves.upgrade + 1,
                              },
                          }
                        : {};
                case 'pants':
                    return isItem(state.pants)
                        ? {
                              pants: {
                                  ...state.pants,
                                  upgrade: state.pants.upgrade + 1,
                              },
                          }
                        : {};
                case 'boots':
                    return isItem(state.boots)
                        ? {
                              boots: {
                                  ...state.boots,
                                  upgrade: state.boots.upgrade + 1,
                              },
                          }
                        : {};
                default:
                    return {};
            }
        }),
}));
