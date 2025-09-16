import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ImageBackground, Image} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store.tsx';
import {
    itemDetailsHide,
    upgradeSelectedItem,
} from '../redux/slices/itemDetailsSlice.tsx';
import {isItem, Item} from '../types/item.ts';
import {
    canConvert,
    getItemCategory,
    getItemColor,
    getItemImg,
    getItemName,
    getItemRarity,
    getItemType,
    getKey,
    getTreasureRewards,
    getTreasureShards,
    getUpgradeCost,
} from '../parsers/itemParser.tsx';
import {getImage} from '../assets/images/_index';
import {ButtonType, CustomButton} from './buttons/customButton.tsx';
import {colors} from '../utils/colors.ts';
import {getStats} from '../parsers/attributeParser.tsx';
import {CloseButton} from './buttons/closeButton.tsx';
import {
    inventoryAddItemAt,
    inventoryAddItems,
    inventoryRemoveItemAt,
    inventoryUpgradeItem,
} from '../redux/slices/inventorySlice.tsx';
import {
    equipBoots,
    equipChest,
    equipGloves,
    equipHelmet,
    equipOffhand,
    equipPants,
    equipWeapon,
    equippedItemUpgrade,
} from '../redux/slices/equipmentSlice.tsx';
import {strings} from '../utils/strings.ts';
import {
    getInventoryIndex,
    hasTreasureKey,
    isFull,
} from '../utils/arrayUtils.ts';
import Toast from 'react-native-simple-toast';
import {emptyStats, Stats} from '../types/stats.ts';
import {rewardsModalInit} from '../redux/slices/rewardsModalSlice.tsx';
import {DiscardModal} from '../screens/characterTab/inventory/discardModal.tsx';
import {updateShards} from '../redux/slices/userInfoSlice.tsx';
import {ConvertModal} from '../screens/characterTab/inventory/convertModal.tsx';

export function ItemDetails() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const itemDetails = useSelector((state: RootState) => state.itemDetails);
    const inventory = useSelector((state: RootState) => state.inventory);
    const equipment = useSelector((state: RootState) => state.equipment);
    const [equippedItem, setEquippedItem] = useState<Item | {}>({});
    const [itemStats, setItemStats] = useState<Stats>(emptyStats);
    const [equippedStats, setEquippedStats] = useState<Stats>(emptyStats);
    const [discardVisible, setDiscardVisible] = useState(false);
    const [convertVisible, setConvertVisible] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setEquippedItem({});

        if (isItem(itemDetails.item)) {
            if (getItemCategory(itemDetails.item.id) === 'equipment') {
                setItemStats(getStats(itemDetails.item));

                if (itemDetails.index !== -1) {
                    switch (getItemType(itemDetails.item.id)) {
                        case 'helmet':
                            if (isItem(equipment.helmet)) {
                                setEquippedItem(equipment.helmet);
                                setEquippedStats(getStats(equipment.helmet));
                            }
                            break;
                        case 'weapon':
                            if (isItem(equipment.weapon)) {
                                setEquippedItem(equipment.weapon);
                                setEquippedStats(getStats(equipment.weapon));
                            }
                            break;
                        case 'chest':
                            if (isItem(equipment.chest)) {
                                setEquippedItem(equipment.chest);
                                setEquippedStats(getStats(equipment.chest));
                            }
                            break;
                        case 'offhand':
                            if (isItem(equipment.offhand)) {
                                setEquippedItem(equipment.offhand);
                                setEquippedStats(getStats(equipment.offhand));
                            }
                            break;
                        case 'gloves':
                            if (isItem(equipment.gloves)) {
                                setEquippedItem(equipment.gloves);
                                setEquippedStats(getStats(equipment.gloves));
                            }
                            break;
                        case 'pants':
                            if (isItem(equipment.pants)) {
                                setEquippedItem(equipment.pants);
                                setEquippedStats(getStats(equipment.pants));
                            }
                            break;
                        case 'boots':
                            if (isItem(equipment.boots)) {
                                setEquippedItem(equipment.boots);
                                setEquippedStats(getStats(equipment.boots));
                            }
                            break;
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemDetails.item]);

    function upgradeItem() {
        if (isItem(itemDetails.item)) {
            const upgradeCost = getUpgradeCost(itemDetails.item);

            if (upgradeCost <= userInfo.shards) {
                /* Remove Shards Cost */
                dispatch(updateShards(userInfo.shards - upgradeCost));

                /* Upgrade item in Details */
                dispatch(upgradeSelectedItem());

                if (itemDetails.index !== -1) {
                    dispatch(inventoryUpgradeItem(itemDetails.index));
                } else {
                    dispatch(equippedItemUpgrade(itemDetails.item));
                }
            }
        }
    }

    function equipItem() {
        if (!disabled) {
            setDisabled(true);

            if (isItem(itemDetails.item)) {
                const type = getItemType(itemDetails.item.id);
                let itemRemoved = {};

                switch (type) {
                    case 'helmet':
                        itemRemoved = equipment.helmet;
                        dispatch(equipHelmet(itemDetails.item));
                        break;
                    case 'weapon':
                        itemRemoved = equipment.weapon;
                        dispatch(equipWeapon(itemDetails.item));
                        break;
                    case 'chest':
                        itemRemoved = equipment.chest;
                        dispatch(equipChest(itemDetails.item));
                        break;
                    case 'offhand':
                        itemRemoved = equipment.offhand;
                        dispatch(equipOffhand(itemDetails.item));
                        break;
                    case 'gloves':
                        itemRemoved = equipment.gloves;
                        dispatch(equipGloves(itemDetails.item));
                        break;
                    case 'pants':
                        itemRemoved = equipment.pants;
                        dispatch(equipPants(itemDetails.item));
                        break;
                    case 'boots':
                        itemRemoved = equipment.boots;
                        dispatch(equipBoots(itemDetails.item));
                        break;
                }

                dispatch(inventoryAddItemAt([itemRemoved, itemDetails.index]));
                dispatch(itemDetailsHide());
            }

            setTimeout(() => {
                setDisabled(false);
            }, 1000);
        }
    }

    function unequipItem() {
        if (!disabled) {
            setDisabled(true);

            if (isFull(inventory.list)) {
                //TODO: localization
                Toast.show('Inventory is full.', Toast.SHORT);
            } else {
                if (isItem(itemDetails.item)) {
                    const type = getItemType(itemDetails.item.id);
                    let itemRemoved = {};

                    switch (type) {
                        case 'helmet':
                            itemRemoved = equipment.helmet;
                            dispatch(equipHelmet({}));
                            break;
                        case 'weapon':
                            itemRemoved = equipment.weapon;
                            dispatch(equipWeapon({}));
                            break;
                        case 'chest':
                            itemRemoved = equipment.chest;
                            dispatch(equipChest({}));
                            break;
                        case 'offhand':
                            itemRemoved = equipment.offhand;
                            dispatch(equipOffhand({}));
                            break;
                        case 'gloves':
                            itemRemoved = equipment.gloves;
                            dispatch(equipGloves({}));
                            break;
                        case 'pants':
                            itemRemoved = equipment.pants;
                            dispatch(equipPants({}));
                            break;
                        case 'boots':
                            itemRemoved = equipment.boots;
                            dispatch(equipBoots({}));
                            break;
                    }

                    dispatch(inventoryAddItems([itemRemoved as Item]));
                    dispatch(itemDetailsHide());
                }
            }

            setTimeout(() => {
                setDisabled(false);
            }, 1000);
        }
    }

    function openChest() {
        if (!disabled) {
            setDisabled(true);

            if (isItem(itemDetails.item)) {
                /* Generate Rewards */
                const rewards = getTreasureRewards(
                    getItemRarity(itemDetails.item.id),
                    itemDetails.item.level,
                );
                /* Remove Key */
                const keyIndex = getInventoryIndex(
                    getKey(
                        getItemRarity(itemDetails.item.id),
                        itemDetails.item.level,
                        1,
                    ),
                    inventory.list,
                );
                dispatch(inventoryRemoveItemAt({index: keyIndex, quantity: 1}));
                /* Remove Chest */
                dispatch(
                    inventoryRemoveItemAt({
                        index: itemDetails.index,
                        quantity: 1,
                    }),
                );
                /* Show Rewards Modal */
                dispatch(
                    rewardsModalInit({
                        rewards: rewards,
                        experience: 0,
                        shards: getTreasureShards(
                            getItemRarity(itemDetails.item.id),
                        ),
                    }),
                );
                dispatch(itemDetailsHide());
            }

            setTimeout(() => {
                setDisabled(false);
            }, 1000);
        }
    }

    function consumeItem() {
        console.log('Consumable');
    }

    function convertItem() {
        if (isItem(itemDetails.item)) {
            setConvertVisible(true);
        }
    }

    function discardItem() {
        if (isItem(itemDetails.item)) {
            setDiscardVisible(true);
        }
    }

    // noinspection RequiredAttributes
    return (
        <Modal
            animationIn={'zoomIn'}
            animationOut={'fadeOut'}
            isVisible={itemDetails.modalVisible}
            backdropTransitionOutTiming={0}
            useNativeDriver={true}>
            {isItem(itemDetails.item) && (
                <DiscardModal
                    visible={discardVisible}
                    setVisible={setDiscardVisible}
                    item={itemDetails.item}
                    index={itemDetails.index}
                />
            )}
            {isItem(itemDetails.item) && (
                <ConvertModal
                    visible={convertVisible}
                    setVisible={setConvertVisible}
                    item={itemDetails.item}
                    index={itemDetails.index}
                />
            )}
            {isItem(itemDetails.item) && (
                <View style={styles.modalAlpha}>
                    <View style={styles.container}>
                        {/* Equipped Item */}
                        {isItem(equippedItem) ? (
                            <ImageBackground
                                style={styles.background}
                                source={getImage('background_details')}
                                resizeMode={'stretch'}
                                fadeDuration={0}>
                                <View>
                                    <Text style={styles.equippedTitle}>
                                        {strings.equipped}
                                    </Text>
                                    <View style={styles.topContainer}>
                                        <View style={styles.imageContainer}>
                                            <Image
                                                style={styles.image}
                                                source={getImage(
                                                    getItemImg(equippedItem.id),
                                                )}
                                                fadeDuration={0}
                                            />
                                            <Text style={styles.imageUpgrade}>
                                                {equippedItem.upgrade
                                                    ? '+' + equippedItem.upgrade
                                                    : ''}
                                            </Text>
                                        </View>
                                        <View style={styles.itemInfoContainer}>
                                            <Text
                                                style={[
                                                    styles.name,
                                                    {
                                                        color: getItemColor(
                                                            getItemRarity(
                                                                equippedItem.id,
                                                            ),
                                                        ),
                                                    },
                                                ]}>
                                                {getItemName(equippedItem.id)}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.type,
                                                    {
                                                        color: getItemColor(
                                                            getItemRarity(
                                                                equippedItem.id,
                                                            ),
                                                        ),
                                                    },
                                                ]}>
                                                {getItemRarity(
                                                    equippedItem.id,
                                                ) +
                                                    ' ' +
                                                    getItemType(
                                                        equippedItem.id,
                                                    )}
                                            </Text>
                                            <Text style={styles.level}>
                                                {'Level ' + equippedItem.level}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.separatorContainer}>
                                        <Image
                                            style={styles.separatorImage}
                                            source={getImage('icon_separator')}
                                            resizeMode={'contain'}
                                            fadeDuration={0}
                                        />
                                    </View>
                                    <View style={styles.attributesContainer}>
                                        {equippedStats.health > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.health_color,
                                                    },
                                                ]}>
                                                {equippedStats
                                                    ? equippedStats.health +
                                                          equippedStats.bonusHealth >
                                                      0
                                                        ? '+ ' +
                                                          (equippedStats.health +
                                                              equippedStats.bonusHealth) +
                                                          ' ' +
                                                          strings.health
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                        {equippedStats.physicalAtk > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.physicalAtk_color,
                                                    },
                                                ]}>
                                                {equippedStats
                                                    ? equippedStats.physicalAtk +
                                                          equippedStats.bonusPhysicalAtk >
                                                      0
                                                        ? '+ ' +
                                                          (equippedStats.physicalAtk +
                                                              equippedStats.bonusPhysicalAtk) +
                                                          ' ' +
                                                          strings.physical_atk
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                        {equippedStats.magicalAtk > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.magicalAtk_color,
                                                    },
                                                ]}>
                                                {equippedStats
                                                    ? equippedStats.magicalAtk +
                                                          equippedStats.bonusMagicalAtk >
                                                      0
                                                        ? '+ ' +
                                                          (equippedStats.magicalAtk +
                                                              equippedStats.bonusMagicalAtk) +
                                                          ' ' +
                                                          strings.magical_atk
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                        {equippedStats.physicalRes > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.physicalRes_color,
                                                    },
                                                ]}>
                                                {equippedStats
                                                    ? equippedStats.physicalRes +
                                                          equippedStats.bonusPhysicalRes >
                                                      0
                                                        ? '+ ' +
                                                          (equippedStats.physicalRes +
                                                              equippedStats.bonusPhysicalRes) +
                                                          ' ' +
                                                          strings.physical_res
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                        {equippedStats.magicalRes > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.magicalRes_color,
                                                    },
                                                ]}>
                                                {equippedStats
                                                    ? equippedStats.magicalRes +
                                                          equippedStats.bonusMagicalRes >
                                                      0
                                                        ? '+ ' +
                                                          (equippedStats.magicalRes +
                                                              equippedStats.bonusMagicalRes) +
                                                          ' ' +
                                                          strings.magical_res
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </ImageBackground>
                        ) : null}
                        {/* Selected Item */}
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
                                                getItemImg(itemDetails.item.id),
                                            )}
                                            fadeDuration={0}
                                        />
                                        <Text style={styles.imageUpgrade}>
                                            {itemDetails.item.upgrade
                                                ? '+' + itemDetails.item.upgrade
                                                : ''}
                                        </Text>
                                    </View>
                                    <View style={styles.itemInfoContainer}>
                                        <Text
                                            style={[
                                                styles.name,
                                                {
                                                    color: getItemColor(
                                                        getItemRarity(
                                                            itemDetails.item.id,
                                                        ),
                                                    ),
                                                },
                                            ]}>
                                            {isItem(itemDetails.item)
                                                ? getItemName(
                                                      itemDetails.item.id,
                                                  )
                                                : ''}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.type,
                                                {
                                                    color: getItemColor(
                                                        getItemRarity(
                                                            itemDetails.item.id,
                                                        ),
                                                    ),
                                                },
                                            ]}>
                                            {isItem(itemDetails.item)
                                                ? getItemRarity(
                                                      itemDetails.item.id,
                                                  ) +
                                                  ' ' +
                                                  getItemType(
                                                      itemDetails.item.id,
                                                  )
                                                : ''}
                                        </Text>
                                        <Text style={styles.level}>
                                            {isItem(itemDetails.item)
                                                ? 'Level ' +
                                                  itemDetails.item.level
                                                : ''}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.separatorContainer}>
                                    <Image
                                        style={styles.separatorImage}
                                        source={getImage('icon_separator')}
                                        resizeMode={'contain'}
                                        fadeDuration={0}
                                    />
                                </View>
                                {getItemCategory(itemDetails.item.id) ===
                                    'equipment' && (
                                    <View style={styles.attributesContainer}>
                                        {itemStats.health > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.health_color,
                                                    },
                                                ]}>
                                                {itemStats
                                                    ? itemStats.health +
                                                          itemStats.bonusHealth >
                                                      0
                                                        ? '+ ' +
                                                          (itemStats.health +
                                                              itemStats.bonusHealth) +
                                                          ' ' +
                                                          strings.health
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                        {itemStats.physicalAtk > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.physicalAtk_color,
                                                    },
                                                ]}>
                                                {itemStats
                                                    ? itemStats.physicalAtk +
                                                          itemStats.bonusPhysicalAtk >
                                                      0
                                                        ? '+ ' +
                                                          (itemStats.physicalAtk +
                                                              itemStats.bonusPhysicalAtk) +
                                                          ' ' +
                                                          strings.physical_atk
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                        {itemStats.magicalAtk > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.magicalAtk_color,
                                                    },
                                                ]}>
                                                {itemStats
                                                    ? itemStats.magicalAtk +
                                                          itemStats.bonusMagicalAtk >
                                                      0
                                                        ? '+ ' +
                                                          (itemStats.magicalAtk +
                                                              itemStats.bonusMagicalAtk) +
                                                          ' ' +
                                                          strings.magical_atk
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                        {itemStats.physicalRes > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.physicalRes_color,
                                                    },
                                                ]}>
                                                {itemStats
                                                    ? itemStats.physicalRes +
                                                          itemStats.bonusPhysicalRes >
                                                      0
                                                        ? '+ ' +
                                                          (itemStats.physicalRes +
                                                              itemStats.bonusPhysicalRes) +
                                                          ' ' +
                                                          strings.physical_res
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                        {itemStats.magicalRes > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.magicalRes_color,
                                                    },
                                                ]}>
                                                {itemStats
                                                    ? itemStats.magicalRes +
                                                          itemStats.bonusMagicalRes >
                                                      0
                                                        ? '+ ' +
                                                          (itemStats.magicalRes +
                                                              itemStats.bonusMagicalRes) +
                                                          ' ' +
                                                          strings.magical_res
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                    </View>
                                )}
                                <View style={styles.buttonsContainer}>
                                    {/* Upgrade Button */}
                                    {getItemCategory(itemDetails.item.id) ===
                                        'equipment' && (
                                        <View style={styles.actionButton}>
                                            <CustomButton
                                                type={ButtonType.Orange}
                                                title={strings.upgrade}
                                                onPress={upgradeItem}
                                                disabled={
                                                    disabled ||
                                                    itemDetails.item.upgrade >=
                                                        6 ||
                                                    getUpgradeCost(
                                                        itemDetails.item,
                                                    ) > userInfo.shards
                                                }
                                            />
                                            {itemDetails.item.upgrade < 6 && (
                                                <View
                                                    style={
                                                        styles.upgradeCostContainer
                                                    }>
                                                    <Image
                                                        style={
                                                            styles.shardsIcon
                                                        }
                                                        source={getImage(
                                                            'icon_shards',
                                                        )}
                                                        fadeDuration={0}
                                                    />
                                                    <Text
                                                        style={
                                                            styles.upgradeText
                                                        }>
                                                        {getUpgradeCost(
                                                            itemDetails.item,
                                                        )}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                    {/* Use/Equip/Open Button */}
                                    {getItemCategory(itemDetails.item.id) !==
                                        'resource' &&
                                        getItemCategory(itemDetails.item.id) !==
                                            'key' && (
                                            <CustomButton
                                                type={ButtonType.Orange}
                                                title={
                                                    getItemCategory(
                                                        itemDetails.item.id,
                                                    ) === 'chest'
                                                        ? strings.open
                                                        : getItemCategory(
                                                              itemDetails.item
                                                                  .id,
                                                          ) === 'consumable'
                                                        ? strings.use
                                                        : getItemCategory(
                                                              itemDetails.item
                                                                  .id,
                                                          ) === 'equipment'
                                                        ? itemDetails.index !==
                                                          -1
                                                            ? strings.equip
                                                            : strings.unequip
                                                        : ''
                                                }
                                                onPress={() => {
                                                    if (
                                                        getItemCategory(
                                                            (
                                                                itemDetails.item as Item
                                                            ).id,
                                                        ) === 'chest'
                                                    ) {
                                                        openChest();
                                                    } else if (
                                                        getItemCategory(
                                                            (
                                                                itemDetails.item as Item
                                                            ).id,
                                                        ) === 'consumable'
                                                    ) {
                                                        consumeItem();
                                                    } else if (
                                                        getItemCategory(
                                                            (
                                                                itemDetails.item as Item
                                                            ).id,
                                                        ) === 'equipment'
                                                    ) {
                                                        if (
                                                            itemDetails.index !==
                                                            -1
                                                        ) {
                                                            equipItem();
                                                        } else {
                                                            unequipItem();
                                                        }
                                                    }
                                                }}
                                                disabled={
                                                    disabled ||
                                                    (getItemCategory(
                                                        itemDetails.item.id,
                                                    ) === 'chest' &&
                                                        !hasTreasureKey(
                                                            inventory.list,
                                                            getItemRarity(
                                                                itemDetails.item
                                                                    .id,
                                                            ),
                                                            itemDetails.item
                                                                .level,
                                                        ))
                                                }
                                                style={styles.actionButton}
                                            />
                                        )}
                                    {/* Convert Button */}
                                    {itemDetails.index !== -1 &&
                                        canConvert(
                                            itemDetails.item,
                                            userInfo.level,
                                        ) && (
                                            <CustomButton
                                                type={ButtonType.Orange}
                                                title={strings.convert}
                                                onPress={convertItem}
                                                disabled={disabled}
                                                style={styles.actionButton}
                                            />
                                        )}
                                    {/* Break/Discard Button */}
                                    {itemDetails.index !== -1 && (
                                        <CustomButton
                                            type={ButtonType.Orange}
                                            title={
                                                getItemCategory(
                                                    itemDetails.item.id,
                                                ) === 'equipment'
                                                    ? strings.Break
                                                    : strings.discard
                                            }
                                            onPress={discardItem}
                                            disabled={disabled}
                                            style={styles.actionButton}
                                        />
                                    )}
                                </View>
                                <CloseButton
                                    onPress={() => {
                                        dispatch(itemDetailsHide());
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
    equippedTitle: {
        marginTop: -28,
        marginBottom: 2,
        textAlign: 'center',
        color: colors.primary,
        fontSize: 20,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
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
    imageUpgrade: {
        position: 'absolute',
        top: '7.5%',
        right: '12.5%',
        color: 'white',
        fontSize: 16,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    itemInfoContainer: {},
    name: {
        fontSize: 18,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    type: {
        marginTop: 2,
        textTransform: 'capitalize',
        fontFamily: 'Myriad_Regular',
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
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4,
        marginBottom: 20,
    },
    attributesContainer: {
        marginStart: 52,
        marginEnd: 48,
        marginBottom: 24,
    },
    attribute: {
        marginTop: 2,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    actionButton: {
        marginStart: 6,
        marginEnd: 6,
        aspectRatio: 2.5,
        width: '25%',
        marginBottom: 36,
    },
    upgradeCostContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4,
    },
    shardsIcon: {
        aspectRatio: 1,
        width: '22.5%',
        height: undefined,
    },
    upgradeText: {
        marginStart: 4,
        marginEnd: 4,
        marginTop: 1,
        color: 'white',
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
});
