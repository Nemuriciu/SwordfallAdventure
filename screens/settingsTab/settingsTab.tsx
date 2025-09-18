import {ImageBackground, StyleSheet} from 'react-native';
import React from 'react';
import {getImage} from '../../assets/images/_index';
//import {TabView, SceneMap} from 'react-native-tab-view';

/*const renderScene = SceneMap({
    1: Character,
    2: Inventory,
    3: Skills
});*/

export function SettingsTab() {
    //const layout = useWindowDimensions();

    /*const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: '1', title: 'Character' },
        { key: '2', title: 'Inventory' },
        { key: '3', title: 'Skills' },
    ]);*/

    return (
        /*<TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            swipeEnabled={false}
        />*/
        <ImageBackground
            style={styles.container}
            source={getImage('background_outer')}
            resizeMode={'stretch'}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
