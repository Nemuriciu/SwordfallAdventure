import cloneDeep from 'lodash.clonedeep';
import React, {useEffect, useState} from 'react';
import {Image, Text, StyleSheet, View, ImageBackground} from 'react-native';
import {getImage} from '../../../assets/images/_index';
import {
    getNodeRewards,
    getNodeImg,
    getNodeName,
    Node,
    getNodeExperience,
    getNodeShards,
} from '../../../parsers/nodeParser.tsx';
import {colors} from '../../../utils/colors.ts';
import {getItemColor} from '../../../parsers/itemParser.tsx';
import {ButtonType, CustomButton} from '../../../components/customButton.tsx';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {setGatherInfo} from '../../../redux/slices/gatherInfoSlice.tsx';
import ProgressBar from '../../../components/progressBar.tsx';
import {rewardsModalInit} from '../../../redux/slices/rewardsModalSlice.tsx';
import Toast from 'react-native-simple-toast';
import {updateStamina} from '../../../redux/slices/userInfoSlice.tsx';
import {
    isMissionComplete,
    sortMissions,
} from '../../../parsers/questParser.tsx';
import {missionsSetList} from '../../../redux/slices/missionsSlice.tsx';

interface props {
    node: Node;
    index: number;
}

export function GatherNode({node, index}: props) {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const gatherInfo = useSelector((state: RootState) => state.gatherInfo);
    const missions = useSelector((state: RootState) => state.missions);
    const [timer, setTimer] = useState(1);
    const [nodeTime, setNodeTime] = useState(1);
    const [disabled, setDisabled] = useState(false);
    const [disabled_2, setDisabled_2] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (gatherInfo.isGathering && gatherInfo.nodeIndex === index) {
            const node_time =
                gatherInfo.nodes[gatherInfo.nodeIndex].time * 60000;
            const timeLeft =
                new Date().getTime() - new Date(gatherInfo.timestamp).getTime();

            setNodeTime(node_time);
            setTimer(node_time - timeLeft);

            const timerId = setInterval(() => {
                setTimer(time => (time > 0 ? time - 1000 : time));
            }, 1000);

            return () => {
                clearInterval(timerId);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gatherInfo]);

    function isGatheringReady() {
        if (gatherInfo.isGathering) {
            const currentTime = new Date().getTime();
            const timestamp = new Date(gatherInfo.timestamp).getTime();

            return (
                currentTime - timestamp >=
                gatherInfo.nodes[gatherInfo.nodeIndex].time * 60000
            );
        }
    }

    function startGathering() {
        if (!disabled) {
            setDisabled(true);

            const staminaCost: number = 10; //TODO:

            if (userInfo.stamina >= staminaCost) {
                dispatch(updateStamina(userInfo.stamina - staminaCost));
                dispatch(
                    setGatherInfo({
                        isGathering: true,
                        nodeIndex: index,
                        timestamp: new Date().toISOString(),
                        nodes: gatherInfo.nodes,
                    }),
                );
            } else {
                Toast.show('Not enough stamina.', Toast.SHORT);
            }

            setTimeout(() => {
                setDisabled(false);
            }, 500);
        }
    }

    function claimGathering() {
        if (!disabled_2) {
            setDisabled_2(true);
            /* Generate Rewards */
            dispatch(
                rewardsModalInit({
                    rewards: getNodeRewards(
                        gatherInfo.nodes[gatherInfo.nodeIndex],
                        userInfo.level,
                    ),
                    experience: getNodeExperience(
                        gatherInfo.nodes[gatherInfo.nodeIndex],
                        userInfo.level,
                    ),
                    shards: getNodeShards(
                        gatherInfo.nodes[gatherInfo.nodeIndex],
                        userInfo.level,
                    ),
                }),
            );
            /* Update Missions */
            const missionsList = cloneDeep(missions.missionsList);

            for (let i = 0; i < missionsList.length; i++) {
                let mission = missionsList[i];
                if (
                    mission.isActive &&
                    !isMissionComplete(mission) &&
                    (mission.type === 'gather' || mission.type === 'craft')
                    //TODO: remove craft
                ) {
                    if (mission.description.includes(node.type)) {
                        mission.progress = Math.min(
                            mission.progress + node.time,
                            mission.maxProgress,
                        );
                    }
                }
            }
            sortMissions(missionsList);
            dispatch(missionsSetList(missionsList));

            /* Remove Node from list */
            const nodeList = cloneDeep(gatherInfo.nodes);
            nodeList.splice(index, 1);

            dispatch(
                setGatherInfo({
                    isGathering: false,
                    nodeIndex: -1,
                    timestamp: new Date().toISOString(),
                    nodes: nodeList,
                }),
            );

            setTimeout(() => {
                setDisabled_2(false);
            }, 250);
        }
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

    return (
        <ImageBackground
            style={styles.nodeBackground}
            source={getImage('background_node')}
            resizeMode={'stretch'}>
            <Image
                style={styles.image}
                source={getImage(getNodeImg(node.id))}
                fadeDuration={0}
            />
            <View style={styles.infoContainer}>
                <Text style={[styles.name, {color: getItemColor(node.rarity)}]}>
                    {getNodeName(node.id)}
                </Text>
                <Text style={styles.time}>{'Time: ' + node.time + ' min'}</Text>
            </View>
            <View style={styles.rightContainer}>
                {gatherInfo.isGathering &&
                    gatherInfo.nodeIndex === index &&
                    !isGatheringReady() && (
                        <ProgressBar
                            progress={1 - timer / nodeTime}
                            image={'progress_bar_orange'}
                            style={styles.progressBar}
                        />
                    )}
                {gatherInfo.isGathering &&
                    gatherInfo.nodeIndex === index &&
                    !isGatheringReady() && (
                        <Text style={styles.progressText}>
                            {formatTime(timer)}
                        </Text>
                    )}

                {!gatherInfo.isGathering && (
                    <CustomButton
                        type={ButtonType.Orange}
                        title={'Gather'}
                        onPress={startGathering}
                        disabled={disabled}
                        style={styles.gatherButton}
                    />
                )}
                {isGatheringReady() && gatherInfo.nodeIndex === index && (
                    <CustomButton
                        type={ButtonType.Green}
                        title={'Claim'}
                        onPress={claimGathering}
                        disabled={disabled_2}
                        style={styles.gatherButton}
                    />
                )}
                {!gatherInfo.isGathering && (
                    <View style={styles.staminaContainer}>
                        <Text style={styles.staminaText}>10</Text>
                        <Image
                            source={getImage('icon_stamina')}
                            style={styles.staminaIcon}
                        />
                    </View>
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    nodeBackground: {
        flexDirection: 'row',
    },
    image: {
        aspectRatio: 1,
        width: '13.5%',
        marginTop: 8,
        marginBottom: 8,
        marginStart: 20,
    },
    infoContainer: {
        flex: 1,
        marginTop: 12,
        marginStart: 12,
    },
    name: {
        marginBottom: 4,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    time: {
        fontSize: 13,
        color: colors.primary,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    rightContainer: {
        aspectRatio: 2,
        width: '30%',
        justifyContent: 'center',
        marginTop: 6,
        marginEnd: 24,
    },
    gatherButton: {
        aspectRatio: 3,
        marginStart: 6,
        marginEnd: 6,
    },
    staminaContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    staminaText: {
        marginStart: 6,
        width: '20%',
        textAlign: 'right',
        alignSelf: 'center',
        color: colors.stamina_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    staminaIcon: {
        aspectRatio: 1,
        width: '20%',
        marginTop: 2,
    },
    progressBar: {
        height: 20,
    },
    progressText: {
        position: 'absolute',
        color: 'white',
        alignSelf: 'center',
        fontSize: 12,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 3,
    },
});
