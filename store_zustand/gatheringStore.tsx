import {create} from 'zustand';
import cloneDeep from 'lodash.clonedeep';
import {Node} from '../parsers/nodeParser.tsx';

export interface GatheringState {
    level: number;
    exp: number;
    isGathering: boolean;
    nodeIndex: number;
    timestamp: string;
    nodes: Node[];

    gatheringSetAll: (
        level: number,
        exp: number,
        isGathering: boolean,
        nodeIndex: number,
        timestamp: string,
        nodes: Node[],
    ) => void;
    gatheringSetExp: (exp: number) => void;
    gatheringSetLevelUp: (expTrunc: number) => void;
}

export const gatheringStore = create<GatheringState>()(set => ({
    level: 0,
    exp: 0,
    isGathering: false,
    nodeIndex: -1,
    timestamp: '',
    nodes: [],

    gatheringSetAll: (
        level: number,
        exp: number,
        isGathering: boolean,
        nodeIndex: number,
        timestamp: string,
        nodes: Node[],
    ) =>
        set({
            level: level,
            exp: exp,
            isGathering: isGathering,
            nodeIndex: nodeIndex,
            timestamp: timestamp,
            nodes: cloneDeep(nodes),
        }),
    gatheringSetExp: (exp: number) =>
        set({
            exp: exp,
        }),

    gatheringSetLevelUp: (expTrunc: number) =>
        set(state => ({
            level: state.level + 1,
            exp: expTrunc,
        })),
}));
