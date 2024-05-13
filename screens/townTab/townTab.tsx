import {useWindowDimensions} from 'react-native';
import React from 'react';
import {TabView, SceneMap} from 'react-native-tab-view';
import {Missions} from './missions/missions.tsx';
import {Crafting} from './crafting/crafting.tsx';

const renderScene = SceneMap({
    1: Crafting,
    2: Missions,
    //3: DailyQuests,
    //4: Shop,
});

export function TownTab() {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: '1', title: 'Crafting'},
        {key: '2', title: 'Missions'},
        //{key: '3', title: 'Daily Quests'},
        //{key: '4', title: 'Shop'},
    ]);

    return (
        <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{width: layout.width}}
            swipeEnabled={false}
        />
    );
}
