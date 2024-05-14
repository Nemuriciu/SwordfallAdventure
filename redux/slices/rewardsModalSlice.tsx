import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Item} from '../../types/item.ts';

export interface RewardsModalState {
    modalVisible: boolean;
    title?: string;
    rewards: Item[];
    experience: number;
    shards: number;
}

const initialState: RewardsModalState = {
    modalVisible: false,
    rewards: [],
    experience: 0,
    shards: 0,
};

export const rewardsModalSlice = createSlice({
    name: 'rewardsModal',
    initialState,
    reducers: {
        rewardsModalHide: state => {
            state.modalVisible = false;
        },
        rewardsModalInit: (
            state,
            action: PayloadAction<{
                title?: string;
                rewards: Item[];
                experience: number;
                shards: number;
            }>,
        ) => {
            state.modalVisible = true;
            state.title = action.payload.title;
            state.rewards = action.payload.rewards;
            state.experience = action.payload.experience;
            state.shards = action.payload.shards;
        },
    },
});

export const {rewardsModalHide, rewardsModalInit} = rewardsModalSlice.actions;
