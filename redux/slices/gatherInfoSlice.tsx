import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Node} from '../../parsers/nodeParser.tsx';

export interface GatherInfo {
    isGathering: boolean;
    nodeIndex: number;
    timestamp: string;
    nodes: Node[];
}

const initialState: GatherInfo = {
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
            state.isGathering = action.payload.isGathering;
            state.nodeIndex = action.payload.nodeIndex;
            state.timestamp = action.payload.timestamp;
            state.nodes = action.payload.nodes;
        },
    },
});

export const {setGatherInfo} = gatherInfoSlice.actions;
