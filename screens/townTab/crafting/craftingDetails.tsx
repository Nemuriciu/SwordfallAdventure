import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    FlatList,
    Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {craftingDetailsHide} from '../../../redux/slices/craftingDetailsSlice.tsx';
import {isItem, Item} from '../../../types/item.ts';
import {getImage} from '../../../assets/images/_index';
import {
    getItemColor,
    getItemImg,
    getItemName,
    getItemRarity,
} from '../../../parsers/itemParser.tsx';
import {ButtonType, CustomButton} from '../../../components/customButton.tsx';
import {strings} from '../../../utils/strings.ts';
import {CloseButton} from '../../../components/closeButton.tsx';
import cloneDeep from 'lodash.clonedeep';
import {Counter} from '../../../components/counter.tsx';
import {getInventoryIndex} from '../../../utils/arrayUtils.ts';

export function CraftingDetails() {
    const inventory = useSelector((state: RootState) => state.inventory);
    const craftingDetails = useSelector(
        (state: RootState) => state.craftingDetails,
    );
    const [materialsTemp, setMaterialsTemp] = useState<Item[]>([]);
    const [materialsOwned, setMaterialsOwned] = useState<number[]>([]);
    const [amount, setAmount] = useState('1');
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();
    const didMount = useRef(1);
    const didMount_1 = useRef(2);

    useEffect(() => {
        setMaterialsTemp(cloneDeep(craftingDetails.materials));
        updateMatsOwned();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [craftingDetails.materials]);

    useEffect(() => {
        if (!didMount_1.current) {
            if (materialsTemp.length === craftingDetails.materials.length) {
                for (let i = 0; i < materialsTemp.length; i++) {
                    if (
                        materialsOwned[i] <
                        materialsTemp[i].quantity *
                            (amount !== '' ? parseInt(amount, 10) : 1)
                    ) {
                        setDisabled(true);
                        return;
                    }
                }
                if (disabled) {
                    setDisabled(false);
                }
            }
        } else {
            didMount_1.current -= 1;
        }
    }, [materialsOwned, materialsTemp, amount]);

    function updateMatsOwned() {
        if (!didMount.current) {
            const matsOwned = [];
            if (craftingDetails.materials.length) {
                for (let i = 0; i < craftingDetails.materials.length; i++) {
                    const inventoryIndex = getInventoryIndex(
                        craftingDetails.materials[i],
                        inventory.list,
                    );
                    if (inventoryIndex !== -1) {
                        matsOwned.push(
                            (inventory.list[inventoryIndex] as Item).quantity,
                        );
                    } else {
                        matsOwned.push(0);
                    }
                }
            }
            setMaterialsOwned(matsOwned);
        } else {
            didMount.current -= 1;
        }
    }

    function handlerSetAmount(val: string) {
        setAmount(val);
    }

    // noinspection RequiredAttributes
    return (
        <Modal
            animationIn={'zoomIn'}
            animationOut={'fadeOut'}
            isVisible={craftingDetails.modalVisible}
            backdropTransitionOutTiming={0}
            useNativeDriver={true}>
            {isItem(craftingDetails.item) && (
                <View style={styles.modalAlpha}>
                    <View style={styles.container}>
                        <ImageBackground
                            style={styles.background}
                            source={getImage('background_details')}
                            resizeMode={'stretch'}
                            fadeDuration={0}>
                            <View>
                                <View style={styles.topContainer}>
                                    <View style={styles.imageContainer}>
                                        <Image
                                            style={styles.image}
                                            source={getImage(
                                                getItemImg(
                                                    craftingDetails.item.id,
                                                ),
                                            )}
                                            fadeDuration={0}
                                        />
                                    </View>
                                    <View>
                                        <Text
                                            style={[
                                                styles.name,
                                                {
                                                    color: getItemColor(
                                                        getItemRarity(
                                                            craftingDetails.item
                                                                .id,
                                                        ),
                                                    ),
                                                },
                                            ]}>
                                            {isItem(craftingDetails.item)
                                                ? getItemName(
                                                      craftingDetails.item.id,
                                                  )
                                                : ''}
                                        </Text>
                                        <Text style={styles.level}>
                                            {isItem(craftingDetails.item)
                                                ? 'Level ' +
                                                  craftingDetails.item.level
                                                : ''}
                                        </Text>
                                    </View>
                                </View>
                                <FlatList
                                    style={styles.flatList}
                                    contentContainerStyle={
                                        styles.flatListContent
                                    }
                                    horizontal
                                    scrollEnabled={false}
                                    data={craftingDetails.materials}
                                    keyExtractor={(item, index) =>
                                        index.toString()
                                    }
                                    renderItem={({item, index}) => (
                                        <ImageBackground
                                            style={styles.materialSlot}
                                            source={getImage(
                                                getItemImg(item.id),
                                            )}
                                            fadeDuration={0}>
                                            <Text
                                                style={[
                                                    styles.materialQuantity,
                                                    // eslint-disable-next-line react-native/no-inline-styles
                                                    {
                                                        color:
                                                            materialsTemp.length ===
                                                            craftingDetails
                                                                .materials
                                                                .length
                                                                ? materialsOwned[
                                                                      index
                                                                  ] <
                                                                  materialsTemp[
                                                                      index
                                                                  ].quantity *
                                                                      (amount !==
                                                                      ''
                                                                          ? parseInt(
                                                                                amount,
                                                                                10,
                                                                            )
                                                                          : 1)
                                                                    ? 'red'
                                                                    : 'white'
                                                                : 'white',
                                                    },
                                                ]}>
                                                {materialsTemp.length ===
                                                craftingDetails.materials.length
                                                    ? materialsOwned[index] +
                                                      '/' +
                                                      materialsTemp[index]
                                                          .quantity *
                                                          (amount !== ''
                                                              ? parseInt(
                                                                    amount,
                                                                    10,
                                                                )
                                                              : 1)
                                                    : ''}
                                            </Text>
                                        </ImageBackground>
                                    )}
                                    overScrollMode={'never'}
                                />
                                <View style={styles.separatorContainer}>
                                    <Image
                                        style={styles.separatorImage}
                                        source={getImage('icon_separator')}
                                        resizeMode={'contain'}
                                        fadeDuration={0}
                                    />
                                </View>
                                <View style={styles.buttonsContainer}>
                                    {/* Craft Button */}
                                    <CustomButton
                                        type={ButtonType.Orange}
                                        title={strings.craft}
                                        onPress={() => {}}
                                        style={styles.actionButton}
                                        disabled={disabled}
                                    />
                                    {/* Amount */}
                                    <Counter
                                        amount={amount}
                                        setAmount={handlerSetAmount}
                                        style={styles.craftAmount}
                                    />
                                </View>
                                <CloseButton
                                    onPress={() => {
                                        dispatch(craftingDetailsHide());
                                        setTimeout(() => {
                                            setAmount('1');
                                        }, 500);
                                    }}
                                    style={styles.closeButton}
                                />
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            )}
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
    },
    background: {
        width: '100%',
        marginBottom: 2,
    },
    topContainer: {
        flexDirection: 'row',
        marginTop: 24,
        marginStart: 32,
        marginEnd: 32,
    },
    imageContainer: {
        width: '22%',
        aspectRatio: 1,
        marginEnd: 12,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize: 18,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    level: {
        marginTop: 2,
        color: 'white',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    separatorContainer: {
        marginTop: 8,
        marginBottom: 8,
        marginStart: 24,
        marginEnd: 24,
    },
    separatorImage: {
        width: '100%',
    },
    flatList: {
        marginTop: 12,
    },
    flatListContent: {
        flex: 1,
        justifyContent: 'center',
    },
    materialSlot: {
        aspectRatio: 1,
        height: Dimensions.get('screen').height / 18,
        marginStart: 1,
        marginEnd: 1,
    },
    materialQuantity: {
        position: 'absolute',
        bottom: 4,
        right: 5,
        color: 'white',
        fontSize: 12,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4,
        marginBottom: 36,
    },
    actionButton: {
        marginStart: 6,
        marginEnd: 6,
        aspectRatio: 2.5,
        width: '25%',
    },
    craftAmount: {
        width: '35%',
        aspectRatio: 4.5,
    },
    closeButton: {
        position: 'absolute',
        bottom: '-5%',
        width: '10%',
        aspectRatio: 1,
        alignSelf: 'center',
    },
});
