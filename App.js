/* eslint-disable react/no-unstable-nested-components */
import {Image, StatusBar, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {CharacterTab} from './screens/characterTab/characterTab';
import {AdventureTab} from './screens/adventureTab/adventureTab';
import {TownTab} from './screens/townTab/townTab';
import {SettingsTab} from './screens/settingsTab/settingsTab';
import {TopStatus} from './screens/topStatus';
import {getImage} from './assets/images/_index';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import {RewardsModal} from './components/rewardsModal';

// eslint-disable-next-line no-unused-vars
const USERNAME = 'vlad.megaboy@gmail.com';
// eslint-disable-next-line no-unused-vars
const PASSWORD = '12345678';
export const USER_ID = 'c3e45822-9081-70e4-304a-423a62121bfa';

/*const UpdateExpression = "set equipment.boots=:1";
const ExpressionAttributeValues = {
    ":1": { M: {"name": { S: "bootsName" }} }
};*/
//createUser(USERNAME, PASSWORD);
//updateDb('f304b822-2091-70ef-1610-25598420f9c3', UpdateExpression, ExpressionAttributeValues)
//getDb('f304b822-2091-70ef-1610-25598420f9c3')
export const Context = React.createContext('light');
const Tab = createBottomTabNavigator();

function App() {
    return (
        <Provider store={store}>
            <View style={styles.container}>
                <StatusBar />
                <TopStatus />
                <NavigationContainer>
                    <RewardsModal />
                    <Tab.Navigator
                        screenOptions={{
                            headerShown: false,
                            tabBarStyle: {
                                height: 62,
                                backgroundColor: '#221c19',
                                borderTopWidth: 0,
                                elevation: 0,
                            },
                            tabBarLabelStyle: {
                                fontSize: 14,
                                fontFamily: 'Myriad',
                                textShadowColor: 'rgba(0, 0, 0, 1)',
                                textShadowOffset: {width: 1, height: 1},
                                textShadowRadius: 5,
                                marginBottom: 8,
                            },
                        }}>
                        <Tab.Screen
                            name="Character"
                            component={CharacterTab}
                            options={{
                                tabBarIcon: () => {
                                    return (
                                        <Image
                                            style={styles.icon}
                                            source={getImage(
                                                'nav_icon_character',
                                            )}
                                        />
                                    );
                                },
                            }}
                        />
                        <Tab.Screen
                            name="Adventure"
                            component={AdventureTab}
                            options={{
                                tabBarIcon: () => {
                                    return (
                                        <Image
                                            style={styles.icon}
                                            source={getImage(
                                                'nav_icon_adventure',
                                            )}
                                        />
                                    );
                                },
                            }}
                        />
                        <Tab.Screen
                            name="Town"
                            component={TownTab}
                            options={{
                                tabBarIcon: () => {
                                    return (
                                        <Image
                                            style={styles.icon}
                                            source={getImage('nav_icon_town')}
                                        />
                                    );
                                },
                            }}
                        />
                        <Tab.Screen
                            name="Settings"
                            component={SettingsTab}
                            options={{
                                tabBarIcon: () => {
                                    return (
                                        <Image
                                            style={styles.icon}
                                            source={getImage(
                                                'nav_icon_settings',
                                            )}
                                        />
                                    );
                                },
                            }}
                        />
                    </Tab.Navigator>
                </NavigationContainer>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navContainer: {},
    baseText: {
        textAlign: 'center',
        fontSize: 30,
    },
    bottomBar: {
        height: 60,
        width: '100%',
        resizeMode: 'contain',
    },
    icon: {
        width: 36,
        height: 36,
        marginBottom: -4,
    },
});

// noinspection JSUnusedGlobalSymbols
export default App;
