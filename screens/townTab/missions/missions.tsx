import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {getImage} from '../../../assets/images/_index';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {
    generateMission,
    isMissionComplete,
} from '../../../parsers/questParser.tsx';
import {missionsSetList} from '../../../redux/slices/missionsSlice.tsx';
import {getItemImg} from '../../../parsers/itemParser.tsx';
import {strings} from '../../../utils/strings.ts';
import {colors} from '../../../utils/colors.ts';
import ProgressBar from '../../../components/progressBar.tsx';
import {ButtonType, CustomButton} from '../../../components/customButton.tsx';
import cloneDeep from 'lodash.clonedeep';
import {Mission} from '../../../types/mission.ts';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {USER_ID} from '../../../App';
import {dynamoDb} from '../../../database';

const MISSION_COUNT = 5;

export function Missions() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const missions = useSelector((state: RootState) => state.missions);
    const dispatch = useDispatch();
    const didMount = useRef(1);

    useEffect(() => {
        fetchMissionsDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!didMount.current) {
            updateMissionsDB();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [missions.missionsList]);

    function fetchMissionsDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            ProjectionExpression: 'missions',
        };
        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // @ts-ignore
                dispatch(missionsSetList(unmarshall(data.Item).missions));
            }
        });
    }

    function updateMissionsDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: 'set missions = :val',
            ExpressionAttributeValues: marshall({
                ':val': missions.missionsList,
            }),
        };
        dynamoDb.updateItem(params, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    function startMission(index: number) {
        const missionsList = cloneDeep(missions.missionsList);
        missionsList[index].isActive = true;

        sortMissions(missionsList);
        dispatch(missionsSetList(missionsList));
    }

    function abandonMission(index: number) {
        const missionsList = cloneDeep(missions.missionsList);
        missionsList[index].isActive = false;

        sortMissions(missionsList);
        dispatch(missionsSetList(missionsList));
    }

    /*function claimRewards(index: number) {
        const missionsList = cloneDeep(missions.missionsList);
        missionsList[index].progress = Math.min(
            missionsList[index].progress + 1,
            missionsList[index].maxProgress,
        );

        sortMissions(missionsList);
        dispatch(missionsSetList(missionsList));
    }*/

    function refreshMissions() {
        const missionsList = [];

        for (let i = 0; i < MISSION_COUNT; i++) {
            missionsList.push(generateMission(userInfo.level));
        }

        sortMissions(missionsList);
        dispatch(missionsSetList(missionsList));
    }

    function sortMissions(list: Mission[]) {
        list.sort((a, b) => {
            if (a.isActive && b.isActive) {
                if (isMissionComplete(a) && isMissionComplete(b)) {
                    return 0;
                } else if (isMissionComplete(a)) {
                    return -1;
                } else if (isMissionComplete(b)) {
                    return 1;
                }
                return 0;
            } else if (a.isActive) {
                return -1;
            } else if (b.isActive) {
                return 1;
            }
            return 0;
        });
    }

    return (
        <ImageBackground
            style={styles.container}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            <Text style={styles.refreshTitle}>
                Missions refresh in: 01:00:00
            </Text>
            <ImageBackground
                style={styles.innerContainer}
                source={getImage('background_inner')}
                resizeMode={'stretch'}
                fadeDuration={0}>
                <FlatList
                    style={styles.missionsList}
                    data={missions.missionsList}
                    renderItem={({item, index}) => (
                        <ImageBackground
                            style={styles.missionBackground}
                            source={getImage('background_node')}
                            resizeMode={'stretch'}
                            fadeDuration={0}>
                            <View style={styles.topContainer}>
                                {/* Icon */}
                                <Image
                                    style={styles.missionIcon}
                                    source={
                                        item.type === 'hunt'
                                            ? getImage('missions_icon_hunting')
                                            : item.type === 'craft'
                                            ? getImage('missions_icon_crafting')
                                            : item.type === 'gather'
                                            ? getImage(
                                                  'missions_icon_gathering',
                                              )
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
                                            progress={
                                                item.progress / item.maxProgress
                                            }
                                            image={
                                                isMissionComplete(item)
                                                    ? 'progress_bar_green'
                                                    : 'progress_bar_orange'
                                            }
                                        />
                                    ) : (
                                        <View />
                                    )}
                                    {item.isActive ? (
                                        <Text style={styles.progressText}>
                                            {item.progress +
                                                '/' +
                                                item.maxProgress}
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
                                {/*<Text style={styles.rewardsLabel}>
                                    {strings.rewards + ':'}
                                </Text>*/}
                                {/* Shards & Exp */}
                                <View style={styles.shardsExpContainer}>
                                    <View style={styles.shardsContainer}>
                                        {item.shards ? (
                                            <Image
                                                style={styles.shardsIcon}
                                                source={getImage('icon_shards')}
                                                resizeMode={'stretch'}
                                                fadeDuration={0}
                                            />
                                        ) : null}
                                        {item.shards ? (
                                            <Text
                                                style={styles.shardsText}
                                                adjustsFontSizeToFit={true}
                                                numberOfLines={1}>
                                                {item.shards}
                                            </Text>
                                        ) : null}
                                    </View>
                                    <View style={styles.expContainer}>
                                        {item.exp ? (
                                            <Text
                                                style={styles.expIcon}
                                                adjustsFontSizeToFit={true}
                                                numberOfLines={1}>
                                                {strings.xp}
                                            </Text>
                                        ) : null}
                                        {item.exp ? (
                                            <Text
                                                style={styles.expText}
                                                adjustsFontSizeToFit={true}
                                                numberOfLines={1}>
                                                {item.exp}
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
                                                    source={getImage(
                                                        getItemImg(item.id),
                                                    )}
                                                    fadeDuration={0}>
                                                    <Text
                                                        style={
                                                            styles.rewardQuantity
                                                        }>
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
                                {item.isActive && !isMissionComplete(item) ? (
                                    <CustomButton
                                        type={ButtonType.Red}
                                        title={'Abandon'}
                                        onPress={() => abandonMission(index)}
                                        style={styles.button}
                                    />
                                ) : (
                                    <CustomButton
                                        type={
                                            isMissionComplete(item)
                                                ? ButtonType.Green
                                                : ButtonType.Orange
                                        }
                                        title={
                                            isMissionComplete(item)
                                                ? strings.claim
                                                : strings.start
                                        }
                                        onPress={
                                            item.isActive
                                                ? () => {}
                                                : () => startMission(index)
                                        }
                                        style={styles.button}
                                    />
                                )}
                            </View>
                        </ImageBackground>
                    )}
                    overScrollMode={'never'}
                />
            </ImageBackground>
            {/* DEBUG */}
            <CustomButton
                type={ButtonType.Orange}
                title={'Refresh'}
                onPress={refreshMissions}
                style={styles.refreshButton}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    refreshTitle: {
        marginTop: 12,
        marginBottom: 12,
        alignSelf: 'center',
        fontSize: 18,
        color: 'white',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    innerContainer: {
        flex: 1,
        marginStart: 2,
        marginEnd: 2,
    },
    missionsList: {
        marginTop: 4,
        marginBottom: 4,
    },
    missionBackground: {},
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
    missionIcon: {
        width: '7.5%',
        aspectRatio: 1,
    },
    descriptionContainer: {
        width: '62.5%',
    },
    description: {
        marginStart: 10,
        marginEnd: 4,
        fontSize: 15,
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
