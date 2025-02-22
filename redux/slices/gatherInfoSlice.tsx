import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Node} from '../../parsers/nodeParser.tsx';

export interface GatherInfo {
    level: number;
    experience: number;
    isGathering: boolean;
    nodeIndex: number;
    timestamp: string;
    nodes: Node[];
}

const initialState: GatherInfo = {
    level: 0,
    experience: 0,
    isGathering: false,
    nodeIndex: -1,
    timestamp: '',
    nodes: [],
};

export const gatherInfoSlice = createSlice({
    name: 'gatherInfo',
    initialState,
    reducers: {
        setGatherInfo: (state, action: PayloadAction<GatherInfo>) => {
            state.level = action.payload.level;
            state.experience = action.payload.experience;
            state.isGathering = action.payload.isGathering;
            state.nodeIndex = action.payload.nodeIndex;
            state.timestamp = action.payload.timestamp;
            state.nodes = action.payload.nodes;
        },
        updateGatherExp: (state, action: PayloadAction<number>) => {
            state.experience = action.payload;
        },
        increaseGatherLevel: (state, action: PayloadAction<number>) => {
            state.level += 1;
            state.experience = action.payload;
        },
    },
});

export const {setGatherInfo, updateGatherExp, increaseGatherLevel} =
    gatherInfoSlice.actions;
