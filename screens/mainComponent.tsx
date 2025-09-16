/* eslint-disable react/no-unstable-nested-components */
import {
    Image,
    ImageBackground,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
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
import {store} from '../redux/store.tsx';
import experienceJson from '../assets/json/experience.json';
import {setLevelUpVisibility} from '../redux/slices/levelUpSlice.tsx';
import {colors} from '../utils/colors.ts';
import {ItemDetails} from '../components/itemDetails.tsx';
import {userInfoStore} from '../_zustand/userInfoStore.tsx';

const Tab = createBottomTabNavigator();

export function MainComponent() {
    const level = userInfoStore(state => state.level);
    const exp = userInfoStore(state => state.exp);

    useEffect(() => {
        const maxExp = experienceJson.userMaxExp[level - 1];
        if (exp >= maxExp) {
            triggerLevelUp(exp - maxExp);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exp]);

    return (
        <View style={styles.container}>
            <ItemDetails />
            <RewardsModal />
            <Combat />

            <StatusBar />
            <TopStatus />
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={{
                        lazy: false,
                        headerShown: false,
                        tabBarActiveTintColor: colors.primary,
                        tabBarStyle: {
                            height: 82,
                            borderTopWidth: 0,
                            elevation: 0,
                            paddingTop: 4,
                            paddingBottom: 4,
                        },
                        tabBarLabelStyle: {
                            fontSize: 13,
                            fontFamily: 'Myriad',
                            textShadowColor: 'rgba(0, 0, 0, 1)',
                            textShadowOffset: {width: 1, height: 1},
                            textShadowRadius: 5,
                            marginBottom: 8,
                        },
                        tabBarBackground: () => (
                            <ImageBackground
                                style={styles.tabBarBackground}
                                source={getImage('background_landscape')}
                                resizeMode={'stretch'}
                                fadeDuration={0}
                            />
                        ),
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
    store.dispatch(setLevelUpVisibility(true));
    //TODO:

    setTimeout(() => {
        store.dispatch(setLevelUpVisibility(false));
    }, 3000);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
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
    tabBarBackground: {
        flex: 1,
        width: '100%',
    },
    icon: {
        aspectRatio: 1,
        height: 45,
    },
});
