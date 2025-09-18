import React, {useEffect} from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    FlatList,
    Text,
    Image,
    Dimensions,
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

export function RewardsModal() {
    const exp = userInfoStore(state => state.exp);
    const shards = userInfoStore(state => state.shards);
    const updateExp = userInfoStore(state => state.updateExp);
    const updateShards = userInfoStore(state => state.updateShards);
    const inventoryList = inventoryStore(state => state.inventoryList);
    const inventoryAddItems = inventoryStore(state => state.inventoryAddItems);
    const gatherExp = gatheringStore(state => state.exp);
    const updateGatherExp = gatheringStore(state => state.updateGatherExp);
    const modalVisible = rewardsStore(state => state.modalVisible);
    const rewards = rewardsStore(state => state.rewards);
    const rewardsExp = rewardsStore(state => state.exp);
    const rewardsShards = rewardsStore(state => state.shards);
    const rewardsGatheringExp = rewardsStore(state => state.gatheringExp);
    const title = rewardsStore(state => state.title);
    const rewardsHide = rewardsStore(state => state.rewardsHide);
    const levelUpVisibility = userInfoStore(state => state.levelUpVisibility);

    useEffect(() => {
        if (modalVisible) {
            if (!isFull(inventoryList)) {
                if (rewards.length) {
                    inventoryAddItems(rewards);
                }
                if (rewardsExp) {
                    updateExp(exp + rewardsExp);
                }
                if (rewardsShards) {
                    updateShards(shards + rewardsShards);
                }
                if (rewardsGatheringExp) {
                    updateGatherExp(gatherExp + rewardsGatheringExp);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalVisible]);

    // @ts-ignore
    const renderItem = ({item}) => (
        <ImageBackground
            style={styles.rewardSlot}
            source={getImage(getItemImg(item.id))}
            fadeDuration={0}>
            <Text style={styles.rewardQuantity}>
                {item.quantity > 1 ? item.quantity : ''}
            </Text>
        </ImageBackground>
    );

    // noinspection RequiredAttributes
    return (
        <Modal
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            animationOutTiming={200}
            isVisible={modalVisible}
            backdropTransitionOutTiming={0}
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
                        source={getImage('background_details')}
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
                                {rewardsGatheringExp ? (
                                    <View style={styles.gatheringExpContainer}>
                                        <Text style={styles.gatheringExpLabel}>
                                            Gathering Experience:
                                        </Text>
                                        <Text style={styles.gatheringExpText}>
                                            {rewardsGatheringExp}
                                        </Text>
                                    </View>
                                ) : null}
                                <View style={styles.shardsExpContainer}>
                                    {rewardsShards ? (
                                        <Image
                                            style={styles.shardsIcon}
                                            source={getImage('icon_shards')}
                                            fadeDuration={0}
                                        />
                                    ) : null}
                                    {rewardsShards ? (
                                        <Text style={styles.shardsText}>
                                            {rewardsShards}
                                        </Text>
                                    ) : null}
                                    {rewardsExp ? (
                                        <Text style={styles.expIcon}>
                                            {strings.xp}
                                        </Text>
                                    ) : null}
                                    {rewardsExp ? (
                                        <Text style={styles.expText}>
                                            {rewardsExp}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                        </View>

                        <CloseButton
                            onPress={() => {
                                rewardsHide();
                            }}
                            style={styles.closeButton}
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
        marginStart: 16,
        marginEnd: 16,
    },
    background: {
        width: '100%',
    },
    innerContainer: {
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 32,
        marginStart: 32,
        marginEnd: 32,
    },
    title: {
        color: colors.primary,
        fontSize: 24,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    flatList: {
        marginTop: 24,
        marginBottom: 16,
    },
    rewardSlot: {
        aspectRatio: 1,
        height: Dimensions.get('screen').height / 16,
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
    noRewardText: {
        marginTop: 24,
        marginBottom: 24,
        color: 'white',
        fontSize: 18,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    separator: {
        width: '100%',
    },
    bottomContainer: {},
    gatheringExpContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 12,
        marginBottom: -4,
    },
    shardsExpContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
    },
    shardsIcon: {
        aspectRatio: 1,
        width: '10%',
        height: undefined,
        alignSelf: 'center',
    },
    shardsText: {
        marginStart: 6,
        alignSelf: 'center',
        fontSize: 16,
        color: 'white',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    expIcon: {
        marginStart: 46,
        alignSelf: 'center',
        fontSize: 18,
        color: colors.primary,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    expText: {
        marginStart: 6,
        alignSelf: 'center',
        fontSize: 16,
        color: 'white',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    gatheringExpLabel: {
        marginEnd: 16,
        alignSelf: 'center',
        color: colors.experience_color,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    gatheringExpText: {
        alignSelf: 'center',
        fontSize: 16,
        color: colors.experience_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    closeButton: {
        position: 'absolute',
        bottom: '-5%',
        width: '11%',
        aspectRatio: 1,
        alignSelf: 'center',
    },
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
