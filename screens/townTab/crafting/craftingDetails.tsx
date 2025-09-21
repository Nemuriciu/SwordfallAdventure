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
import {Category, isItem, Item} from '../../../types/item.ts';
import {getImage} from '../../../assets/images/_index';
import {
    getItemCategory,
    getItemColor,
    getItemImg,
    getItemName,
    getItemRarity,
    getRandomEquip,
} from '../../../parsers/itemParser.tsx';
import {
    ButtonType,
    CustomButton,
} from '../../../components/buttons/customButton.tsx';
import {strings} from '../../../utils/strings.ts';
import {CloseButton} from '../../../components/buttons/closeButton.tsx';
import cloneDeep from 'lodash.clonedeep';
import {Counter} from '../../../components/counter.tsx';
import {getInventoryIndex} from '../../../utils/arrayUtils.ts';
import {getCraftingExperience} from '../../../parsers/craftingParser.tsx';
import {isQuestComplete, sortQuests} from '../../../parsers/questParser.tsx';
import {inventoryStore} from '../../../store_zustand/inventoryStore.tsx';
import {rewardsStore} from '../../../store_zustand/rewardsStore.tsx';
import {craftingDetailsStore} from '../../../store_zustand/craftingDetailsStore.tsx';
import {questsStore} from '../../../store_zustand/questsStore.tsx';

export function CraftingDetails() {
    const modalVisible = craftingDetailsStore(state => state.modalVisible);
    const materials = craftingDetailsStore(state => state.materials);
    const craftingItem = craftingDetailsStore(state => state.item);
    const craftingDetailsHide = craftingDetailsStore(
        state => state.craftingDetailsHide,
    );
    const rewardsInit = rewardsStore(state => state.rewardsInit);
    const inventoryList = inventoryStore(state => state.inventoryList);
    const inventoryRemoveItemAt = inventoryStore(
        state => state.inventoryRemoveItemAt,
    );
    const questsList = questsStore(state => state.questsList);
    const questsSetList = questsStore(state => state.questsSetList);
    const [materialsTemp, setMaterialsTemp] = useState<Item[]>([]);
    const [materialsOwned, setMaterialsOwned] = useState<number[]>([]);
    const [amount, setAmount] = useState('1');
    const [disabled, setDisabled] = useState(false);
    const didMount = useRef(1);
    const didMount_1 = useRef(2);

    useEffect(() => {
        setMaterialsTemp(cloneDeep(materials));
        updateMatsOwned();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [materials, inventoryList]);

    useEffect(() => {
        if (!didMount_1.current) {
            if (materialsTemp.length === materials.length) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [materialsOwned, materialsTemp, amount]);

    function updateMatsOwned() {
        if (!didMount.current) {
            const matsOwned = [];
            if (materials.length) {
                for (let i = 0; i < materials.length; i++) {
                    const inventoryIndex = getInventoryIndex(
                        materials[i],
                        inventoryList,
                    );
                    if (inventoryIndex !== -1) {
                        matsOwned.push(
                            (inventoryList[inventoryIndex] as Item).quantity,
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

    //TODO: Check Inventory Full
    function craftItem() {
        if (isItem(craftingItem)) {
            /* Consumables */
            if (getItemCategory(craftingItem.id) !== Category.equipment) {
                /* Add Item to Inventory */
                const _item = cloneDeep(craftingItem);
                _item.quantity = parseInt(amount, 10);
                rewardsInit([_item], 0, 0);

                /* Remove materials from Inventory */
                for (let i = 0; i < materialsTemp.length; i++) {
                    const index = getInventoryIndex(
                        materialsTemp[i],
                        inventoryList,
                    );

                    inventoryRemoveItemAt(
                        index,
                        materialsTemp[i].quantity * parseInt(amount, 10),
                    );
                }
            } else if (
                getItemCategory(craftingItem.id) === Category.equipment
            ) {
                /* Equipment */
                /* Add Items to Inventory */
                const amountNr = parseInt(amount, 10);
                const rewards = [];
                for (let i = 0; i < amountNr; i++) {
                    const equipItem = cloneDeep(craftingItem);
                    const _item = getRandomEquip(
                        getItemRarity(equipItem.id),
                        equipItem.level,
                    );
                    rewards.push(_item);
                }

                rewardsInit(
                    rewards,
                    getCraftingExperience(craftingItem.level) * rewards.length,
                    0,
                );
                /* Remove materials from Inventory */
                for (let i = 0; i < materialsTemp.length; i++) {
                    const index = getInventoryIndex(
                        materialsTemp[i],
                        inventoryList,
                    );

                    inventoryRemoveItemAt(
                        index,
                        materialsTemp[i].quantity * parseInt(amount, 10),
                    );
                }
            }
            /* Update Quests */
            const _questsList = cloneDeep(questsList);

            for (let i = 0; i < _questsList.length; i++) {
                let quest = _questsList[i];
                if (
                    quest.isActive &&
                    !isQuestComplete(quest) &&
                    quest.type === 'crafting'
                ) {
                    // TODO: Check Craft Type (Equipment/Consumable, etc.)
                    quest.progress = Math.min(
                        quest.progress + parseInt(amount, 10),
                        quest.maxProgress,
                    );
                }
            }
            sortQuests(_questsList);
            questsSetList(_questsList);
        }
    }

    // noinspection RequiredAttributes
    return (
        <Modal
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            animationOutTiming={200}
            isVisible={modalVisible}
            backdropTransitionOutTiming={0}
            useNativeDriver={true}>
            {isItem(craftingItem) && (
                <View style={styles.modalAlpha}>
                    <View style={styles.container}>
                        <ImageBackground
                            style={styles.background}
                            source={getImage('item_background_default')}
                            resizeMode={'stretch'}
                            fadeDuration={0}>
                            <View>
                                <View style={styles.topContainer}>
                                    <View style={styles.imageContainer}>
                                        <Image
                                            style={styles.image}
                                            source={getImage(
                                                getItemImg(craftingItem.id),
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
                                                            craftingItem.id,
                                                        ),
                                                    ),
                                                },
                                            ]}>
                                            {isItem(craftingItem)
                                                ? getItemName(craftingItem.id)
                                                : ''}
                                        </Text>
                                        <Text style={styles.level}>
                                            {isItem(craftingItem)
                                                ? 'Level ' + craftingItem.level
                                                : ''}
                                        </Text>
                                    </View>
                                </View>
                                <FlatList
                                    horizontal
                                    contentContainerStyle={
                                        styles.materialsListContainer
                                    }
                                    scrollEnabled={false}
                                    data={materials}
                                    keyExtractor={item => item.id}
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
                                                            materials.length
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
                                                materials.length
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
                                        type={ButtonType.Red}
                                        title={strings.craft}
                                        onPress={craftItem}
                                        style={styles.actionButton}
                                        disabled={disabled}
                                    />
                                    {/* Amount */}
                                    <Counter
                                        amount={amount}
                                        setAmount={handlerSetAmount}
                                        editable={true}
                                        min={1}
                                        max={99}
                                        style={styles.craftAmount}
                                    />
                                </View>
                                <CloseButton
                                    onPress={() => {
                                        craftingDetailsHide();
                                        setTimeout(() => {
                                            setAmount('1');
                                        }, 250);
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
    materialsListContainer: {
        flex: 1,
        marginTop: 12,
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
        fontFamily: 'Myriad',
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
