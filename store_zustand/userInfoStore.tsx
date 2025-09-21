import {create} from 'zustand';

export interface UserInfoState {
    username: string;
    level: number;
    exp: number;
    stamina: number;
    staminaMax: number;
    skillPoints: number;
    shards: number;
    diamonds: number;
    staminaTimestamp: string;
    levelUpVisibility: boolean;
    networkConnection: boolean;
    setUserInfo: (
        username: string,
        level: number,
        exp: number,
        stamina: number,
        staminaMax: number,
        skillPoints: number,
        shards: number,
        diamonds: number,
        staminaTimestamp: string,
    ) => void;
    updateUsername: (username: string) => void;
    updateLevel: (level: number) => void;
    updateExp: (exp: number) => void;
    updateStamina: (stamina: number) => void;
    updateStaminaMax: (staminaMax: number) => void;
    updateStaminaTimestamp: (staminaTimestamp: string) => void;
    updateSkillPoints: (skillPoints: number) => void;
    updateShards: (shards: number) => void;
    updateDiamonds: (diamonds: number) => void;
    increaseLevel: (expTrunc: number) => void;
    setLevelUpVisibility: (visibility: boolean) => void;
    setNetworkConnection: (networkConnection: boolean) => void;
}

export const userInfoStore = create<UserInfoState>()(set => ({
    username: '',
    level: 0,
    exp: 0,
    stamina: 0,
    staminaMax: 0,
    skillPoints: 0,
    shards: 0,
    diamonds: 0,
    staminaTimestamp: '',
    levelUpVisibility: false,
    networkConnection: false,
    setUserInfo: (
        username: string,
        level: number,
        exp: number,
        stamina: number,
        staminaMax: number,
        skillPoints: number,
        shards: number,
        diamonds: number,
        staminaTimestamp: string,
    ) =>
        set(state => ({
            ...state,
            username: username,
            level: level,
            exp: exp,
            stamina: stamina,
            staminaMax: staminaMax,
            skillPoints: skillPoints,
            shards: shards,
            diamonds: diamonds,
            staminaTimestamp: staminaTimestamp,
        })),
    updateUsername: (username: string) => set(() => ({username: username})),
    updateLevel: (level: number) => set(() => ({level: level})),
    updateExp: (exp: number) => set(() => ({exp: exp})),
    updateStamina: (stamina: number) => set(() => ({stamina: stamina})),
    updateStaminaMax: (staminaMax: number) =>
        set(() => ({staminaMax: staminaMax})),
    updateStaminaTimestamp: (staminaTimestamp: string) =>
        set(() => ({staminaTimestamp: staminaTimestamp})),
    updateSkillPoints: (skillPoints: number) =>
        set(() => ({skillPoints: skillPoints})),
    updateShards: (shards: number) => set(() => ({shards: shards})),
    updateDiamonds: (diamonds: number) => set(() => ({diamonds: diamonds})),
    increaseLevel: (expTrunc: number) =>
        set(state => ({
            level: state.level + 1,
            exp: expTrunc,
            stamina: state.staminaMax,
            staminaTimestamp: new Date().toISOString(),
            // skillPoints: state.skillPoints + 1, // TODO: when you enable it
        })),
    setLevelUpVisibility: (visibility: boolean) =>
        set(() => ({
            levelUpVisibility: visibility,
        })),
    setNetworkConnection: (networkConnection: boolean) =>
        set(() => ({
            networkConnection: networkConnection,
        })),
}));
