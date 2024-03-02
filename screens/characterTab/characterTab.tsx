import {useWindowDimensions} from 'react-native';
import React from 'react';
import {TabView, SceneMap} from 'react-native-tab-view';
import {Character} from './character/character';
import {Inventory} from './inventory/inventory';
import {Skills} from './skills/skills';

const renderScene = SceneMap({
    1: Character,
    2: Inventory,
    3: Skills,
});

export function CharacterTab() {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: '1', title: 'Character'},
        {key: '2', title: 'Inventory'},
        {key: '3', title: 'Skills'},
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
