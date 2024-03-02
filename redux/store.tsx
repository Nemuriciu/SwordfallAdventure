import {configureStore} from '@reduxjs/toolkit';
import {equipmentSlice} from './slices/equipmentSlice.tsx';
import {inventorySlice} from './slices/inventorySlice.tsx';
import {itemDetailsSlice} from './slices/itemDetailsSlice.tsx';

export const store = configureStore({
    reducer: {
        equipment: equipmentSlice.reducer,
        inventory: inventorySlice.reducer,
        itemDetails: itemDetailsSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
