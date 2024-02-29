import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as Progress from 'react-native-progress';
import {getImage} from '../assets/images/_index';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {dynamoDb} from '../database';
import {USER_ID} from '../App';

const progressBarWidth = Dimensions.get('screen').width * 0.45;
const expColor = '#FFAB40';
const staminaColor = '#448AFF';

export function TopStatus() {
    const [username, setUsername] = useState();
    const [shards, setShards] = useState();
    const [diamonds, setDiamonds] = useState();
    const [level, setLevel] = useState();
    const [exp, setExp] = useState();
    const [expMax, setExpMax] = useState();
    const [stamina, setStamina] = useState();
    const [staminaMax, setStaminaMax] = useState();

    const fetchEquipment = () => {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            ProjectionExpression: 'userInfo',
        };
        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // noinspection JSCheckFunctionSignatures
                const userInfo = unmarshall(data.Item).userInfo;
                setUsername(userInfo.username);
                setShards(userInfo.shards);
                setDiamonds(userInfo.diamonds);
                setLevel(userInfo.level);
                setExp(userInfo.exp);
                setExpMax(userInfo.expMax);
                setStamina(userInfo.stamina);
                setStaminaMax(userInfo.staminaMax);
            }
        });
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.innerTopContainer}>
                <Text
                    style={styles.username}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    {username}
                </Text>
                <Image
                    style={styles.shardsIcon}
                    source={getImage('icon_shards')}
                />
                <Text
                    style={styles.shardsValue}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    {shards}
                </Text>
                <Image
                    style={styles.diamondsIcon}
                    source={getImage('icon_diamonds')}
                />
                <Text
                    style={styles.diamondsValue}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    {diamonds}
                </Text>
            </View>

            <View style={styles.innerBottomContainer}>
                <Text
                    style={styles.level}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    {level ? 'Level ' + level : ''}
                </Text>
                <Text
                    style={styles.experience}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    {exp != null && expMax != null ? exp + '/' + expMax : ''}
                </Text>
                <Text
                    style={styles.expIcon}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    XP
                </Text>
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
                    {stamina != null && staminaMax != null
                        ? stamina + '/' + staminaMax
                        : ''}
                </Text>
                <Image
                    style={styles.staminaIcon}
                    source={getImage('icon_stamina')}
                />
            </View>

            <View style={styles.progressBarContainer}>
                <View style={styles.experienceBarContainer}>
                    <Progress.Bar
                        progress={exp}
                        aria-valuemax={expMax}
                        width={progressBarWidth}
                        height={9}
                        color={expColor}
                        unfilledColor={'#555'}
                    />
                </View>
                <View style={styles.staminaBarContainer}>
                    <Progress.Bar
                        progress={stamina}
                        aria-valuemax={staminaMax}
                        width={progressBarWidth}
                        height={9}
                        color={staminaColor}
                        unfilledColor={'#555'}
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
        alignItems: 'center',
        marginTop: 6,
        marginStart: '2.5%',
        marginEnd: '2.5%',
    },
    innerBottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        marginStart: '2.5%',
        marginEnd: '2.5%',
    },
    progressBarContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4,
        marginBottom: 12,
        marginStart: '2.5%',
        marginEnd: '2.5%',
    },
    experienceBarContainer: {
        marginEnd: '5%',
    },
    staminaBarContainer: {},

    username: {
        flex: 1,
        marginTop: 2,
        color: 'white',
        //fontFamily: 'Lato_400Regular',
        fontSize: 16,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    shardsIcon: {
        aspectRatio: 1,
        width: '6.5%',
    },
    shardsValue: {
        width: '20%',
        marginStart: 4,
        marginTop: 4,
        color: 'white',
        //fontFamily: 'Lato_400Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    diamondsIcon: {
        aspectRatio: 1,
        width: '6.5%',
    },
    diamondsValue: {
        width: '15%',
        marginStart: 4,
        marginTop: 4,
        color: 'white',
        //fontFamily: 'Lato_400Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },

    level: {
        width: '15%',
        color: 'white',
        //fontFamily: 'Lato_400Regular',
        fontSize: 16,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    experience: {
        flex: 1,
        textAlign: 'right',
        color: 'white',
        //fontFamily: 'Lato_400Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    expIcon: {
        width: '5%',
        marginStart: '1%',
        marginEnd: '6%',
        //fontFamily: 'Lato_700Bold',
        color: '#FFAB40',
    },
    staminaRefresh: {
        width: '22.5%',
        color: 'white',
        //fontFamily: 'Lato_400Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    staminaValue: {
        width: '17.5%',
        textAlign: 'right',
        color: 'white',
        //fontFamily: 'Lato_400Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    staminaIcon: {
        aspectRatio: 1,
        width: '6.5%',
    },
});
