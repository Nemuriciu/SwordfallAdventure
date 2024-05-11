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
        missionsSet: (state, action: PayloadAction<MissionsState>) => {
            state.missionsList = action.payload.missionsList;
            state.refreshTimestamp = action.payload.refreshTimestamp;
        },
        missionsSetList: (state, action: PayloadAction<Mission[]>) => {
            state.missionsList = action.payload;
        },
        missionsSetTimestamp: (state, action: PayloadAction<string>) => {
            state.refreshTimestamp = action.payload;
        },
    },
});

export const {missionsSet, missionsSetList, missionsSetTimestamp} =
    missionsSlice.actions;
