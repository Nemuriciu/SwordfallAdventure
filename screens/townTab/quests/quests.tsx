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
import {colors} from '../../../utils/colors.ts';
import {CloseButton} from '../../../components/buttons/closeButton.tsx';
import {Quest} from '../../../types/quest.ts';

const numColumns = 2;
const spacing = 4;

export function Quests() {
    const [containerWidth, setContainerWidth] = useState(
        Dimensions.get('window').width,
    );

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

    const renderItem = ({item, index}: {item: Quest; index: number}) => {
        const itemWidth = (containerWidth - spacing * numColumns) / numColumns;

        return (
            <ImageBackground
                style={[styles.questBackground, {width: itemWidth}]}
                source={getImage('item_background_default')}
                resizeMode={'stretch'}
                fadeDuration={0}>
                {/* Abandon Icon */}
                <View style={styles.topContainer}>
                    {item.isActive && !isQuestComplete(item) && (
                        <CloseButton
                            style={styles.abandonButton}
                            onPress={() => abandonQuest(index)}
                        />
                    )}
                </View>
                {/* Description */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
                {/*<View style={styles.descriptionContainer}/>*/}
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
                                        source={getImage(getItemImg(item.id))}
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
                {/* Shards & Exp */}
                <View style={styles.currencyContainer}>
                    <View style={styles.currencyInnerContainer}>
                        <Image
                            style={styles.currencyIcon}
                            source={getImage('icon_shards')}
                            fadeDuration={0}
                        />
                        <Text style={styles.currencyText}>
                            {getQuestShards(item)}
                        </Text>
                    </View>
                    <View style={styles.currencyInnerContainer}>
                        <Text style={styles.expIcon}>{strings.xp}</Text>
                        <Text style={styles.currencyText}>
                            {getQuestExp(item, level)}
                        </Text>
                    </View>
                </View>
                {/* Progress Bar / Buttons */}
                <View style={styles.bottomContainer}>
                    {item.isActive && !isQuestComplete(item) ? (
                        <View style={styles.progressBarContainer}>
                            <ProgressBar
                                progress={item.progress / item.maxProgress}
                                image={
                                    isQuestComplete(item)
                                        ? 'progress_bar_green'
                                        : 'progress_bar_orange'
                                }
                            />
                            <Text style={styles.progressText}>
                                {item.progress + '/' + item.maxProgress}
                            </Text>
                        </View>
                    ) : (
                        <CustomButton
                            style={styles.button}
                            type={
                                item.isActive
                                    ? ButtonType.Green
                                    : ButtonType.Red
                            }
                            title={
                                item.isActive ? strings.complete : strings.start
                            }
                            onPress={
                                item.isActive
                                    ? () => claimQuestRewards(index)
                                    : () => startQuest(index)
                            }
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
            resizeMode={'stretch'}
            onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
            <AbandonModal
                visible={abandonVisible}
                setVisible={setAbandonVisible}
                index={abandonIndex}
            />
            {/* Quests Refresh Title */}
            <View style={styles.refreshContainer}>
                <Text
                    style={styles.refreshText}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    {strings.quests_refresh_in}
                    {formatTime(refreshTimer)}
                </Text>
                <CustomButton
                    type={ButtonType.Red}
                    title={'Refresh'}
                    onPress={refreshQuests}
                    style={styles.refreshButton}
                />
            </View>
            {/* Quests List */}
            <FlatList
                style={styles.questsList}
                data={questsList}
                renderItem={renderItem}
                numColumns={numColumns}
                overScrollMode={'never'}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    refreshContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginBottom: 12,
    },
    refreshText: {
        fontSize: 16,
        color: 'white',
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    refreshButton: {
        position: 'absolute',
        right: 0,
        marginEnd: 8,
        aspectRatio: 1,
    },
    questsList: {
        marginBottom: 4,
    },
    row: {
        flex: 1,
        justifyContent: 'space-between',
    },
    questWrapper: {},
    questBackground: {
        aspectRatio: 1,
        margin: spacing / 2,
        padding: 4,
    },
    topContainer: {
        width: '12%',
        aspectRatio: 1,
        marginStart: 'auto',
    },
    abandonButton: {
        width: '100%',
    },
    descriptionContainer: {
        flex: 1,
        marginTop: 4,
        marginStart: 8,
        marginEnd: 8,
        justifyContent: 'center',
    },
    description: {
        color: 'white',
        textAlign: 'center',
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    rewardsListContainer: {
        alignSelf: 'center',
        height: Dimensions.get('screen').height / 22,
        marginStart: 12,
        marginEnd: 12,
        marginTop: 4,
        marginBottom: 4,
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
    currencyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
    },
    currencyInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencyIcon: {
        aspectRatio: 1,
        width: 20,
        resizeMode: 'contain',
    },
    expIcon: {
        color: colors.experience_color,
        fontSize: 16,
        fontFamily: values.fontBold,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    currencyText: {
        marginStart: 8,
        color: 'white',
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    bottomContainer: {
        width: '100%',
        height: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    progressBarContainer: {
        width: '75%',
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
        width: '50%',
    },
});
