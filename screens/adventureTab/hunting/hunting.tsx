import {
    FlatList,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {getImage} from '../../../assets/images/_index';
import {CreatureCard} from './creatureCard.tsx';
import {Creature} from '../../../types/creature.ts';
import {
    CREATURE_COUNT_MAX,
    CREATURE_COUNT_MIN,
    getCreature,
} from '../../../parsers/creatureParser.tsx';
import {rand} from '../../../parsers/itemParser.tsx';
import {IconText} from '../../../components/iconText.tsx';
import {MinusButton} from '../../../components/buttons/minusButton.tsx';
import {PlusButton} from '../../../components/buttons/plusButton.tsx';
import {userInfoStore} from '../../../store_zustand/userInfoStore.tsx';
import {huntingStore} from '../../../store_zustand/huntingStore.tsx';
import {values} from '../../../utils/values.ts';
import {BackButton} from '../../../components/buttons/backButton.tsx';
import {InfoButton} from '../../../components/buttons/infoButton.tsx';
import {ZoneCard} from '../../../components/zoneCard.tsx';
import {GetCommand} from '@aws-sdk/lib-dynamodb';
import {convertForDB, dynamoDB, USER_ID} from '../../../database';
import {UpdateItemCommand} from '@aws-sdk/client-dynamodb';

export function Hunting() {
    const level = userInfoStore(state => state.level);
    const zoneId = huntingStore(state => state.zoneId);
    const zoneName = huntingStore(state => state.zoneName);
    const zoneLevelMin = huntingStore(state => state.zoneLevelMin);
    const zoneLevelMax = huntingStore(state => state.zoneLevelMax);
    const zoneList = huntingStore(state => state.zoneList);
    const huntingSelectZone = huntingStore(state => state.huntingSelectZone);
    const huntingSetZoneList = huntingStore(state => state.huntingSetZoneList);
    const huntingSetCreatureList = huntingStore(
        state => state.huntingSetCreatureList,
    );
    const huntingSetCreatureLevel = huntingStore(
        state => state.huntingSetCreatureLevel,
    );
    const huntingSetDepth = huntingStore(state => state.huntingSetDepth);
    const huntingSetKillCount = huntingStore(
        state => state.huntingSetKillCount,
    );

    const didMount = useRef(1);
    const didMount_1 = useRef(1);

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        fetchHuntingDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!didMount.current) {
            // noinspection JSIgnoredPromiseFromCall
            updateHuntingDB();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zoneList]);
    /*useEffect(() => {
        if (!didMount_1.current) {
            if (!creatureLevel) {
                huntingSetCreatureLevel(zoneId, level);
            }
        } else {
            didMount_1.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level]);*/

    async function fetchHuntingDB() {
        try {
            const command = new GetCommand({
                TableName: 'users',
                Key: {
                    id: USER_ID,
                },
                ProjectionExpression: 'hunting',
            });

            // @ts-ignore
            const response = await dynamoDB.send(command);
            const {hunting} = response.Item;
            // console.log(hunting);
            huntingSetZoneList(hunting.zoneList);
        } catch (error) {
            console.error('Error fetching hunting:', error);
            throw error;
        }
    }

    async function updateHuntingDB() {
        try {
            const command = new UpdateItemCommand({
                TableName: 'users',
                Key: {
                    id: {S: USER_ID!},
                },
                UpdateExpression: 'SET hunting.zoneList = :zoneList',
                ExpressionAttributeValues: {
                    ':zoneList': convertForDB(zoneList),
                },
                ReturnValues: 'ALL_NEW',
            });

            // @ts-ignore
            await dynamoDB.send(command);
        } catch (error) {
            console.error('Error updating hunting:', error);
            throw error;
        }
    }

    function decreaseCreatureLevel() {
        huntingSetCreatureLevel(zoneId, zoneList[zoneId].creatureLevel - 1);
    }

    function increaseCreatureLevel() {
        huntingSetCreatureLevel(zoneId, zoneList[zoneId].creatureLevel + 1);
    }

    function decreaseDepth() {
        const _depth = zoneList[zoneId].depth - 1;
        //TODO: Decrease creatures bonus stats

        huntingSetDepth(zoneId, _depth);
    }

    function increaseDepth() {
        const _depth = zoneList[zoneId].depth + 1;
        const _creatureList: Creature[] = [];

        for (let i = 0; i < rand(CREATURE_COUNT_MIN, CREATURE_COUNT_MAX); i++) {
            _creatureList.push(
                getCreature(zoneId, zoneList[zoneId].creatureLevel, _depth),
            );
        }

        huntingSetDepth(zoneId, _depth);
        huntingSetCreatureList(zoneId, _creatureList);
    }

    return (
        <ImageBackground
            style={styles.outerContainer}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            {/* Zones List */}
            {zoneId == -1 && (
                <ScrollView
                    style={styles.scrollView}
                    alwaysBounceVertical={false}>
                    <ZoneCard
                        zoneName={'Forest_1'}
                        zoneLevelMin={1}
                        zoneLevelMax={4}
                        image={'forest'}
                        hasQuest={false}
                        onPress={() => huntingSelectZone(0, 'Forest_1', 1, 4)}
                    />
                    <ZoneCard
                        zoneName={'Forest_2'}
                        zoneLevelMin={5}
                        zoneLevelMax={7}
                        image={'forest'}
                        hasQuest={false}
                        onPress={() => huntingSelectZone(1, 'Forest_2', 5, 7)}
                    />
                    <ZoneCard
                        zoneName={'Forest'}
                        zoneLevelMin={8}
                        zoneLevelMax={10}
                        image={'forest'}
                        hasQuest={false}
                        onPress={() => huntingSelectZone(2, '', 8, 10)}
                        // onPress={() => {}}
                    />
                    <ZoneCard
                        zoneName={'Forest'}
                        zoneLevelMin={11}
                        zoneLevelMax={13}
                        image={'forest'}
                        hasQuest={false}
                        // onPress={() => huntingSelectZone(3, '', 11, 13)}
                        onPress={() => {}}
                    />
                    <ZoneCard
                        zoneName={'Forest'}
                        zoneLevelMin={14}
                        zoneLevelMax={16}
                        image={'forest'}
                        hasQuest={false}
                        // onPress={() => huntingSelectZone(4, '', 14, 16)}
                        onPress={() => {}}
                    />
                </ScrollView>
            )}
            {/* Creature List View */}
            {zoneId != -1 && (
                <View style={styles.selectedZoneContainer}>
                    <View style={styles.selectedZoneTitleContainer}>
                        <BackButton
                            style={styles.backIcon}
                            onPress={() => huntingSelectZone(-1, '', -1, -1)}
                        />
                        <Text style={styles.selectedZoneTitle}>{zoneName}</Text>
                        <InfoButton
                            style={styles.infoIcon}
                            onPress={() => {}}
                        />
                    </View>
                    <View style={styles.innerContainer}>
                        {/* Creature Level Value */}
                        <IconText
                            text={zoneList[zoneId].creatureLevel.toString(10)}
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
                                disabled={
                                    zoneList[zoneId].creatureLevel <=
                                    zoneLevelMin
                                }
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
                                disabled={
                                    zoneList[zoneId].creatureLevel >= level
                                }
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
                                disabled={zoneList[zoneId].depth <= 0}
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
                            text={zoneList[zoneId].depth.toString()}
                            image={'frame_round_small_red'}
                            containerStyle={styles.valueIcon}
                            textContainerStyle={styles.valueTextContainer}
                            textStyle={styles.valueText}
                        />
                    </View>
                    {/* Creature List */}
                    <FlatList
                        style={styles.creatureList}
                        data={zoneList[zoneId].creatureList}
                        keyExtractor={(_item, index) => index.toString()}
                        renderItem={({item, index}) => (
                            <CreatureCard creature={item} index={index} />
                        )}
                        overScrollMode={'never'}
                    />
                </View>
            )}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    scrollView: {
        marginTop: 12,
        marginBottom: 4,
    },
    selectedZoneContainer: {
        flex: 1,
    },
    selectedZoneTitleContainer: {
        height: '6%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginStart: 8,
        marginEnd: 8,
        marginTop: 6,
    },
    backIcon: {
        width: '8%',
    },
    infoIcon: {
        width: '8%',
    },
    selectedZoneTitle: {
        flex: 1,
        marginStart: 8,
        marginEnd: 8,
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    innerContainer: {
        height: '6.5%',
        flexDirection: 'row',
        marginStart: 4,
        marginEnd: 4,
        marginTop: 6,
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
