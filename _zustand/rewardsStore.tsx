import {create} from 'zustand';
import {Item} from '../types/item.ts';

export interface RewardsState {
    modalVisible: boolean;
    title?: string;
    rewards: Item[];
    exp: number;
    gatheringExp?: number;
    shards: number;
    rewardsInit: (
        rewards: Item[],
        exp: number,
        shards: number,
        gatheringExp?: number,
        title?: string,
    ) => void;
    rewardsHide: () => void;
}

export const rewardsStore = create<RewardsState>()(set => ({
    modalVisible: false,
    rewards: [],
    exp: 0,
    shards: 0,
    rewardsInit: (
        rewards: Item[],
        exp: number,
        shards: number,
        gatheringExp?: number,
        title?: string,
    ) =>
        set({
            modalVisible: true,
            title: title,
            rewards: rewards,
            exp: exp,
            gatheringExp: gatheringExp,
            shards: shards,
        }),
    rewardsHide: () =>
        set({
            modalVisible: false,
        }),
}));
