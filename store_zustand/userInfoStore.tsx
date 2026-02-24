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

    userInfoSetAll: (
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
    userInfoSetUsername: (username: string) => void;
    userInfoSetLevel: (level: number) => void;
    userInfoSetExp: (exp: number) => void;
    userInfoSetStamina: (stamina: number) => void;
    userInfoSetStaminaMax: (staminaMax: number) => void;
    userInfoSetStaminaTimestamp: (staminaTimestamp: string) => void;
    userInfoSetSkillPoints: (skillPoints: number) => void;
    userInfoSetShards: (shards: number) => void;
    userInfoSetDiamonds: (diamonds: number) => void;
    userInfoSetLevelUp: (expTrunc: number) => void;
    userInfoSetLevelUpVisibility: (visibility: boolean) => void;
    userInfoSetNetworkConnection: (networkConnection: boolean) => void;
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

    userInfoSetAll: (
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
    userInfoSetUsername: (username: string) =>
        set(() => ({username: username})),
    userInfoSetLevel: (level: number) => set(() => ({level: level})),
    userInfoSetExp: (exp: number) => set(() => ({exp: exp})),
    userInfoSetStamina: (stamina: number) => set(() => ({stamina: stamina})),
    userInfoSetStaminaMax: (staminaMax: number) =>
        set(() => ({staminaMax: staminaMax})),
    userInfoSetStaminaTimestamp: (staminaTimestamp: string) =>
        set(() => ({staminaTimestamp: staminaTimestamp})),
    userInfoSetSkillPoints: (skillPoints: number) =>
        set(() => ({skillPoints: skillPoints})),
    userInfoSetShards: (shards: number) => set(() => ({shards: shards})),
    userInfoSetDiamonds: (diamonds: number) =>
        set(() => ({diamonds: diamonds})),
    userInfoSetLevelUp: (expTrunc: number) =>
        set(state => ({
            level: state.level + 1,
            exp: expTrunc,
            stamina: state.staminaMax,
            staminaTimestamp: new Date().toISOString(),
            // skillPoints: state.skillPoints + 1, // TODO: when you enable it
        })),
    userInfoSetLevelUpVisibility: (visibility: boolean) =>
        set(() => ({
            levelUpVisibility: visibility,
        })),
    userInfoSetNetworkConnection: (networkConnection: boolean) =>
        set(() => ({
            networkConnection: networkConnection,
        })),
}));
