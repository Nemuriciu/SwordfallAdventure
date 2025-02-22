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
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store.tsx';
import {getImage} from '../assets/images/_index';
import {CloseButton} from './closeButton.tsx';
import {rewardsModalHide} from '../redux/slices/rewardsModalSlice.tsx';
import {getItemImg} from '../parsers/itemParser.tsx';
import {strings} from '../utils/strings.ts';
import {isFull} from '../utils/arrayUtils.ts';
import {inventoryAddItems} from '../redux/slices/inventorySlice.tsx';
import {updateExp, updateShards} from '../redux/slices/userInfoSlice.tsx';
import {colors} from '../utils/colors.ts';
import Animated, {BounceIn, BounceOut} from 'react-native-reanimated';
import {updateGatherExp} from '../redux/slices/gatherInfoSlice.tsx';

export function RewardsModal() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const gatherInfo = useSelector((state: RootState) => state.gatherInfo);
    const inventory = useSelector((state: RootState) => state.inventory);
    const rewardsModal = useSelector((state: RootState) => state.rewardsModal);
    const levelUp = useSelector((state: RootState) => state.levelUp);
    const dispatch = useDispatch();

    useEffect(() => {
        if (rewardsModal.modalVisible) {
            if (!isFull(inventory.list)) {
                if (rewardsModal.rewards.length) {
                    dispatch(inventoryAddItems(rewardsModal.rewards));
                }
                if (rewardsModal.experience) {
                    dispatch(updateExp(userInfo.exp + rewardsModal.experience));
                }
                if (rewardsModal.shards) {
                    dispatch(
                        updateShards(userInfo.shards + rewardsModal.shards),
                    );
                }
                if (rewardsModal.gatheringExp) {
                    dispatch(
                        updateGatherExp(
                            gatherInfo.experience + rewardsModal.gatheringExp,
                        ),
                    );
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rewardsModal.modalVisible]);

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
            animationIn={'zoomIn'}
            animationOut={'fadeOut'}
            isVisible={rewardsModal.modalVisible}
            backdropTransitionOutTiming={0}
            useNativeDriver={true}>
            {/* Level Up Icon */}
            {levelUp.iconVisibility && (
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
                                {rewardsModal.title
                                    ? rewardsModal.title
                                    : strings.rewards}
                            </Text>
                            {rewardsModal.rewards.length ? (
                                <FlatList
                                    style={styles.flatList}
                                    horizontal
                                    data={rewardsModal.rewards}
                                    keyExtractor={item => item.id}
                                    renderItem={renderItem}
                                    overScrollMode={'never'}
                                />
                            ) : null}
                            {rewardsModal.rewards.length === 0 ? (
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
                                {rewardsModal.gatheringExp ? (
                                    <View style={styles.gatheringExpContainer}>
                                        <Text style={styles.gatheringExpLabel}>
                                            Gathering Experience:
                                        </Text>
                                        <Text style={styles.gatheringExpText}>
                                            {rewardsModal.gatheringExp}
                                        </Text>
                                    </View>
                                ) : null}
                                <View style={styles.shardsExpContainer}>
                                    {rewardsModal.shards ? (
                                        <Image
                                            style={styles.shardsIcon}
                                            source={getImage('icon_shards')}
                                            fadeDuration={0}
                                        />
                                    ) : null}
                                    {rewardsModal.shards ? (
                                        <Text style={styles.shardsText}>
                                            {rewardsModal.shards}
                                        </Text>
                                    ) : null}
                                    {rewardsModal.experience ? (
                                        <Text style={styles.expIcon}>
                                            {strings.xp}
                                        </Text>
                                    ) : null}
                                    {rewardsModal.experience ? (
                                        <Text style={styles.expText}>
                                            {rewardsModal.experience}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                        </View>

                        <CloseButton
                            onPress={() => {
                                dispatch(rewardsModalHide());
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
