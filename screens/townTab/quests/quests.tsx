import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {getImage} from '../../../assets/images/_index';
import {
    generateQuest,
    getQuestExp,
    getQuestShards,
    isQuestComplete,
    QUESTS_CRAFTING_AMOUNT,
    QUESTS_GATHERING_AMOUNT,
    QUESTS_HUNTING_AMOUNT,
    sortQuests,
} from '../../../parsers/questParser.tsx';
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
import {dynamoDb, USER_ID} from '../../../database';
import {AbandonModal} from './abandonModal.tsx';
import {userInfoStore} from '../../../store_zustand/userInfoStore.tsx';
import {rewardsStore} from '../../../store_zustand/rewardsStore.tsx';
import {questsStore} from '../../../store_zustand/questsStore.tsx';
import {values} from '../../../utils/values.ts';
import {itemTooltipStore} from '../../../store_zustand/itemTooltipStore.tsx';

export function Quests() {
    const level = userInfoStore(state => state.level);
    const rewardsInit = rewardsStore(state => state.rewardsInit);
    const questsList = questsStore(state => state.questsList);
    const refreshTimestamp = questsStore(state => state.refreshTimestamp);
    const questsSet = questsStore(state => state.questsSet);
    const questsSetList = questsStore(state => state.questsSetList);
    const questsSetTimestamp = questsStore(state => state.questsSetTimestamp);

    const itemTooltipShow = itemTooltipStore(state => state.itemTooltipShow);

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
    }, [questsList, refreshTimestamp]);

    useEffect(() => {
        if (!didMount_2.current) {
            if (!refreshFetched) {
                setRefreshFetched(true);

                let diff =
                    new Date().getTime() - new Date(refreshTimestamp).getTime();

                if (diff >= twoHour) {
                    refreshQuests();

                    diff %= twoHour;

                    questsSetTimestamp(
                        new Date(Date.now() - diff).toISOString(),
                    );
                }

                /* Start Refresh Timer */
                startTimer(twoHour - diff);
            }
        } else {
            didMount_2.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTimestamp]);

    useEffect(() => {
        if (refreshTimer <= 0) {
            clearInterval(timer);
            setRefreshTimer(1);
            refreshQuests();
            questsSetTimestamp(new Date().toISOString());
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
                const {quests} = unmarshall(data.Item);
                questsSet(quests.questsList, quests.refreshTimestamp);
            }
        });
    }

    function updateQuestsDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: `
            set quests.#questsList = :questsList,
                quests.#refreshTimestamp = :refreshTimestamp`,
            ExpressionAttributeNames: {
                '#questsList': 'questsList',
                '#refreshTimestamp': 'refreshTimestamp',
            },
            ExpressionAttributeValues: marshall({
                ':questsList': questsList,
                ':refreshTimestamp': refreshTimestamp,
            }),
        };
        dynamoDb.updateItem(params, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    function startQuest(index: number) {
        const _questsList = cloneDeep(questsList);
        _questsList[index].isActive = true;

        sortQuests(_questsList);
        questsSetList(_questsList);
    }

    function abandonQuest(index: number) {
        setAbandonIndex(index);
        setAbandonVisible(true);
    }

    function claimQuestRewards(index: number) {
        const _questsList = cloneDeep(questsList);
        /* Display Rewards */
        rewardsInit(
            _questsList[index].rewards,
            getQuestExp(_questsList[index], level),
            getQuestShards(_questsList[index]),
        );
        /* Remove quest */
        _questsList.splice(index, 1);
        //sortQuests(questsList);
        questsSetList(_questsList);
    }

    function refreshQuests() {
        const _questsList =
            questsList.length > 0
                ? cloneDeep(questsList).filter(quest => quest.isActive)
                : [];
        let huntingCount = 0,
            gatheringCount = 0,
            craftingCount = 0;

        if (_questsList.length) {
            _questsList.map(quest => {
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
            _questsList.push(generateQuest('hunting', level));
        }

        for (let i = gatheringCount; i < QUESTS_GATHERING_AMOUNT; i++) {
            _questsList.push(generateQuest('gathering', level));
        }

        for (let i = craftingCount; i < QUESTS_CRAFTING_AMOUNT; i++) {
            _questsList.push(generateQuest('crafting', level));
        }

        questsSetList(_questsList);
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
                            {level ? (
                                <Image
                                    style={styles.shardsIcon}
                                    source={getImage('icon_shards')}
                                    resizeMode={'stretch'}
                                    fadeDuration={0}
                                />
                            ) : null}
                            {level ? (
                                <Text
                                    style={styles.shardsText}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}>
                                    {getQuestShards(item)}
                                </Text>
                            ) : null}
                        </View>
                        <View style={styles.expContainer}>
                            {level ? (
                                <Text
                                    style={styles.expIcon}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}>
                                    {strings.xp}
                                </Text>
                            ) : null}
                            {level ? (
                                <Text
                                    style={styles.expText}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}>
                                    {getQuestExp(item, level)}
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
                                    <TouchableOpacity
                                        style={styles.rewardSlot}
                                        onPress={() => itemTooltipShow(item)}>
                                        <ImageBackground
                                            style={styles.rewardSlot}
                                            source={getImage(
                                                getItemImg(item.id),
                                            )}
                                            fadeDuration={0}>
                                            <Text style={styles.rewardQuantity}>
                                                {item.quantity > 1
                                                    ? item.quantity
                                                    : ''}
                                            </Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
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
                                    : ButtonType.Red
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
                data={questsList}
                renderItem={renderItem}
                overScrollMode={'never'}
            />
            {/* DEBUG */}
            <CustomButton
                type={ButtonType.Red}
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
        fontFamily: values.font,
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
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    rewardsLabel: {
        color: colors.primary,
        fontFamily: values.fontRegular,
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
        fontFamily: values.font,
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
        fontFamily: values.fontRegular,
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
        fontFamily: values.fontBold,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    expText: {
        flex: 1,
        marginStart: 4,
        textAlignVertical: 'center',
        color: 'white',
        fontFamily: values.fontRegular,
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
        fontFamily: values.fontRegular,
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
