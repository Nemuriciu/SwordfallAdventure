import React from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {Hunting} from './hunting/hunting';
import {Gathering} from './gathering/gathering';
import {colors} from '../../utils/colors.ts';

const renderScene = SceneMap({
    1: Hunting,
    2: Gathering,
});

export function AdventureTab() {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: '1', title: 'Hunting'},
        {key: '2', title: 'Gathering'},
    ]);

    // @ts-ignore
    const renderTabBar = props => {
        return (
            <TabBar
                {...props}
                renderLabel={({focused, route}) => {
                    return (
                        <Text
                            style={[
                                styles.tabText,
                                // eslint-disable-next-line react-native/no-inline-styles
                                {color: focused ? colors.primary : 'white'},
                            ]}>
                            {route.title + ' '}
                        </Text>
                    );
                }}
                indicatorStyle={styles.indicatorStyle}
                style={styles.tabBar}
            />
        );
    };

    return (
        <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={{width: layout.width}}
            swipeEnabled={false}
        />
    );
}

const styles = StyleSheet.create({
    indicatorStyle: {
        backgroundColor: colors.primary,
        marginBottom: -1.5,
    },
    tabText: {
        paddingVertical: 0,
        alignSelf: 'stretch',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    tabBar: {
        borderWidth: 1,
        borderColor: '#666',
        backgroundColor: '#221c19',
    },
});
