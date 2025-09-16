import {FlatList, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {getImage} from '../../../assets/images/_index';
import {CreatureCard} from './creatureCard.tsx';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {Creature} from '../../../types/creature.ts';
import {getCreature} from '../../../parsers/creatureParser.tsx';
import {huntingUpdate} from '../../../redux/slices/huntingSlice.tsx';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {USER_ID} from '../../../App';
import {dynamoDb} from '../../../database';
import {rand} from '../../../parsers/itemParser.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IconText} from '../../../components/iconText.tsx';
import {MinusButton} from '../../../components/buttons/minusButton.tsx';
import {PlusButton} from '../../../components/buttons/plusButton.tsx';
import {userInfoStore} from '../../../_zustand/userInfoStore.tsx';

export const CREATURE_COUNT_MIN = 5;
export const CREATURE_COUNT_MAX = 7;

export function Hunting() {
    const level = userInfoStore(state => state.level);

    const hunting = useSelector((state: RootState) => state.hunting);
    const [creatureLevel, setCreatureLevel] = useState(0);
    const dispatch = useDispatch();
    const didMount = useRef(1);
    const didMount_1 = useRef(1);

    useEffect(() => {
        fetchHuntingDB();
        // noinspection JSIgnoredPromiseFromCall
        fetchAsyncStorage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!didMount.current) {
            updateHuntingDB();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hunting]);
    useEffect(() => {
        if (!didMount_1.current) {
            if (creatureLevel <= 0) {
                setCreatureLevel(level);
                // noinspection JSIgnoredPromiseFromCall
                setStorageCreatureLevel(level);
            }
        } else {
            didMount_1.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level]);

    async function fetchAsyncStorage() {
        try {
            const lvl = await AsyncStorage.getItem('huntingCreatureLevel');
            if (lvl !== null) {
                setCreatureLevel(parseInt(lvl as string, 10));
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function setStorageCreatureLevel(lvl: number) {
        try {
            await AsyncStorage.setItem('huntingCreatureLevel', lvl.toString());
        } catch (e) {
            console.error(e);
        }
    }

    function fetchHuntingDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            ProjectionExpression: 'hunting',
        };
        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // @ts-ignore
                dispatch(huntingUpdate(unmarshall(data.Item).hunting));
            }
        });
    }

    function updateHuntingDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: 'set hunting = :val',
            ExpressionAttributeValues: marshall({':val': hunting}),
        };
        dynamoDb.updateItem(params, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    function decreaseCreatureLevel() {
        // noinspection JSIgnoredPromiseFromCall
        setStorageCreatureLevel(creatureLevel - 1);
        setCreatureLevel(creatureLevel - 1);
    }

    function increaseCreatureLevel() {
        // noinspection JSIgnoredPromiseFromCall
        setStorageCreatureLevel(creatureLevel + 1);
        setCreatureLevel(creatureLevel + 1);
    }

    function decreaseDepth() {
        const depth = hunting.depth - 1;
        //TODO: Decrease creatures bonus stats

        dispatch(
            huntingUpdate({
                depth: depth,
                creatureList: hunting.creatureList,
                killCount: 0,
            }),
        );
    }

    function increaseDepth() {
        const depth = hunting.depth + 1;
        const creatureList: Creature[] = [];

        for (let i = 0; i < rand(CREATURE_COUNT_MIN, CREATURE_COUNT_MAX); i++) {
            creatureList.push(getCreature(creatureLevel, depth));
        }

        dispatch(
            huntingUpdate({
                depth: depth,
                creatureList: creatureList,
                killCount: 0,
            }),
        );
    }

    return (
        <ImageBackground
            style={styles.outerContainer}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            <View style={styles.innerContainer}>
                {/* Creature Level Value */}
                <IconText
                    text={creatureLevel.toString(10)}
                    image={'frame_round_small_red'}
                    containerStyle={styles.valueIcon}
                    textContainerStyle={styles.valueTextContainer}
                    textStyle={styles.valueText}
                />
                {/* Creature Level Label */}
                <ImageBackground
                    style={styles.creatureLevelLabelContainer}
                    source={getImage('background_small_arrow_left')}
                    resizeMode={'stretch'}
                    fadeDuration={0}>
                    <MinusButton
                        style={styles.creatureMinusButton}
                        onPress={decreaseCreatureLevel}
                        disabled={creatureLevel <= 1}
                    />
                    <Text
                        style={styles.labelText}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}>
                        Creature Lv.
                    </Text>
                    <PlusButton
                        style={styles.creaturePlusButton}
                        onPress={increaseCreatureLevel}
                        disabled={creatureLevel >= level}
                    />
                </ImageBackground>
                {/* Depth Label */}
                <ImageBackground
                    style={styles.depthLabelContainer}
                    source={getImage('background_small_arrow_right')}
                    resizeMode={'stretch'}
                    fadeDuration={0}>
                    <MinusButton
                        style={styles.depthMinusButton}
                        onPress={decreaseDepth}
                        disabled={hunting.depth <= 0}
                    />
                    <Text
                        style={styles.labelText}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}>
                        Depth
                    </Text>
                    <PlusButton
                        style={styles.depthPlusButton}
                        onPress={increaseDepth}
                        //TODO:
                        // disabled={hunting.killCount < 3}
                    />
                </ImageBackground>
                {/* Depth Value */}
                <IconText
                    text={hunting.depth.toString()}
                    image={'frame_round_small_red'}
                    containerStyle={styles.valueIcon}
                    textContainerStyle={styles.valueTextContainer}
                    textStyle={styles.valueText}
                />
            </View>
            {/* Creature List */}
            <FlatList
                style={styles.creatureList}
                data={hunting.creatureList}
                keyExtractor={(_item, index) => index.toString()}
                renderItem={({item, index}) => (
                    <CreatureCard creature={item} index={index} />
                )}
                overScrollMode={'never'}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    innerContainer: {
        height: '6.5%',
        flexDirection: 'row',
        marginStart: 4,
        marginEnd: 4,
        marginTop: 14,
        marginBottom: 12,
    },
    creatureLevelLabelContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingStart: 12,
    },
    creatureMinusButton: {
        width: '17.5%',
        marginStart: 4,
    },
    creaturePlusButton: {
        width: '17.5%',
        marginEnd: 6,
    },
    depthLabelContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginStart: 8,
        paddingEnd: 12,
    },
    depthMinusButton: {
        width: '17.5%',
        marginStart: 6,
    },
    depthPlusButton: {
        width: '17.5%',
        marginEnd: 4,
    },
    valueIcon: {
        aspectRatio: 1,
    },
    valueTextContainer: {
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    valueText: {
        marginBottom: 1,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    labelText: {
        flex: 1,
        marginStart: 4,
        marginEnd: 4,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    creatureList: {},
});
