import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import React from 'react';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {Crafting} from './crafting/crafting.tsx';
import {colors} from '../../utils/colors.ts';
import {Quests} from './quests/quests.tsx';
import {Shop} from './shop/shop.tsx';
import {values} from '../../utils/values.ts';

const renderScene = SceneMap({
    1: Crafting,
    2: Quests,
    3: Shop,
});

export function TownTab() {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: '1', title: 'Crafting'},
        {key: '2', title: 'Quests'},
        //{key: '3', title: 'Daily Quests'},
        {key: '3', title: 'Shop'},
    ]);

    // @ts-ignore
    const renderTabBar = props => {
        return (
            <TabBar
                {...props}
                // @ts-ignore
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
        fontFamily: values.font,
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
