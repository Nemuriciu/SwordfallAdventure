import React, {useEffect} from 'react';
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
import Modal from 'react-native-modal';
import {getImage} from '../assets/images/_index';
import {CloseButton} from './buttons/closeButton.tsx';
import {getItemImg} from '../parsers/itemParser.tsx';
import {strings} from '../utils/strings.ts';
import {isFull} from '../utils/arrayUtils.ts';
import {colors} from '../utils/colors.ts';
import Animated, {BounceIn, BounceOut} from 'react-native-reanimated';
import {rewardsStore} from '../store_zustand/rewardsStore.tsx';
import {inventoryStore} from '../store_zustand/inventoryStore.tsx';
import {userInfoStore} from '../store_zustand/userInfoStore.tsx';
import {gatheringStore} from '../store_zustand/gatheringStore.tsx';
import {values} from '../utils/values.ts';
import experienceJson from '../assets/json/experience.json';
import {itemTooltipStore} from '../store_zustand/itemTooltipStore.tsx';

export function RewardsModal() {
    const level = userInfoStore(state => state.level);
    const exp = userInfoStore(state => state.exp);
    const shards = userInfoStore(state => state.shards);
    const updateExp = userInfoStore(state => state.updateExp);
    const updateShards = userInfoStore(state => state.updateShards);
    const increaseLevel = userInfoStore(state => state.increaseLevel);
    const inventoryList = inventoryStore(state => state.inventoryList);
    const inventoryAddItems = inventoryStore(state => state.inventoryAddItems);
    const gatherExp = gatheringStore(state => state.exp);
    const gatherLevel = gatheringStore(state => state.level);
    const updateGatherExp = gatheringStore(state => state.updateGatherExp);
    const increaseGatherLevel = gatheringStore(
        state => state.increaseGatherLevel,
    );
    const modalVisible = rewardsStore(state => state.modalVisible);
    const rewards = rewardsStore(state => state.rewards);
    const rewardsExp = rewardsStore(state => state.exp);
    const rewardsShards = rewardsStore(state => state.shards);
    const rewardsGatheringExp = rewardsStore(state => state.gatheringExp);
    const title = rewardsStore(state => state.title);
    const rewardsHide = rewardsStore(state => state.rewardsHide);
    const levelUpVisibility = userInfoStore(state => state.levelUpVisibility);

    const itemTooltipShow = itemTooltipStore(state => state.itemTooltipShow);

    useEffect(() => {
        if (modalVisible) {
            if (!isFull(inventoryList)) {
                if (rewards.length) {
                    inventoryAddItems(rewards);
                }
                if (rewardsShards) {
                    updateShards(shards + rewardsShards);
                }
                if (rewardsGatheringExp) {
                    const newExp = gatherExp + rewardsGatheringExp;
                    const maxExp =
                        experienceJson.gatheringMaxExp[gatherLevel - 1];
                    /* Check Gather Level-Up */
                    if (newExp >= maxExp) {
                        increaseGatherLevel(newExp - maxExp);
                    } else {
                        updateGatherExp(newExp);
                    }
                }
                if (rewardsExp) {
                    const newExp = exp + rewardsExp;
                    const maxExp = experienceJson.userMaxExp[level - 1];
                    /* Check Level-Up */
                    if (newExp >= maxExp) {
                        increaseLevel(newExp - maxExp);
                    } else {
                        updateExp(newExp);
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalVisible]);

    // @ts-ignore
    const renderItem = ({item}) => (
        <TouchableOpacity onPress={() => itemTooltipShow(item)}>
            <ImageBackground
                style={styles.rewardSlot}
                source={getImage(getItemImg(item.id))}
                fadeDuration={0}>
                <Text style={styles.rewardQuantity}>
                    {item.quantity > 1 ? item.quantity : ''}
                </Text>
            </ImageBackground>
        </TouchableOpacity>
    );

    // noinspection RequiredAttributes
    return (
        <Modal
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            isVisible={modalVisible}
            backdropTransitionInTiming={1}
            backdropTransitionOutTiming={1}
            useNativeDriver={true}>
            {/* Level Up Icon */}
            {levelUpVisibility && (
                <Animated.View
                    style={styles.level_up}
                    entering={BounceIn.duration(500)}
                    exiting={BounceOut.duration(500)}>
                    <View style={styles.level_up}>
                        <Image
                            style={styles.level_up_icon}
                            source={getImage('icon_level_up')}
                        />
                    </View>
                </Animated.View>
            )}
            {/* Modal Container */}
            <View style={styles.modalAlpha}>
                <View style={styles.container}>
                    <ImageBackground
                        style={styles.background}
                        source={getImage('item_background_default')}
                        resizeMode={'stretch'}
                        fadeDuration={0}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.title}>
                                {title ? title : strings.rewards}
                            </Text>
                            {rewards.length ? (
                                <FlatList
                                    style={styles.flatList}
                                    horizontal
                                    data={rewards}
                                    keyExtractor={(_item, index) =>
                                        index.toString()
                                    }
                                    renderItem={renderItem}
                                    overScrollMode={'never'}
                                />
                            ) : null}
                            {rewards.length === 0 ? (
                                <Text style={styles.noRewardText}>
                                    {strings.no_items_dropped}
                                </Text>
                            ) : null}
                            <Image
                                style={styles.separator}
                                source={getImage('icon_separator')}
                                resizeMode={'contain'}
                                fadeDuration={0}
                            />
                            <View style={styles.bottomContainer}>
                                {rewardsShards ? (
                                    <View style={styles.bottomInnerContainer}>
                                        <Image
                                            style={styles.bottomIcon}
                                            source={getImage('icon_shards')}
                                            fadeDuration={0}
                                        />
                                        <Text style={styles.bottomText}>
                                            {rewardsShards}
                                        </Text>
                                    </View>
                                ) : null}
                                {rewardsExp ? (
                                    <View style={styles.bottomInnerContainer}>
                                        <Text style={styles.bottomExpIcon}>
                                            {strings.xp}
                                        </Text>
                                        <Text style={styles.bottomText}>
                                            {rewardsExp}
                                        </Text>
                                    </View>
                                ) : null}
                                {rewardsGatheringExp ? (
                                    <View style={styles.bottomInnerContainer}>
                                        <Image
                                            style={styles.bottomIcon}
                                            source={getImage(
                                                'quests_icon_gathering',
                                            )}
                                            fadeDuration={0}
                                        />
                                        <Text style={styles.bottomText}>
                                            {rewardsGatheringExp}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                        <CloseButton
                            onPress={() => {
                                rewardsHide();
                            }}
                        />
                    </ImageBackground>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalAlpha: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginStart: 12,
        marginEnd: 12,
    },
    background: {
        width: '100%',
    },
    innerContainer: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 24,
        marginStart: 24,
        marginEnd: 24,
    },
    title: {
        color: colors.primary,
        fontSize: 20,
        fontFamily: values.fontBold,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    flatList: {
        marginTop: 16,
        marginBottom: 12,
    },
    rewardSlot: {
        aspectRatio: 1,
        height: Dimensions.get('screen').height / 18,
        marginStart: 1,
        marginEnd: 1,
    },
    rewardQuantity: {
        position: 'absolute',
        bottom: 5,
        right: 6,
        color: 'white',
        fontSize: 13,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    noRewardText: {
        marginTop: 16,
        marginBottom: 16,
        color: 'white',
        fontSize: 16,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    separator: {
        width: '100%',
    },

    bottomContainer: {
        marginTop: 12,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
    },
    bottomInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomIcon: {
        aspectRatio: 1,
        width: 20,
        resizeMode: 'contain',
    },
    bottomExpIcon: {
        color: colors.experience_color,
        fontSize: 16,
        fontFamily: values.fontBold,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    bottomText: {
        marginStart: 8,
        color: 'white',
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },

    // TODO:
    level_up: {
        position: 'absolute',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    level_up_icon: {
        aspectRatio: 1.07,
        width: '75%',
        height: undefined,
    },
});
