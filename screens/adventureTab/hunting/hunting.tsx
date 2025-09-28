import {FlatList, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {getImage} from '../../../assets/images/_index';
import {CreatureCard} from './creatureCard.tsx';
import {Creature} from '../../../types/creature.ts';
import {
    CREATURE_COUNT_MAX,
    CREATURE_COUNT_MIN,
    getCreature,
} from '../../../parsers/creatureParser.tsx';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {dynamoDb, USER_ID} from '../../../database';
import {rand} from '../../../parsers/itemParser.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IconText} from '../../../components/iconText.tsx';
import {MinusButton} from '../../../components/buttons/minusButton.tsx';
import {PlusButton} from '../../../components/buttons/plusButton.tsx';
import {userInfoStore} from '../../../store_zustand/userInfoStore.tsx';
import {huntingStore} from '../../../store_zustand/huntingStore.tsx';
import {values} from '../../../utils/values.ts';

export function Hunting() {
    const level = userInfoStore(state => state.level);
    const depth = huntingStore(state => state.depth);
    const killCount = huntingStore(state => state.killCount);
    const creatureList = huntingStore(state => state.creatureList);
    const creatureLevel = huntingStore(state => state.creatureLevel);
    const huntingUpdate = huntingStore(state => state.huntingUpdate);
    const huntingSetCreatureLevel = huntingStore(
        state => state.huntingSetCreatureLevel,
    );

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
    }, [depth, killCount, creatureList]);
    useEffect(() => {
        if (!didMount_1.current) {
            if (!creatureLevel) {
                huntingSetCreatureLevel(level);
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
                huntingSetCreatureLevel(parseInt(lvl as string, 10));
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
                const {hunting} = unmarshall(data.Item);
                huntingUpdate(
                    hunting.depth,
                    hunting.killCount,
                    hunting.creatureList,
                );
            }
        });
    }

    function updateHuntingDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: `
            set hunting.#depth = :depth,
                hunting.#killCount = :killCount,
                hunting.#creatureList = :creatureList`,
            ExpressionAttributeNames: {
                '#depth': 'depth',
                '#killCount': 'killCount',
                '#creatureList': 'creatureList',
            },
            ExpressionAttributeValues: marshall({
                ':depth': depth,
                ':killCount': killCount,
                ':creatureList': creatureList,
            }),
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
        huntingSetCreatureLevel(creatureLevel - 1);
    }

    function increaseCreatureLevel() {
        // noinspection JSIgnoredPromiseFromCall
        setStorageCreatureLevel(creatureLevel + 1);
        huntingSetCreatureLevel(creatureLevel + 1);
    }

    function decreaseDepth() {
        const _depth = depth - 1;
        //TODO: Decrease creatures bonus stats

        huntingUpdate(_depth, 0, creatureList);
    }

    function increaseDepth() {
        const _depth = depth + 1;
        const _creatureList: Creature[] = [];

        for (let i = 0; i < rand(CREATURE_COUNT_MIN, CREATURE_COUNT_MAX); i++) {
            _creatureList.push(getCreature(creatureLevel, _depth));
        }

        huntingUpdate(_depth, 0, _creatureList);
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
                        disabled={depth <= 0}
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
                    text={depth.toString()}
                    image={'frame_round_small_red'}
                    containerStyle={styles.valueIcon}
                    textContainerStyle={styles.valueTextContainer}
                    textStyle={styles.valueText}
                />
            </View>
            {/* Creature List */}
            <FlatList
                style={styles.creatureList}
                data={creatureList}
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
        marginStart: 2,
    },
    creatureMinusButton: {
        width: '15%',
        marginStart: 8,
    },
    creaturePlusButton: {
        width: '15%',
        marginEnd: 8,
    },
    depthLabelContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginStart: 4,
        marginEnd: 2,
        paddingEnd: 12,
    },
    depthMinusButton: {
        width: '15%',
        marginStart: 8,
    },
    depthPlusButton: {
        width: '15%',
        marginEnd: 8,
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
        fontFamily: values.fontBold,
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
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    creatureList: {},
});
