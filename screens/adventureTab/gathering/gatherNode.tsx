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
    getNodeGatheringExp,
} from '../../../parsers/nodeParser.tsx';
import {colors} from '../../../utils/colors.ts';
import {getItemColor} from '../../../parsers/itemParser.tsx';
import {
    ButtonType,
    CustomButton,
} from '../../../components/buttons/customButton.tsx';
import ProgressBar from '../../../components/progressBar.tsx';
import {isQuestComplete, sortQuests} from '../../../parsers/questParser.tsx';
import {userInfoStore} from '../../../store_zustand/userInfoStore.tsx';
import {rewardsStore} from '../../../store_zustand/rewardsStore.tsx';
import {gatheringStore} from '../../../store_zustand/gatheringStore.tsx';
import {questsStore} from '../../../store_zustand/questsStore.tsx';
import {values} from '../../../utils/values.ts';

interface props {
    node: Node;
    index: number;
}

export function GatherNode({node, index}: props) {
    const staminaCost = Math.round(5 * (node.time / 10));
    const level = userInfoStore(state => state.level);
    const stamina = userInfoStore(state => state.stamina);
    const updateStamina = userInfoStore(state => state.updateStamina);
    const rewardsInit = rewardsStore(state => state.rewardsInit);

    const gatherLevel = gatheringStore(state => state.level);
    const gatherExp = gatheringStore(state => state.exp);
    const isGathering = gatheringStore(state => state.isGathering);
    const nodeIndex = gatheringStore(state => state.nodeIndex);
    const gatherTimestamp = gatheringStore(state => state.timestamp);
    const nodes = gatheringStore(state => state.nodes);
    const setGatherInfo = gatheringStore(state => state.setGatherInfo);

    const questsList = questsStore(state => state.questsList);
    const questsSetList = questsStore(state => state.questsSetList);

    const [timer, setTimer] = useState(1);
    const [nodeTime, setNodeTime] = useState(1);
    const [disabled, setDisabled] = useState(false);
    const [disabled_2, setDisabled_2] = useState(false);

    useEffect(() => {
        if (isGathering && nodeIndex === index) {
            const node_time = nodes[nodeIndex].time * 60000;
            const timeLeft =
                new Date().getTime() - new Date(gatherTimestamp).getTime();

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
    }, [
        gatherLevel,
        gatherExp,
        isGathering,
        nodeIndex,
        gatherTimestamp,
        nodes,
    ]);

    function isGatheringReady() {
        if (isGathering) {
            const currentTime = new Date().getTime();
            const timestamp = new Date(gatherTimestamp).getTime();

            return currentTime - timestamp >= nodes[nodeIndex].time * 60000;
        }
    }

    function startGathering() {
        if (!disabled) {
            setDisabled(true);

            if (stamina >= staminaCost) {
                updateStamina(stamina - staminaCost);
                setGatherInfo(
                    gatherLevel,
                    gatherExp,
                    true,
                    index,
                    new Date().toISOString(),
                    nodes,
                );
            } else {
                //TODO: localization
                // Toast.show('Not enough stamina.', Toast.SHORT); TODO: Replace Toast
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
            rewardsInit(
                getNodeRewards(nodes[nodeIndex], level),
                getNodeExperience(nodes[nodeIndex], level),
                getNodeGatheringExp(nodes[nodeIndex], level),
                getNodeShards(nodes[nodeIndex]),
            );

            /* Update Quests */
            const _questsList = cloneDeep(questsList);

            for (let i = 0; i < _questsList.length; i++) {
                let quest = _questsList[i];
                if (
                    quest.isActive &&
                    !isQuestComplete(quest) &&
                    quest.type === 'gathering'
                ) {
                    if (quest.description.includes(node.type)) {
                        quest.progress = Math.min(
                            quest.progress + node.time,
                            quest.maxProgress,
                        );
                    }
                }
            }
            sortQuests(_questsList);
            questsSetList(_questsList);

            /* Remove Node from list */
            const nodeList = cloneDeep(nodes);
            nodeList.splice(index, 1);

            setGatherInfo(
                gatherLevel,
                gatherExp,
                false,
                -1,
                new Date().toISOString(),
                nodeList,
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
                {isGathering && nodeIndex === index && !isGatheringReady() && (
                    <ProgressBar
                        progress={1 - timer / nodeTime}
                        image={'progress_bar_orange'}
                        style={styles.progressBar}
                    />
                )}
                {isGathering && nodeIndex === index && !isGatheringReady() && (
                    <Text style={styles.progressText}>{formatTime(timer)}</Text>
                )}

                {!isGathering && (
                    <CustomButton
                        type={ButtonType.Red}
                        title={'Gather'}
                        onPress={startGathering}
                        disabled={disabled}
                        style={styles.gatherButton}
                    />
                )}
                {isGathering && isGatheringReady() && nodeIndex === index && (
                    <CustomButton
                        type={ButtonType.Green}
                        title={'Claim'}
                        onPress={claimGathering}
                        disabled={disabled_2}
                        style={styles.gatherButton}
                    />
                )}
                {!isGathering && (
                    <View style={styles.staminaContainer}>
                        <Text style={styles.staminaText}>{staminaCost}</Text>
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
        width: '13%',
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
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    time: {
        fontSize: 13,
        color: colors.primary,
        fontFamily: values.fontRegular,
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
        fontFamily: values.font,
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
