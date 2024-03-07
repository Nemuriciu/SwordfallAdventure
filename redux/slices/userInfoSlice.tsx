import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface UserInfo {
    username: string;
    level: number;
    exp: number;
    expMax: number;
    stamina: number;
    staminaMax: number;
    skillPoints: number;
    shards: number;
    diamonds: number;
}

const initialState: UserInfo = {
    username: '',
    level: 0,
    exp: 0,
    expMax: 0,
    stamina: 0,
    staminaMax: 0,
    skillPoints: 0,
    shards: 0,
    diamonds: 0,
};

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.username = action.payload.username;
            state.level = action.payload.level;
            state.exp = action.payload.exp;
            state.expMax = action.payload.expMax;
            state.stamina = action.payload.stamina;
            state.staminaMax = action.payload.staminaMax;
            state.skillPoints = action.payload.skillPoints;
            state.shards = action.payload.shards;
            state.diamonds = action.payload.diamonds;
        },
        updateUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        updateLevel: (state, action: PayloadAction<number>) => {
            state.level = action.payload;
        },
        updateExp: (state, action: PayloadAction<number>) => {
            state.exp = action.payload;
        },
        updateExpMax: (state, action: PayloadAction<number>) => {
            state.expMax = action.payload;
        },
        updateStamina: (state, action: PayloadAction<number>) => {
            state.stamina = action.payload;
        },
        updateStaminaMax: (state, action: PayloadAction<number>) => {
            state.staminaMax = action.payload;
        },
        updateSkillPoints: (state, action: PayloadAction<number>) => {
            state.skillPoints = action.payload;
        },
        updateShards: (state, action: PayloadAction<number>) => {
            state.shards = action.payload;
        },
        updateDiamonds: (state, action: PayloadAction<number>) => {
            state.diamonds = action.payload;
        },
    },
});

export const {
    setUserInfo,
    updateUsername,
    updateLevel,
    updateExp,
    updateExpMax,
    updateStamina,
    updateStaminaMax,
    updateSkillPoints,
    updateShards,
    updateDiamonds,
} = userInfoSlice.actions;
