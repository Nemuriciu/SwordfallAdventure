import {
    Image,
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer, useIsFocused} from '@react-navigation/native';
import {CharacterTab} from './characterTab/characterTab';
import {AdventureTab} from './adventureTab/adventureTab';
import {TownTab} from './townTab/townTab';
import {SettingsTab} from './settingsTab/settingsTab';
import {TopStatus} from './topStatus';
import {getImage} from '../assets/images/_index';
import {RewardsModal} from '../components/rewardsModal';
import {Combat} from './adventureTab/hunting/combat';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import experienceJson from '../assets/json/experience.json';
import {colors} from '../utils/colors.ts';
import {ItemDetails} from '../components/itemDetails.tsx';
import {userInfoStore} from '../store_zustand/userInfoStore.tsx';
import {addEventListener, fetch} from '@react-native-community/netinfo';
import {strings} from '../utils/strings.ts';
import {ButtonType, CustomButton} from '../components/buttons/customButton.tsx';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {values} from '../utils/values.ts';
import {ItemTooltip} from '../components/itemTooltip.tsx';

const Tab = createBottomTabNavigator();
// const setLevelUpVisibility = userInfoStore(state => state.setLevelUpVisibility);

export function MainComponent() {
    const level = userInfoStore(state => state.level);
    const exp = userInfoStore(state => state.exp);
    const networkConnection = userInfoStore(state => state.networkConnection);
    const setNetworkConnection = userInfoStore(
        state => state.setNetworkConnection,
    );
    const insets = useSafeAreaInsets();
    /* Verify network connection */
    addEventListener(state => {
        if (state.isConnected !== networkConnection) {
            if (state.isConnected !== null) {
                setNetworkConnection(state.isConnected);
            }
        }
    });
    async function retryConnection() {
        fetch().then(state => {
            if (state.isConnected !== networkConnection) {
                if (state.isConnected !== null) {
                    setNetworkConnection(state.isConnected);
                }
            }
        });
    }

    useEffect(() => {
        const maxExp = experienceJson.userMaxExp[level - 1];
        if (exp >= maxExp) {
            // triggerLevelUp(exp - maxExp);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exp]);

    // @ts-ignore
    const NavIcon = ({img, label, onPress}) => {
        const isFocused = useIsFocused();

        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={1}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 6,
                    paddingBottom: 6,
                }}>
                <Image
                    style={{flex: 1, aspectRatio: 1, height: '100%'}}
                    source={getImage(img)}
                    resizeMode={'stretch'}
                    fadeDuration={0}
                />
                <Text
                    style={{
                        color: isFocused ? colors.primary : '#fff',
                        fontFamily: 'Roboto',
                        textShadowColor: 'rgba(0, 0, 0, 1)',
                        textShadowOffset: {width: 1, height: 1},
                        textShadowRadius: 5,
                    }}
                    adjustsFontSizeToFit={true}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    // @ts-ignore
    return (
        <SafeAreaView style={styles.container}>
            {/* No Network Page */}
            {!networkConnection && (
                <View style={styles.connectionContainer}>
                    <Image
                        style={styles.connectionIcon}
                        source={getImage('no_network_icon')}
                        resizeMode={'stretch'}
                        fadeDuration={0}
                    />
                    <Text style={styles.connectionText}>
                        {strings.no_internet}
                    </Text>
                    <CustomButton
                        style={styles.retryButton}
                        type={ButtonType.Red}
                        title={strings.retry}
                        onPress={() => {
                            // noinspection JSIgnoredPromiseFromCall
                            retryConnection();
                        }}
                    />
                </View>
            )}
            {networkConnection && <ItemTooltip />}
            {networkConnection && <ItemDetails />}
            {networkConnection && <RewardsModal />}
            {networkConnection && <Combat />}
            {networkConnection && <StatusBar />}
            {networkConnection && <TopStatus />}
            {networkConnection && (
                <NavigationContainer>
                    <Tab.Navigator
                        screenOptions={{
                            lazy: false,
                            headerShown: false,
                            tabBarActiveTintColor: colors.primary,
                            tabBarStyle: {
                                height: 75 + insets.bottom,
                                borderTopWidth: 0,
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
                                tabBarButton: props => (
                                    // @ts-ignore
                                    <NavIcon
                                        {...props}
                                        img="nav_icon_character"
                                        label="Character"
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Adventure"
                            component={AdventureTab}
                            options={{
                                lazy: false,
                                tabBarButton: props => (
                                    // @ts-ignore
                                    <NavIcon
                                        {...props}
                                        img="nav_icon_adventure"
                                        label="Adventure"
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Town"
                            component={TownTab}
                            options={{
                                lazy: false,
                                tabBarButton: props => (
                                    // @ts-ignore
                                    <NavIcon
                                        {...props}
                                        img="nav_icon_town"
                                        label="Town"
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Settings"
                            component={SettingsTab}
                            options={{
                                lazy: false,
                                tabBarButton: props => (
                                    // @ts-ignore
                                    <NavIcon
                                        {...props}
                                        img="nav_icon_settings"
                                        label="Settings"
                                    />
                                ),
                            }}
                        />
                    </Tab.Navigator>
                </NavigationContainer>
            )}
        </SafeAreaView>
    );
}

/*export const triggerLevelUp = (exp: number) => {
    setLevelUpVisibility(true);
    console.log(exp);
    //TODO:

    setTimeout(() => {
        setLevelUpVisibility(false);
    }, 3000);
};*/

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#241f20',
    },
    connectionContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    connectionIcon: {
        aspectRatio: 1,
        width: '50%',
        height: undefined,
    },
    connectionText: {
        marginTop: 8,
        color: colors.primary,
        fontFamily: values.fontRegular,
        fontSize: 20,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    retryButton: {
        marginTop: 16,
        marginBottom: 16,
        aspectRatio: 3,
        width: '30%',
    },
    tabBarBackground: {
        flex: 1,
        width: '100%',
    },
});
