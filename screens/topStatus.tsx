import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {getImage} from '../assets/images/_index';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {dynamoDb} from '../database';
import {USER_ID} from '../App';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store.tsx';
import {
    setUserInfo,
    updateStamina,
    updateTimestampStamina,
} from '../redux/slices/userInfoSlice.tsx';
import {colors} from '../utils/colors.ts';
import ProgressBar from '../components/progressBar.tsx';

export function TopStatus() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const [staminaFetched, setStaminaFetched] = useState(false);
    const [staminaTimer, setStaminaTimer] = useState(1);
    const dispatch = useDispatch();
    const didMount_1 = useRef(2);
    const didMount_2 = useRef(1);
    const didMount_3 = useRef(2);
    const fiveMin = 300000;
    let timer: string | number | NodeJS.Timeout | undefined;

    useEffect(() => {
        fetchUserInfoDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!didMount_1.current) {
            updateUserInfoDB();
        } else {
            didMount_1.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);
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
    }, [userInfo.staminaTimestamp]);
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
            if (staminaTimer <= 1 && userInfo.stamina < userInfo.staminaMax) {
                dispatch(updateTimestampStamina(new Date().toISOString()));
                startTimer(fiveMin);
            }
        } else {
            didMount_3.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo.stamina]);

    function fetchUserInfoDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            ProjectionExpression: 'userInfo',
        };

        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // @ts-ignore
                dispatch(setUserInfo(unmarshall(data.Item).userInfo));
            }
        });
    }

    function updateUserInfoDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: 'set userInfo = :val',
            ExpressionAttributeValues: marshall({':val': userInfo}),
        };
        dynamoDb.updateItem(params, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    function updateStaminaOffline() {
        if (
            userInfo.staminaTimestamp === '' ||
            userInfo.stamina === userInfo.staminaMax
        ) {
            return;
        }

        const timePassed =
            new Date().getTime() -
            new Date(userInfo.staminaTimestamp).getTime();

        const minutes = Math.floor(timePassed / 60000);
        const seconds = (timePassed / 1000) % 60;
        const staminaVal = 10 * Math.floor(minutes / 5);

        if (userInfo.stamina + staminaVal >= userInfo.staminaMax) {
            if (staminaVal > 0) {
                dispatch(
                    updateStamina(
                        userInfo.stamina + staminaVal >= userInfo.staminaMax
                            ? userInfo.staminaMax
                            : userInfo.stamina + staminaVal,
                    ),
                );
            }
        } else {
            if (staminaVal > 0) {
                /* Update Stamina */
                dispatch(
                    updateStamina(
                        userInfo.stamina + staminaVal >= userInfo.staminaMax
                            ? userInfo.staminaMax
                            : userInfo.stamina + staminaVal,
                    ),
                );
                /* Update remaining time Timestamp */
                const c = new Date();
                c.setMinutes(c.getMinutes() - (minutes % 5));
                c.setSeconds(c.getSeconds() - seconds);
                dispatch(updateTimestampStamina(c.toISOString()));

                /* Start Stamina Timer */
                startTimer(fiveMin - (new Date().getTime() - c.getTime()));
            } else {
                /* Start Stamina Timer */
                startTimer(
                    fiveMin -
                        (new Date().getTime() -
                            new Date(userInfo.staminaTimestamp).getTime()),
                );
            }
        }
    }

    function updateStaminaOnline() {
        const staminaAdded = 10;

        /* Start Timer */
        if (userInfo.stamina + staminaAdded < userInfo.staminaMax) {
            dispatch(updateTimestampStamina(new Date().toISOString()));
            setStaminaTimer(fiveMin);
        }

        dispatch(
            updateStamina(
                userInfo.stamina + staminaAdded >= userInfo.staminaMax
                    ? userInfo.staminaMax
                    : userInfo.stamina + staminaAdded,
            ),
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
        <View style={styles.container}>
            <View style={styles.innerTopContainer}>
                <Text
                    style={styles.username}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    {userInfo.username}
                </Text>
                <Image
                    style={styles.shardsIcon}
                    source={getImage('icon_shards')}
                    fadeDuration={0}
                />
                <Text
                    style={styles.shardsValue}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    {userInfo.shards}
                </Text>
                <Image
                    style={styles.diamondsIcon}
                    source={getImage('icon_diamonds')}
                    fadeDuration={0}
                />
                <Text
                    style={styles.diamondsValue}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    {userInfo.diamonds}
                </Text>
            </View>

            <View style={styles.innerMidContainer}>
                <View style={styles.midLeftContainer}>
                    <Text
                        style={styles.level}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}>
                        {userInfo.level ? 'Level ' + userInfo.level : ''}
                    </Text>
                    <Text
                        style={styles.experience}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}>
                        {userInfo.expMax
                            ? userInfo.exp + '/' + userInfo.expMax
                            : ''}
                    </Text>
                    <Text
                        style={styles.expIcon}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}>
                        XP
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
                        {userInfo.staminaMax
                            ? userInfo.stamina + '/' + userInfo.staminaMax
                            : ''}
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
                        progress={userInfo.exp / userInfo.expMax}
                        image={'progress_bar_orange'}
                        style={styles.experienceBar}
                    />
                </View>
                <View style={styles.staminaBarContainer}>
                    <ProgressBar
                        progress={userInfo.stamina / userInfo.staminaMax}
                        image={'progress_bar_stamina'}
                        style={styles.staminaBar}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#221c19',
    },
    innerTopContainer: {
        flexDirection: 'row',
        marginTop: 8,
        marginStart: '2.5%',
        marginEnd: '2.5%',
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
        marginTop: 4,
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

    username: {
        flex: 1,
        fontSize: 18,
        color: 'white',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    shardsIcon: {
        aspectRatio: 1,
        width: '6%',
    },
    shardsValue: {
        width: '20%',
        marginStart: 6,
        marginTop: 2,
        fontSize: 16,
        color: 'white',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    diamondsIcon: {
        aspectRatio: 1,
        width: '6%',
        marginStart: 4,
    },
    diamondsValue: {
        width: '15%',
        marginStart: 6,
        marginTop: 2,
        fontSize: 16,
        color: 'white',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },

    level: {
        marginEnd: 4,
        fontSize: 16,
        color: 'white',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    experience: {
        flex: 1,
        textAlign: 'right',
        fontSize: 16,
        color: colors.experience_color,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    expIcon: {
        marginStart: 4,
        marginEnd: 4,
        fontSize: 16,
        color: colors.experience_color,
        fontFamily: 'Myriad_Bold',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },

    staminaRefresh: {
        fontSize: 16,
        color: colors.stamina_color,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    staminaValue: {
        marginLeft: 'auto',
        marginRight: 2,
        textAlign: 'right',
        fontSize: 16,
        color: colors.stamina_color,
        fontFamily: 'Myriad',
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
