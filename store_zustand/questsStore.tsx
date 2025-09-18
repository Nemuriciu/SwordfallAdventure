import {create} from 'zustand';
import {Quest} from '../types/quest.ts';

export interface QuestsState {
    questsList: Quest[];
    refreshTimestamp: string;
    questsSet: (questsList: Quest[], refreshTimestamp: string) => void;
    questsSetList: (questsList: Quest[]) => void;
    questsSetTimestamp: (refreshTimestamp: string) => void;
}

export const questsStore = create<QuestsState>()(set => ({
    questsList: [],
    refreshTimestamp: '',

    questsSet: (questsList: Quest[], refreshTimestamp: string) =>
        set(() => ({
            questsList: questsList,
            refreshTimestamp: refreshTimestamp,
        })),
    questsSetList: (questsList: Quest[]) =>
        set(() => ({questsList: questsList})),
    questsSetTimestamp: (refreshTimestamp: string) =>
        set(() => ({refreshTimestamp: refreshTimestamp})),
}));
