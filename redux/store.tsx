import {configureStore} from '@reduxjs/toolkit';
import {equipmentSlice} from './slices/equipmentSlice.tsx';
import {inventorySlice} from './slices/inventorySlice.tsx';
import {itemDetailsSlice} from './slices/itemDetailsSlice.tsx';
import {attributesSlice} from './slices/attributesSlice.tsx';
import {userInfoSlice} from './slices/userInfoSlice.tsx';
import {gatherInfoSlice} from './slices/gatherInfoSlice.tsx';
import {rewardsModalSlice} from './slices/rewardsModalSlice.tsx';
import {huntingSlice} from './slices/huntingSlice.tsx';
import {combatSlice} from './slices/combatSlice.tsx';

export const store = configureStore({
    reducer: {
        userInfo: userInfoSlice.reducer,
        equipment: equipmentSlice.reducer,
        inventory: inventorySlice.reducer,
        attributes: attributesSlice.reducer,
        hunting: huntingSlice.reducer,
        combat: combatSlice.reducer,
        gatherInfo: gatherInfoSlice.reducer,
        itemDetails: itemDetailsSlice.reducer,
        rewardsModal: rewardsModalSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
