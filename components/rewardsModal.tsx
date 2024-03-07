import React, {useEffect} from 'react';
import {
    Modal,
    StyleSheet,
    View,
    ImageBackground,
    FlatList,
    Text,
    Image,
    Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store.tsx';
import {getImage} from '../assets/images/_index';
import {CloseButton} from './closeButton.tsx';
import {setRewardsModalVisible} from '../redux/slices/rewardsModalSlice.tsx';
import {getItemImg} from '../parsers/itemParser.tsx';
import {strings} from '../utils/strings.ts';
import {isFull} from '../utils/arrayUtils.ts';
import {inventoryAddItems} from '../redux/slices/inventorySlice.tsx';
import {updateShards} from '../redux/slices/userInfoSlice.tsx';
import {colors} from '../utils/colors.ts';

export function RewardsModal() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const inventory = useSelector((state: RootState) => state.inventory);
    const rewardsModal = useSelector((state: RootState) => state.rewardsModal);
    const dispatch = useDispatch();

    useEffect(() => {
        if (rewardsModal.modalVisible) {
            if (!isFull(inventory.list)) {
                dispatch(inventoryAddItems(rewardsModal.rewards));
                dispatch(updateShards(userInfo.shards + 100)); //TODO:
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rewardsModal]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={rewardsModal.modalVisible}>
            <View style={styles.modalAlpha}>
                <View style={styles.container}>
                    <ImageBackground
                        style={styles.background}
                        source={getImage('background_details')}
                        resizeMode={'stretch'}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.title}>{strings.rewards}</Text>
                            <FlatList
                                style={styles.flatList}
                                horizontal
                                data={rewardsModal.rewards}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item}) => (
                                    <ImageBackground
                                        style={styles.rewardSlot}
                                        source={getImage(getItemImg(item.id))}>
                                        <Text style={styles.rewardQuantity}>
                                            {item.quantity > 1
                                                ? item.quantity
                                                : ''}
                                        </Text>
                                    </ImageBackground>
                                )}
                                overScrollMode={'never'}
                            />
                            <Image
                                style={styles.separator}
                                source={getImage('separator')}
                            />
                            <View style={styles.shardsContainer}>
                                <Image
                                    style={styles.shardsIcon}
                                    source={getImage('icon_shards')}
                                />
                                <Text style={styles.shardsText}>100</Text>
                            </View>
                        </View>

                        <CloseButton
                            onPress={() =>
                                dispatch(setRewardsModalVisible(false))
                            }
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
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
    separator: {
        width: '100%',
    },
    shardsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 24,
    },
    shardsIcon: {
        aspectRatio: 1,
        width: '8.5%',
        height: undefined,
    },
    shardsText: {
        marginStart: 4,
        marginTop: 2,
        alignSelf: 'center',
        fontSize: 18,
        color: colors.primary,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    closeButton: {
        position: 'absolute',
        bottom: '-5%',
        width: '10%',
        aspectRatio: 1,
        alignSelf: 'center',
    },
});
