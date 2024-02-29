import React from 'react';
import {useWindowDimensions} from 'react-native';
import {SceneMap, TabView} from 'react-native-tab-view';
import {Hunting} from './hunting/hunting';
import {Exploring} from './exploring/exploring';
import {Gathering} from './gathering/gathering';

const renderScene = SceneMap({
    1: Hunting,
    2: Exploring,
    3: Gathering,
});

export function AdventureTab() {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: '1', title: 'Hunting'},
        {key: '2', title: 'Exploring'},
        {key: '3', title: 'Gathering'},
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
/*
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});*/
