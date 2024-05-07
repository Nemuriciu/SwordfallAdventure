import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Mission} from '../../types/mission.ts';

export interface MissionsState {
    missionsList: Mission[];
    refreshTimestamp: string;
}

const initialState: MissionsState = {
    missionsList: [],
    refreshTimestamp: '',
};

export const missionsSlice = createSlice({
    name: 'missions',
    initialState,
    reducers: {
        missionsSetList: (state, action: PayloadAction<Mission[]>) => {
            state.missionsList = action.payload;
        },
    },
});

export const {missionsSetList} = missionsSlice.actions;
