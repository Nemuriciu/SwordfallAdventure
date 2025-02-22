import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface UserInfo {
    username: string;
    level: number;
    exp: number;
    stamina: number;
    staminaMax: number;
    skillPoints: number;
    shards: number;
    diamonds: number;
    staminaTimestamp: string;
}

const initialState: UserInfo = {
    username: '',
    level: 0,
    exp: 0,
    stamina: 0,
    staminaMax: 0,
    skillPoints: 0,
    shards: 0,
    diamonds: 0,
    staminaTimestamp: '',
};

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.username = action.payload.username;
            state.level = action.payload.level;
            state.exp = action.payload.exp;
            state.stamina = action.payload.stamina;
            state.staminaMax = action.payload.staminaMax;
            state.skillPoints = action.payload.skillPoints;
            state.shards = action.payload.shards;
            state.diamonds = action.payload.diamonds;
            state.staminaTimestamp = action.payload.staminaTimestamp;
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
        updateStamina: (state, action: PayloadAction<number>) => {
            state.stamina = action.payload;
        },
        updateStaminaMax: (state, action: PayloadAction<number>) => {
            state.staminaMax = action.payload;
        },
        updateTimestampStamina: (state, action: PayloadAction<string>) => {
            state.staminaTimestamp = action.payload;
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
        increaseLevel: (state, action: PayloadAction<number>) => {
            state.level += 1;
            state.exp = action.payload;
            state.stamina = state.staminaMax;
            state.staminaTimestamp = new Date().toISOString();
            //TODO: skillpoints
            //state.skillPoints += 1;
        },
    },
});

export const {
    setUserInfo,
    updateUsername,
    updateLevel,
    updateExp,
    updateStamina,
    updateStaminaMax,
    updateTimestampStamina,
    updateSkillPoints,
    updateShards,
    updateDiamonds,
    increaseLevel,
} = userInfoSlice.actions;
