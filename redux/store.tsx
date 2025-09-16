import {configureStore} from '@reduxjs/toolkit';
import {equipmentSlice} from './slices/equipmentSlice.tsx';
import {itemDetailsSlice} from './slices/itemDetailsSlice.tsx';
import {attributesSlice} from './slices/attributesSlice.tsx';
import {gatherInfoSlice} from './slices/gatherInfoSlice.tsx';
import {rewardsModalSlice} from './slices/rewardsModalSlice.tsx';
import {huntingSlice} from './slices/huntingSlice.tsx';
import {combatSlice} from './slices/combatSlice.tsx';
import {questsSlice} from './slices/questsSlice.tsx';
import {craftingDetailsSlice} from './slices/craftingDetailsSlice.tsx';
import {skillsSlice} from './slices/skillsSlice.tsx';
import {skillsDetailsSlice} from './slices/skillsDetailsSlice.tsx';
import {levelUpSlice} from './slices/levelUpSlice.tsx';

export const store = configureStore({
    reducer: {
        equipment: equipmentSlice.reducer,
        attributes: attributesSlice.reducer,
        skills: skillsSlice.reducer,
        hunting: huntingSlice.reducer,
        combat: combatSlice.reducer,
        gatherInfo: gatherInfoSlice.reducer,
        itemDetails: itemDetailsSlice.reducer,
        craftingDetails: craftingDetailsSlice.reducer,
        skillsDetails: skillsDetailsSlice.reducer,
        rewardsModal: rewardsModalSlice.reducer,
        quests: questsSlice.reducer,
        levelUp: levelUpSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
