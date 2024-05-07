import {StyleSheet, useWindowDimensions} from 'react-native';
import React from 'react';
import {TabView, SceneMap} from 'react-native-tab-view';
import {Missions} from './missions/missions.tsx';

const renderScene = SceneMap({
    1: Missions,
    //2: DailyQuests,
    //3: Crafting,
    //4: Shop,
});

export function TownTab() {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: '1', title: 'Missions'},
        //{key: '2', title: 'Daily Quests'},
        //{key: '3', title: 'Crafting'},
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
