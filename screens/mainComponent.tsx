/* eslint-disable react/no-unstable-nested-components */
import {Image, StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {CharacterTab} from './characterTab/characterTab';
import {AdventureTab} from './adventureTab/adventureTab';
import {TownTab} from './townTab/townTab';
import {SettingsTab} from './settingsTab/settingsTab';
import {TopStatus} from './topStatus';
import {getImage} from '../assets/images/_index';
import {RewardsModal} from '../components/rewardsModal';
import {Combat} from './adventureTab/hunting/combat';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store.tsx';
import {
    setLevelUpDisplay,
    increaseLevel,
} from '../redux/slices/userInfoSlice.tsx';
import {store} from '../redux/store.tsx';
import experienceJson from '../assets/json/experience.json';

const Tab = createBottomTabNavigator();

export function MainComponent() {
    const userInfo = useSelector((state: RootState) => state.userInfo);

    useEffect(() => {
        const maxExp = experienceJson.maxExp[userInfo.level - 1];
        if (userInfo.exp >= maxExp) {
            triggerLevelUp(userInfo.exp - maxExp);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo.exp]);

    return (
        <View style={styles.container}>
            <StatusBar />
            <TopStatus />
            <NavigationContainer>
                <RewardsModal />
                <Combat />
                <Tab.Navigator
                    screenOptions={{
                        lazy: false,
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
                            lazy: false,
                            tabBarIcon: () => {
                                return (
                                    <Image
                                        style={styles.icon}
                                        source={getImage('nav_icon_character')}
                                        resizeMode={'stretch'}
                                        fadeDuration={0}
                                    />
                                );
                            },
                        }}
                    />
                    <Tab.Screen
                        name="Adventure"
                        component={AdventureTab}
                        options={{
                            lazy: false,
                            tabBarIcon: () => {
                                return (
                                    <Image
                                        style={styles.icon}
                                        source={getImage('nav_icon_adventure')}
                                        resizeMode={'stretch'}
                                        fadeDuration={0}
                                    />
                                );
                            },
                        }}
                    />
                    <Tab.Screen
                        name="Town"
                        component={TownTab}
                        options={{
                            lazy: false,
                            tabBarIcon: () => {
                                return (
                                    <Image
                                        style={styles.icon}
                                        source={getImage('nav_icon_town')}
                                        resizeMode={'stretch'}
                                        fadeDuration={0}
                                    />
                                );
                            },
                        }}
                    />
                    <Tab.Screen
                        name="Settings"
                        component={SettingsTab}
                        options={{
                            lazy: false,
                            tabBarIcon: () => {
                                return (
                                    <Image
                                        style={styles.icon}
                                        source={getImage('nav_icon_settings')}
                                        resizeMode={'stretch'}
                                        fadeDuration={0}
                                    />
                                );
                            },
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </View>
    );
}
// TODO: Create separate level up Slice in redux
export const triggerLevelUp = (exp: number) => {
    store.dispatch(setLevelUpDisplay(true));
    store.dispatch(increaseLevel(exp));

    setTimeout(() => {
        store.dispatch(setLevelUpDisplay(false));
    }, 3000);
};

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
