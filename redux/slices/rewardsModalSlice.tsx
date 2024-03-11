import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Item} from '../../types/item.ts';

export interface RewardsModalState {
    modalVisible: boolean;
    rewards: Item[];
}

const initialState: RewardsModalState = {
    modalVisible: false,
    rewards: [],
};

export const rewardsModalSlice = createSlice({
    name: 'rewardsModal',
    initialState,
    reducers: {
        rewardsModalHide: state => {
            state.modalVisible = false;
        },
        rewardsModalInit: (state, action: PayloadAction<Item[]>) => {
            state.rewards = action.payload;
            state.modalVisible = true;
        },
    },
});

export const {rewardsModalHide, rewardsModalInit} = rewardsModalSlice.actions;
