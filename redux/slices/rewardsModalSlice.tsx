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
        setRewardsModalVisible: (state, action: PayloadAction<boolean>) => {
            state.modalVisible = action.payload;
        },
        updateRewardsList: (state, action: PayloadAction<Item[]>) => {
            state.rewards = action.payload;
        },
    },
});

export const {setRewardsModalVisible, updateRewardsList} =
    rewardsModalSlice.actions;
