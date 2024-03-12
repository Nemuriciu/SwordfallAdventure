import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {getImage} from '../assets/images/_index';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {dynamoDb} from '../database';
import {USER_ID} from '../App';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store.tsx';
import {setUserInfo} from '../redux/slices/userInfoSlice.tsx';
import {colors} from '../utils/colors.ts';
import ProgressBar from '../components/progressBar.tsx';

export function TopStatus() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const dispatch = useDispatch();
    const didMount = useRef(1);

    useEffect(() => {
        fetchUserInfoDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!didMount.current) {
            updateUserInfoDB();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);

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
                    <Text
                        style={styles.staminaRefresh}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}>
                        +10 in 04:52
                    </Text>
                    <Text
                        style={styles.staminaValue}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}>
                        {userInfo.stamina && userInfo.staminaMax
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
        color: colors.primary,
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
        color: colors.primary,
        fontFamily: 'Myriad',
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
        color: colors.primary,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },

    level: {
        marginEnd: 4,
        fontSize: 16,
        color: colors.primary,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    experience: {
        flex: 1,
        textAlign: 'right',
        fontSize: 16,
        color: colors.primary,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    expIcon: {
        marginStart: 4,
        marginEnd: 4,
        fontSize: 16,
        color: colors.experience_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },

    staminaRefresh: {
        marginStart: 4,
        fontSize: 16,
        color: colors.primary,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    staminaValue: {
        marginLeft: 'auto',
        marginRight: 2,
        textAlign: 'right',
        fontSize: 16,
        color: colors.primary,
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
