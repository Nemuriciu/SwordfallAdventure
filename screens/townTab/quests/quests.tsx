import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {getImage} from '../../../assets/images/_index';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {
    generateQuest,
    getQuestExp,
    getQuestShards,
    isQuestComplete,
    sortQuests,
} from '../../../parsers/questParser.tsx';
import {
    questsSet,
    questsSetList,
    questsSetTimestamp,
} from '../../../redux/slices/questsSlice.tsx';
import {getItemImg} from '../../../parsers/itemParser.tsx';
import {strings} from '../../../utils/strings.ts';
import {colors} from '../../../utils/colors.ts';
import ProgressBar from '../../../components/progressBar.tsx';
import {
    ButtonType,
    CustomButton,
} from '../../../components/buttons/customButton.tsx';
import cloneDeep from 'lodash.clonedeep';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {USER_ID} from '../../../App';
import {dynamoDb} from '../../../database';
import {rewardsModalInit} from '../../../redux/slices/rewardsModalSlice.tsx';
import {AbandonModal} from './abandonModal.tsx';

export const QUESTS_AMOUNT: number = 8;
export const QUESTS_HUNTING_AMOUNT: number = 5;
export const QUESTS_GATHERING_AMOUNT: number = 2;
export const QUESTS_CRAFTING_AMOUNT: number = 1;

export function Quests() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const quests = useSelector((state: RootState) => state.quests);
    const dispatch = useDispatch();
    const [refreshFetched, setRefreshFetched] = useState(false);
    const [refreshTimer, setRefreshTimer] = useState(1);
    const [abandonIndex, setAbandonIndex] = useState(-1);
    const [abandonVisible, setAbandonVisible] = useState(false);
    const didMount = useRef(2);
    const didMount_2 = useRef(1);
    const twoHour = 7200000;
    let timer: string | number | NodeJS.Timeout | undefined;

    useEffect(() => {
        fetchQuestsDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!didMount.current) {
            updateQuestsDB();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quests]);

    useEffect(() => {
        if (!didMount_2.current) {
            if (!refreshFetched) {
                setRefreshFetched(true);

                let diff =
                    new Date().getTime() -
                    new Date(quests.refreshTimestamp).getTime();

                if (diff >= twoHour) {
                    refreshQuests();

                    diff %= twoHour;
                    dispatch(
                        questsSetTimestamp(
                            new Date(Date.now() - diff).toISOString(),
                        ),
                    );
                }

                /* Start Refresh Timer */
                startTimer(twoHour - diff);
            }
        } else {
            didMount_2.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quests.refreshTimestamp]);

    useEffect(() => {
        if (refreshTimer <= 0) {
            clearInterval(timer);
            setRefreshTimer(1);
            refreshQuests();
            dispatch(questsSetTimestamp(new Date().toISOString()));
            setRefreshTimer(twoHour);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTimer]);

    function fetchQuestsDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            ProjectionExpression: 'quests',
        };
        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // @ts-ignore
                dispatch(questsSet(unmarshall(data.Item).quests));
            }
        });
    }

    function updateQuestsDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: 'set quests = :val',
            ExpressionAttributeValues: marshall({
                ':val': quests,
            }),
        };
        dynamoDb.updateItem(params, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    function startQuest(index: number) {
        const questsList = cloneDeep(quests.questsList);
        questsList[index].isActive = true;

        sortQuests(questsList);
        dispatch(questsSetList(questsList));
    }

    function abandonQuest(index: number) {
        setAbandonIndex(index);
        setAbandonVisible(true);
    }

    function claimQuestRewards(index: number) {
        const questsList = cloneDeep(quests.questsList);
        /* Display Rewards */
        dispatch(
            rewardsModalInit({
                rewards: questsList[index].rewards,
                experience: getQuestExp(questsList[index], userInfo.level),
                shards: getQuestShards(questsList[index]),
            }),
        );
        /* Remove quest */
        questsList.splice(index, 1);
        //sortQuests(questsList);
        dispatch(questsSetList(questsList));
    }

    function refreshQuests() {
        const questsList =
            quests.questsList.length > 0
                ? cloneDeep(quests.questsList).filter(quest => quest.isActive)
                : [];
        let huntingCount = 0,
            gatheringCount = 0,
            craftingCount = 0;

        if (questsList.length) {
            questsList.map(quest => {
                switch (quest.type) {
                    case 'hunting':
                        huntingCount += 1;
                        break;
                    case 'gathering':
                        gatheringCount += 1;
                        break;
                    case 'crafting':
                        craftingCount += 1;
                        break;
                }
            });
        }

        for (let i = huntingCount; i < QUESTS_HUNTING_AMOUNT; i++) {
            questsList.push(generateQuest('hunting', userInfo.level));
        }

        for (let i = gatheringCount; i < QUESTS_GATHERING_AMOUNT; i++) {
            questsList.push(generateQuest('gathering', userInfo.level));
        }

        for (let i = craftingCount; i < QUESTS_CRAFTING_AMOUNT; i++) {
            questsList.push(generateQuest('crafting', userInfo.level));
        }

        dispatch(questsSetList(questsList));
    }

    function startTimer(remainingTime: number) {
        setRefreshTimer(remainingTime);

        timer = setInterval(() => {
            setRefreshTimer(time => (time > 1 ? time - 1000 : time));
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }

    function formatTime(milliseconds: number): string {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    // @ts-ignore
    const renderItem = ({item, index}) => {
        return (
            <ImageBackground
                style={styles.questBackground}
                source={getImage('background_node')}
                resizeMode={'stretch'}
                fadeDuration={0}>
                <View style={styles.topContainer}>
                    {/* Icon */}
                    <Image
                        style={styles.questIcon}
                        source={
                            item.type === 'hunting'
                                ? getImage('quests_icon_hunting')
                                : item.type === 'crafting'
                                ? getImage('quests_icon_crafting')
                                : item.type === 'gathering'
                                ? getImage('quests_icon_gathering')
                                : null
                        }
                        resizeMode={'stretch'}
                        fadeDuration={0}
                    />
                    {/* Description */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.description}>
                            {item.description}
                        </Text>
                    </View>
                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                        {item.isActive ? (
                            <ProgressBar
                                progress={item.progress / item.maxProgress}
                                image={
                                    isQuestComplete(item)
                                        ? 'progress_bar_green'
                                        : 'progress_bar_orange'
                                }
                            />
                        ) : (
                            <View />
                        )}
                        {item.isActive ? (
                            <Text style={styles.progressText}>
                                {item.progress + '/' + item.maxProgress}
                            </Text>
                        ) : null}
                    </View>
                </View>
                <View style={styles.separatorContainer}>
                    <Image
                        style={styles.separator}
                        source={getImage('icon_separator')}
                        resizeMode={'contain'}
                        fadeDuration={0}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    {/* Shards & Exp */}
                    <View style={styles.shardsExpContainer}>
                        <View style={styles.shardsContainer}>
                            {userInfo.level ? (
                                <Image
                                    style={styles.shardsIcon}
                                    source={getImage('icon_shards')}
                                    resizeMode={'stretch'}
                                    fadeDuration={0}
                                />
                            ) : null}
                            {userInfo.level ? (
                                <Text
                                    style={styles.shardsText}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}>
                                    {getQuestShards(item)}
                                </Text>
                            ) : null}
                        </View>
                        <View style={styles.expContainer}>
                            {userInfo.level ? (
                                <Text
                                    style={styles.expIcon}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}>
                                    {strings.xp}
                                </Text>
                            ) : null}
                            {userInfo.level ? (
                                <Text
                                    style={styles.expText}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}>
                                    {getQuestExp(item, userInfo.level)}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                    {/* Rewards */}
                    <View style={styles.rewardsListContainer}>
                        {item.rewards.length ? (
                            <FlatList
                                horizontal
                                data={item.rewards}
                                /* eslint-disable-next-line @typescript-eslint/no-shadow */
                                renderItem={({item}) => (
                                    <ImageBackground
                                        style={styles.rewardSlot}
                                        source={getImage(getItemImg(item.id))}
                                        fadeDuration={0}>
                                        <Text style={styles.rewardQuantity}>
                                            {item.quantity > 1
                                                ? item.quantity
                                                : ''}
                                        </Text>
                                    </ImageBackground>
                                )}
                                scrollEnabled={false}
                                overScrollMode={'never'}
                            />
                        ) : null}
                    </View>
                    {/* Action Button */}
                    {item.isActive && !isQuestComplete(item) ? (
                        <CustomButton
                            type={ButtonType.Red}
                            title={'Abandon'}
                            onPress={() => abandonQuest(index)}
                            style={styles.button}
                        />
                    ) : (
                        <CustomButton
                            type={
                                isQuestComplete(item)
                                    ? ButtonType.Green
                                    : ButtonType.Orange
                            }
                            title={
                                isQuestComplete(item)
                                    ? strings.claim
                                    : strings.start
                            }
                            onPress={
                                item.isActive
                                    ? () => claimQuestRewards(index)
                                    : () => startQuest(index)
                            }
                            style={styles.button}
                        />
                    )}
                </View>
            </ImageBackground>
        );
    };

    return (
        <ImageBackground
            style={styles.outerContainer}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            <AbandonModal
                visible={abandonVisible}
                setVisible={setAbandonVisible}
                index={abandonIndex}
            />
            {/* Quests Refresh Title */}
            <Text
                style={styles.refreshTitle}
                adjustsFontSizeToFit={true}
                numberOfLines={1}>
                {strings.quests_refresh_in}
                {formatTime(refreshTimer)}
            </Text>
            {/* Quests List */}
            <FlatList
                style={styles.questsList}
                data={quests.questsList}
                renderItem={renderItem}
                overScrollMode={'never'}
            />
            {/* DEBUG */}
            <CustomButton
                type={ButtonType.Orange}
                title={'Refresh'}
                onPress={refreshQuests}
                style={styles.refreshButton}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    refreshTitle: {
        marginTop: 12,
        marginBottom: 12,
        alignSelf: 'center',
        fontSize: 16,
        color: 'white',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    questsList: {
        //TODO: margins
        flex: 1,
        marginTop: 5,
        marginBottom: 6,
    },
    questBackground: {},
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        marginStart: 32,
        marginEnd: 16,
    },
    separatorContainer: {
        marginTop: 6,
        marginBottom: 6,
        marginStart: 16,
        marginEnd: 16,
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: 24,
        marginEnd: 16,
        marginBottom: 8,
    },
    separator: {
        width: '100%',
    },
    questIcon: {
        width: '7%',
        aspectRatio: 1,
    },
    descriptionContainer: {
        width: '62.5%',
    },
    description: {
        marginStart: 10,
        marginEnd: 4,
        color: 'white',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    rewardsLabel: {
        color: colors.primary,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    rewardsListContainer: {
        width: '32%',
        height: Dimensions.get('screen').height / 24,
        marginStart: 4,
        marginEnd: 4,
    },
    rewardSlot: {
        aspectRatio: 1,
        marginStart: 1,
        marginEnd: 1,
    },
    rewardQuantity: {
        position: 'absolute',
        bottom: 5,
        right: 6,
        color: 'white',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    shardsExpContainer: {
        flex: 1,
        flexDirection: 'row',
        marginStart: 8,
    },
    shardsContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    expContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    shardsIcon: {
        aspectRatio: 1,
        width: '25%',
        height: undefined,
    },
    shardsText: {
        flex: 1,
        marginStart: 4,
        textAlignVertical: 'center',
        color: 'white',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    expIcon: {
        width: '30%',
        marginStart: 2,
        textAlign: 'center',
        fontSize: 32,
        color: colors.primary,
        fontFamily: 'Myriad_Bold',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    expText: {
        flex: 1,
        marginStart: 4,
        textAlignVertical: 'center',
        color: 'white',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    progressBarContainer: {
        width: '30%',
        height: 20,
        alignSelf: 'center',
    },
    progressText: {
        position: 'absolute',
        color: 'white',
        alignSelf: 'center',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    button: {
        width: '25%',
        aspectRatio: 3,
    },
    refreshButton: {
        width: '30%',
        alignSelf: 'center',
        aspectRatio: 3.5,
        marginTop: 4,
        marginBottom: 4,
    },
});
