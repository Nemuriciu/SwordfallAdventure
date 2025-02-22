import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface LevelUp {
    iconVisibility: boolean;
}

const initialState: LevelUp = {
    iconVisibility: false,
};

export const levelUpSlice = createSlice({
    name: 'levelUp',
    initialState,
    reducers: {
        setLevelUpVisibility: (state, action: PayloadAction<boolean>) => {
            state.iconVisibility = action.payload;
        },
    },
});

export const {setLevelUpVisibility} = levelUpSlice.actions;
