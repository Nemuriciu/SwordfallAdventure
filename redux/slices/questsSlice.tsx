import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Quest} from '../../types/quest.ts';

export interface QuestsState {
    questsList: Quest[];
    refreshTimestamp: string;
}

const initialState: QuestsState = {
    questsList: [],
    refreshTimestamp: '',
};

export const questsSlice = createSlice({
    name: 'quests',
    initialState,
    reducers: {
        questsSet: (state, action: PayloadAction<QuestsState>) => {
            state.questsList = action.payload.questsList;
            state.refreshTimestamp = action.payload.refreshTimestamp;
        },
        questsSetList: (state, action: PayloadAction<Quest[]>) => {
            state.questsList = action.payload;
        },
        questsSetTimestamp: (state, action: PayloadAction<string>) => {
            state.refreshTimestamp = action.payload;
        },
    },
});

export const {questsSet, questsSetList, questsSetTimestamp} =
    questsSlice.actions;
