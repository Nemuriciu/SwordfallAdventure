import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {getImage} from '../assets/images/_index';
import {colors} from '../utils/colors.ts';
import ProgressBar from '../components/progressBar.tsx';
import experienceJson from '../assets/json/experience.json';
import {PlusButton} from '../components/buttons/plusButton.tsx';
import {IconText} from '../components/iconText.tsx';
import {userInfoStore} from '../store_zustand/userInfoStore.tsx';
import {values} from '../utils/values.ts';
import {GetCommand} from '@aws-sdk/lib-dynamodb';
import {dynamoDB, USER_ID} from '../database';
import {UpdateItemCommand} from '@aws-sdk/client-dynamodb';

export function TopStatus() {
    const username = userInfoStore(state => state.username);
    const level = userInfoStore(state => state.level);
    const exp = userInfoStore(state => state.exp);
    const stamina = userInfoStore(state => state.stamina);
    const staminaMax = userInfoStore(state => state.staminaMax);
    const skillPoints = userInfoStore(state => state.skillPoints);
    const shards = userInfoStore(state => state.shards);
    const diamonds = userInfoStore(state => state.diamonds);
    const staminaTimestamp = userInfoStore(state => state.staminaTimestamp);

    const userInfoSetAll = userInfoStore(state => state.userInfoSetAll);
    const userInfoSetStaminaTimestamp = userInfoStore(
        state => state.userInfoSetStaminaTimestamp,
    );
    const userInfoSetStamina = userInfoStore(state => state.userInfoSetStamina);
    // DEBUG
    const userInfoSetShards = userInfoStore(state => state.userInfoSetShards);

    const [staminaFetched, setStaminaFetched] = useState(false);
    const [staminaTimer, setStaminaTimer] = useState(1);
    const didMount_1 = useRef(2);
    const didMount_2 = useRef(1);
    const didMount_3 = useRef(2);
    const fiveMin = 300000;
    let timer: string | number | NodeJS.Timeout | undefined;

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        fetchUserInfoDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!didMount_1.current) {
            // noinspection JSIgnoredPromiseFromCall
            updateUserInfoDB();
        } else {
            didMount_1.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        username,
        level,
        exp,
        stamina,
        staminaMax,
        skillPoints,
        shards,
        diamonds,
        staminaTimestamp,
    ]);
    useEffect(() => {
        if (!didMount_2.current) {
            if (!staminaFetched) {
                updateStaminaOffline();
                setStaminaFetched(true);
            }
        } else {
            didMount_2.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staminaTimestamp]);
    useEffect(() => {
        if (staminaTimer <= 0) {
            clearInterval(timer);
            setStaminaTimer(1);
            updateStaminaOnline();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staminaTimer]);
    useEffect(() => {
        if (!didMount_3.current) {
            if (staminaTimer <= 1 && stamina < staminaMax) {
                userInfoSetStaminaTimestamp(new Date().toISOString());
                startTimer(fiveMin);
            } else if (staminaTimer > 1 && stamina >= staminaMax) {
                clearInterval(timer);
                setStaminaTimer(1);
            }
        } else {
            didMount_3.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stamina]);

    async function fetchUserInfoDB() {
        try {
            const command = new GetCommand({
                TableName: 'users',
                Key: {
                    id: USER_ID,
                },
                ProjectionExpression: 'userInfo',
            });

            // @ts-ignore
            const response = await dynamoDB.send(command);
            const {userInfo} = response.Item;
            userInfoSetAll(
                userInfo.username,
                userInfo.level,
                userInfo.exp,
                userInfo.stamina,
                userInfo.staminaMax,
                userInfo.skillPoints,
                userInfo.shards,
                userInfo.diamonds,
                userInfo.staminaTimestamp,
            );
        } catch (error) {
            console.error('Error fetching userInfo:', error);
            throw error;
        }
    }

    async function updateUserInfoDB() {
        try {
            const command = new UpdateItemCommand({
                TableName: 'users',
                Key: {
                    id: {S: USER_ID!},
                },
                UpdateExpression: 'SET userInfo = :userInfo',
                ExpressionAttributeValues: {
                    ':userInfo': {
                        M: {
                            username: {S: username},
                            level: {N: level.toString()},
                            exp: {N: exp.toString()},
                            stamina: {N: stamina.toString()},
                            staminaMax: {N: staminaMax.toString()},
                            skillPoints: {N: skillPoints.toString()},
                            shards: {N: shards.toString()},
                            diamonds: {N: diamonds.toString()},
                            staminaTimestamp: {S: staminaTimestamp},
                        },
                    },
                },
                ReturnValues: 'ALL_NEW',
            });

            // @ts-ignore
            await dynamoDB.send(command);
        } catch (error) {
            console.error('Error updating userInfo:', error);
            throw error;
        }
    }

    function updateStaminaOffline() {
        if (staminaTimestamp === '' || stamina === staminaMax) {
            return;
        }

        const timePassed =
            new Date().getTime() - new Date(staminaTimestamp).getTime();

        const minutes = Math.floor(timePassed / 60000);
        const seconds = (timePassed / 1000) % 60;
        const staminaVal = 10 * Math.floor(minutes / 5);

        if (stamina + staminaVal >= staminaMax) {
            if (staminaVal > 0) {
                userInfoSetStamina(
                    stamina + staminaVal >= staminaMax
                        ? staminaMax
                        : stamina + staminaVal,
                );
            }
        } else {
            if (staminaVal > 0) {
                /* Update Stamina */

                userInfoSetStamina(
                    stamina + staminaVal >= staminaMax
                        ? staminaMax
                        : stamina + staminaVal,
                );
                /* Update remaining time Timestamp */
                const c = new Date();
                c.setMinutes(c.getMinutes() - (minutes % 5));
                c.setSeconds(c.getSeconds() - seconds);
                userInfoSetStaminaTimestamp(c.toISOString());

                /* Start Stamina Timer */
                startTimer(fiveMin - (new Date().getTime() - c.getTime()));
            } else {
                /* Start Stamina Timer */
                startTimer(
                    fiveMin -
                        (new Date().getTime() -
                            new Date(staminaTimestamp).getTime()),
                );
            }
        }
    }

    function updateStaminaOnline() {
        const staminaAdded = 10;

        /* Start Timer */
        if (stamina + staminaAdded < staminaMax) {
            userInfoSetStaminaTimestamp(new Date().toISOString());
            setStaminaTimer(fiveMin);
        }

        userInfoSetStamina(
            stamina + staminaAdded >= staminaMax
                ? staminaMax
                : stamina + staminaAdded,
        );
    }

    function startTimer(remainingTime: number) {
        setStaminaTimer(remainingTime);

        timer = setInterval(() => {
            setStaminaTimer(time => (time > 1 ? time - 1000 : time));
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }

    function formatTime(milliseconds: number): string {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    return (
        <ImageBackground
            style={styles.outerContainer}
            source={getImage('background_landscape')}
            resizeMode={'stretch'}
            fadeDuration={0}>
            <View style={styles.innerTopContainer}>
                <IconText
                    text={level ? level.toString() : ''}
                    image={'frame_round_small'}
                    containerStyle={styles.levelContainer}
                    textContainerStyle={styles.levelTextContainer}
                    textStyle={styles.levelText}
                />
                <Text
                    style={styles.username}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    {username}
                </Text>
                <ImageBackground
                    style={styles.currencyContainer}
                    source={getImage('background_small')}
                    resizeMode={'stretch'}
                    fadeDuration={0}>
                    <Image
                        style={styles.currencyIcon}
                        source={getImage('icon_shards')}
                        fadeDuration={0}
                    />
                    <Text
                        style={styles.currencyValue}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}>
                        {shards}
                    </Text>
                </ImageBackground>
                <ImageBackground
                    style={styles.currencyContainer}
                    source={getImage('background_small')}
                    resizeMode={'stretch'}
                    fadeDuration={0}>
                    <Image
                        style={styles.currencyIcon}
                        source={getImage('icon_diamonds')}
                        fadeDuration={0}
                    />
                    <Text
                        style={styles.currencyValue}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}>
                        {diamonds}
                    </Text>
                    <PlusButton
                        style={styles.plusButton}
                        onPress={() => {
                            userInfoSetShards(shards + 1000);
                        }}
                    />
                </ImageBackground>
            </View>

            <View style={styles.innerMidContainer}>
                <View style={styles.midLeftContainer}>
                    <Text
                        style={styles.expIcon}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}>
                        XP
                    </Text>
                    <Text
                        style={styles.experience}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}>
                        {experienceJson.userMaxExp[level - 1]
                            ? exp + '/' + experienceJson.userMaxExp[level - 1]
                            : ''}
                    </Text>
                </View>
                <View style={styles.midRightContainer}>
                    {staminaTimer > 1 ? (
                        <Text
                            style={styles.staminaRefresh}
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}>
                            {'+10 in ' + formatTime(staminaTimer)}
                        </Text>
                    ) : null}
                    <Text
                        style={styles.staminaValue}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}>
                        {staminaMax ? stamina + '/' + staminaMax : ''}
                    </Text>
                    <View style={styles.staminaIconContainer}>
                        <Image
                            style={styles.staminaIcon}
                            source={getImage('icon_stamina')}
                            resizeMode={'stretch'}
                            fadeDuration={0}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.progressBarContainer}>
                <View style={styles.experienceBarContainer}>
                    <ProgressBar
                        progress={exp / experienceJson.userMaxExp[level - 1]}
                        image={'progress_bar_orange'}
                        style={styles.experienceBar}
                    />
                </View>
                <View style={styles.staminaBarContainer}>
                    <ProgressBar
                        progress={stamina / staminaMax}
                        image={'progress_bar_stamina'}
                        style={styles.staminaBar}
                    />
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    outerContainer: {},
    innerTopContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginStart: 8,
        marginEnd: 8,
    },
    innerMidContainer: {
        flexDirection: 'row',
        marginTop: 8,
        marginStart: '2.5%',
        marginEnd: '2.5%',
    },
    progressBarContainer: {
        height: 18,
        flexDirection: 'row',
        marginTop: 2,
        marginBottom: 8,
        marginStart: '2.5%',
        marginEnd: '2.5%',
    },
    midLeftContainer: {
        flex: 1,
        flexDirection: 'row',
        marginEnd: 24,
    },
    midRightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    experienceBarContainer: {
        flex: 1,
        marginEnd: 24,
    },
    staminaBarContainer: {
        flex: 1,
    },
    experienceBar: {},
    staminaBar: {},

    levelContainer: {
        flex: 0.185,
        aspectRatio: 1,
    },
    levelTextContainer: {
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    levelText: {
        marginBottom: 1,
        textAlign: 'center',
        color: colors.primary,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    username: {
        flex: 0.815,
        marginStart: 8,
        marginEnd: 4,
        fontSize: 16,
        color: 'white',
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },

    currencyContainer: {
        flex: 0.5,
        flexDirection: 'row',
        marginEnd: 4,
        padding: 4,
    },
    currencyIcon: {
        aspectRatio: 1,
        width: '20%',
        marginStart: 2,
    },
    currencyValue: {
        flex: 1,
        marginStart: 6,
        color: 'white',
        fontFamily: values.fontRegular,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    plusButton: {
        position: 'absolute',
        right: '-5%',
        width: '30%',
    },

    expIcon: {
        marginStart: 4,
        marginEnd: 8,
        color: colors.experience_color,
        fontFamily: values.fontBold,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    experience: {
        flex: 1,
        textAlign: 'left',
        color: colors.experience_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },

    staminaRefresh: {
        color: colors.stamina_color,
        fontFamily: values.fontRegular,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    staminaValue: {
        marginLeft: 'auto',
        marginRight: 2,
        textAlign: 'right',
        color: colors.stamina_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    staminaIconContainer: {
        aspectRatio: 1,
    },
    staminaIcon: {
        width: '100%',
        height: '100%',
        marginTop: 1,
        marginRight: 'auto',
    },
});
