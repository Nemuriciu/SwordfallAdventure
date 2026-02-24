import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {isItem, Item} from '../types/item.ts';
import {
    canConvert,
    getItemCategory,
    getItemColor,
    getItemDetailsBackgroundImg,
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
import {strings} from '../utils/strings.ts';
import {
    getInventoryIndex,
    hasTreasureKey,
    isFull,
} from '../utils/arrayUtils.ts';
import {emptyStats, Stats} from '../types/stats.ts';
import {DiscardModal} from '../screens/characterTab/inventory/discardModal.tsx';
import {ConvertModal} from '../screens/characterTab/inventory/convertModal.tsx';
import {itemDetailsStore} from '../store_zustand/itemDetailsStore.tsx';
import {inventoryStore} from '../store_zustand/inventoryStore.tsx';
import {rewardsStore} from '../store_zustand/rewardsStore.tsx';
import {userInfoStore} from '../store_zustand/userInfoStore.tsx';
import {equipmentStore} from '../store_zustand/equipmentStore.tsx';
import {values} from '../utils/values.ts';

export function ItemDetails() {
    const rewardsInit = rewardsStore(state => state.rewardsInit);

    const level = userInfoStore(state => state.level);
    const shards = userInfoStore(state => state.shards);
    const updateShards = userInfoStore(state => state.userInfoSetShards);

    const modalVisible = itemDetailsStore(state => state.modalVisible);
    const item = itemDetailsStore(state => state.item);
    const index = itemDetailsStore(state => state.index);
    const itemDetailsShow = itemDetailsStore(state => state.itemDetailsShow);
    const itemDetailsHide = itemDetailsStore(state => state.itemDetailsHide);
    const upgradeSelectedItem = itemDetailsStore(
        state => state.upgradeSelectedItem,
    );

    const inventoryList = inventoryStore(state => state.inventoryList);
    const inventoryUpgradeItemAt = inventoryStore(
        state => state.inventoryUpgradeItemAt,
    );
    const inventoryAddItems = inventoryStore(state => state.inventoryAddItems);
    const inventoryAddItemAt = inventoryStore(
        state => state.inventoryAddItemAt,
    );
    const inventoryRemoveMultipleItemsAt = inventoryStore(
        state => state.inventoryRemoveMultipleItemsAt,
    );

    const helmet = equipmentStore(state => state.helmet);
    const weapon = equipmentStore(state => state.weapon);
    const chest = equipmentStore(state => state.chest);
    const offhand = equipmentStore(state => state.offhand);
    const gloves = equipmentStore(state => state.gloves);
    const pants = equipmentStore(state => state.pants);
    const boots = equipmentStore(state => state.boots);
    const equipHelmet = equipmentStore(state => state.equipHelmet);
    const equipWeapon = equipmentStore(state => state.equipWeapon);
    const equipChest = equipmentStore(state => state.equipChest);
    const equipOffhand = equipmentStore(state => state.equipOffhand);
    const equipGloves = equipmentStore(state => state.equipGloves);
    const equipPants = equipmentStore(state => state.equipPants);
    const equipBoots = equipmentStore(state => state.equipBoots);
    const equippedItemUpgrade = equipmentStore(
        state => state.equippedItemUpgrade,
    );

    const [equippedItem, setEquippedItem] = useState<Item | {}>({});
    const [itemStats, setItemStats] = useState<Stats>(emptyStats);
    const [equippedStats, setEquippedStats] = useState<Stats>(emptyStats);
    const [discardVisible, setDiscardVisible] = useState(false);
    const [convertVisible, setConvertVisible] = useState(false);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setEquippedItem({});

        if (isItem(item)) {
            if (getItemCategory(item.id) === 'equipment') {
                setItemStats(getStats(item));

                if (index !== -1) {
                    switch (getItemType(item.id)) {
                        case 'helmet':
                            if (isItem(helmet)) {
                                setEquippedItem(helmet);
                                setEquippedStats(getStats(helmet));
                            }
                            break;
                        case 'weapon':
                            if (isItem(weapon)) {
                                setEquippedItem(weapon);
                                setEquippedStats(getStats(weapon));
                            }
                            break;
                        case 'chest':
                            if (isItem(chest)) {
                                setEquippedItem(chest);
                                setEquippedStats(getStats(chest));
                            }
                            break;
                        case 'offhand':
                            if (isItem(offhand)) {
                                setEquippedItem(offhand);
                                setEquippedStats(getStats(offhand));
                            }
                            break;
                        case 'gloves':
                            if (isItem(gloves)) {
                                setEquippedItem(gloves);
                                setEquippedStats(getStats(gloves));
                            }
                            break;
                        case 'pants':
                            if (isItem(pants)) {
                                setEquippedItem(pants);
                                setEquippedStats(getStats(pants));
                            }
                            break;
                        case 'boots':
                            if (isItem(boots)) {
                                setEquippedItem(boots);
                                setEquippedStats(getStats(boots));
                            }
                            break;
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item, index]);

    function upgradeItem() {
        if (isItem(item)) {
            const upgradeCost = getUpgradeCost(item);

            if (upgradeCost <= shards) {
                /* Remove Shards Cost */
                updateShards(shards - upgradeCost);

                /* Upgrade item in Details */
                upgradeSelectedItem();

                if (index !== -1) {
                    inventoryUpgradeItemAt(index);
                } else {
                    equippedItemUpgrade(item);
                }
            }
        }
    }

    function equipItem() {
        if (!disabled) {
            setDisabled(true);

            if (isItem(item)) {
                const type = getItemType(item.id);
                let itemRemoved = {};

                switch (type) {
                    case 'helmet':
                        itemRemoved = helmet;
                        equipHelmet(item);
                        break;
                    case 'weapon':
                        itemRemoved = weapon;
                        equipWeapon(item);
                        break;
                    case 'chest':
                        itemRemoved = chest;
                        equipChest(item);
                        break;
                    case 'offhand':
                        itemRemoved = offhand;
                        equipOffhand(item);
                        break;
                    case 'gloves':
                        itemRemoved = gloves;
                        equipGloves(item);
                        break;
                    case 'pants':
                        itemRemoved = pants;
                        equipPants(item);
                        break;
                    case 'boots':
                        itemRemoved = boots;
                        equipBoots(item);
                        break;
                }

                inventoryAddItemAt(itemRemoved as Item, index);

                if (isItem(itemRemoved)) {
                    itemDetailsShow(itemRemoved, index);
                } else {
                    itemDetailsHide();
                }
            }

            setTimeout(() => {
                setDisabled(false);
            }, 250);
        }
    }

    function unequipItem() {
        if (!disabled) {
            setDisabled(true);

            if (isFull(inventoryList)) {
                //TODO: localization
                // Toast.show('Inventory is full.', Toast.SHORT); TODO: Replace Toast
            } else {
                if (isItem(item)) {
                    const type = getItemType(item.id);
                    let itemRemoved = {};

                    switch (type) {
                        case 'helmet':
                            itemRemoved = helmet;
                            equipHelmet({});
                            break;
                        case 'weapon':
                            itemRemoved = weapon;
                            equipWeapon({});
                            break;
                        case 'chest':
                            itemRemoved = chest;
                            equipChest({});
                            break;
                        case 'offhand':
                            itemRemoved = offhand;
                            equipOffhand({});
                            break;
                        case 'gloves':
                            itemRemoved = gloves;
                            equipGloves({});
                            break;
                        case 'pants':
                            itemRemoved = pants;
                            equipPants({});
                            break;
                        case 'boots':
                            itemRemoved = boots;
                            equipBoots({});
                            break;
                    }

                    inventoryAddItems([itemRemoved as Item]);
                    itemDetailsHide();
                }
            }

            setTimeout(() => {
                setDisabled(false);
            }, 250);
        }
    }

    function openChest() {
        if (!disabled) {
            setDisabled(true);

            if (isItem(item)) {
                /* Generate Rewards */
                const rewards = getTreasureRewards(
                    getItemRarity(item.id),
                    item.level,
                );
                const keyIndex = getInventoryIndex(
                    getKey(getItemRarity(item.id), item.level, 1),
                    inventoryList,
                );
                /* Remove Key and Chest */
                inventoryRemoveMultipleItemsAt([keyIndex, index], [1, 1]);
                /* Show Rewards Modal */
                rewardsInit(
                    rewards,
                    0,
                    getTreasureShards(getItemRarity(item.id)),
                );
                itemDetailsHide();
            }

            setTimeout(() => {
                setDisabled(false);
            }, 250);
        }
    }

    function consumeItem() {
        console.log('Consumable');
    }

    function convertItem() {
        if (isItem(item)) {
            setConvertVisible(true);
        }
    }

    function discardItem() {
        if (isItem(item)) {
            setDiscardVisible(true);
        }
    }

    // noinspection RequiredAttributes
    return (
        <Modal
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            isVisible={modalVisible}
            backdropTransitionInTiming={1}
            backdropTransitionOutTiming={1}
            useNativeDriver={true}
            onBackdropPress={() => {
                itemDetailsHide();
            }}>
            {isItem(item) && (
                <DiscardModal
                    visible={discardVisible}
                    setVisible={setDiscardVisible}
                    item={item}
                    index={index}
                />
            )}
            {isItem(item) && (
                <ConvertModal
                    visible={convertVisible}
                    setVisible={setConvertVisible}
                    item={item}
                    index={index}
                />
            )}

            <View style={styles.modalAlpha}>
                <View style={styles.container}>
                    {/* Equipped Item */}
                    {isItem(equippedItem) ? (
                        <ImageBackground
                            style={styles.background}
                            source={getImage(
                                getItemDetailsBackgroundImg(equippedItem),
                            )}
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
                                            {getItemRarity(equippedItem.id) +
                                                ' ' +
                                                getItemType(equippedItem.id)}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.level,
                                                {
                                                    color:
                                                        getItemCategory(
                                                            equippedItem.id,
                                                        ) === 'equipment' &&
                                                        equippedItem.level >
                                                            level
                                                            ? 'red'
                                                            : 'white',
                                                },
                                            ]}>
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
                    {isItem(item) && (
                        <ImageBackground
                            style={styles.background}
                            source={getImage(getItemDetailsBackgroundImg(item))}
                            resizeMode={'stretch'}
                            fadeDuration={0}>
                            <View>
                                <View style={styles.topContainer}>
                                    <View style={styles.imageContainer}>
                                        <Image
                                            style={styles.image}
                                            source={getImage(
                                                getItemImg(item.id),
                                            )}
                                            fadeDuration={0}
                                        />
                                        <Text style={styles.imageUpgrade}>
                                            {item.upgrade
                                                ? '+' + item.upgrade
                                                : ''}
                                        </Text>
                                    </View>
                                    <View style={styles.itemInfoContainer}>
                                        <Text
                                            style={[
                                                styles.name,
                                                {
                                                    color: getItemColor(
                                                        getItemRarity(item.id),
                                                    ),
                                                },
                                            ]}>
                                            {isItem(item)
                                                ? getItemName(item.id)
                                                : ''}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.type,
                                                {
                                                    color: getItemColor(
                                                        getItemRarity(item.id),
                                                    ),
                                                },
                                            ]}>
                                            {isItem(item)
                                                ? getItemRarity(item.id) +
                                                  ' ' +
                                                  getItemType(item.id)
                                                : ''}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.level,
                                                {
                                                    color:
                                                        getItemCategory(
                                                            item.id,
                                                        ) === 'equipment' &&
                                                        item.level > level
                                                            ? 'red'
                                                            : 'white',
                                                },
                                            ]}>
                                            {isItem(item)
                                                ? 'Level ' + item.level
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
                                {getItemCategory(item.id) === 'equipment' && (
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
                                    {getItemCategory(item.id) ===
                                        'equipment' && (
                                        <View style={styles.actionButton}>
                                            <CustomButton
                                                type={ButtonType.Red}
                                                title={strings.upgrade}
                                                onPress={upgradeItem}
                                                disabled={
                                                    disabled ||
                                                    item.upgrade >= 6 ||
                                                    getUpgradeCost(item) >
                                                        shards
                                                }
                                            />
                                            {item.upgrade < 6 && (
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
                                                        {getUpgradeCost(item)}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                    {/* Use/Equip/Open Button */}
                                    {getItemCategory(item.id) !== 'resource' &&
                                        getItemCategory(item.id) !== 'key' && (
                                            <CustomButton
                                                type={ButtonType.Red}
                                                title={
                                                    getItemCategory(item.id) ===
                                                    'chest'
                                                        ? strings.open
                                                        : getItemCategory(
                                                                item.id,
                                                            ) === 'consumable'
                                                          ? strings.use
                                                          : getItemCategory(
                                                                  item.id,
                                                              ) === 'equipment'
                                                            ? index !== -1
                                                                ? strings.equip
                                                                : strings.unequip
                                                            : ''
                                                }
                                                onPress={() => {
                                                    if (
                                                        getItemCategory(
                                                            (item as Item).id,
                                                        ) === 'chest'
                                                    ) {
                                                        openChest();
                                                    } else if (
                                                        getItemCategory(
                                                            (item as Item).id,
                                                        ) === 'consumable'
                                                    ) {
                                                        consumeItem();
                                                    } else if (
                                                        getItemCategory(
                                                            (item as Item).id,
                                                        ) === 'equipment'
                                                    ) {
                                                        if (index !== -1) {
                                                            equipItem();
                                                        } else {
                                                            unequipItem();
                                                        }
                                                    }
                                                }}
                                                disabled={
                                                    disabled ||
                                                    (getItemCategory(
                                                        item.id,
                                                    ) === 'equipment' &&
                                                        item.level > level &&
                                                        index !== -1) ||
                                                    (getItemCategory(
                                                        item.id,
                                                    ) === 'chest' &&
                                                        !hasTreasureKey(
                                                            inventoryList,
                                                            getItemRarity(
                                                                item.id,
                                                            ),
                                                            item.level,
                                                        ))
                                                }
                                                style={styles.actionButton}
                                            />
                                        )}
                                    {/* Convert Button */}
                                    {isItem(item) &&
                                        canConvert(item, level) && (
                                            <CustomButton
                                                type={ButtonType.Red}
                                                title={strings.convert}
                                                onPress={convertItem}
                                                disabled={disabled}
                                                style={styles.actionButton}
                                            />
                                        )}
                                    {/* Break/Discard Button */}
                                    {isItem(item) && index !== -1 && (
                                        <CustomButton
                                            type={ButtonType.Red}
                                            title={
                                                getItemCategory(item.id) ===
                                                'equipment'
                                                    ? strings.Break
                                                    : strings.discard
                                            }
                                            onPress={discardItem}
                                            disabled={disabled}
                                            style={styles.actionButton}
                                        />
                                    )}
                                </View>
                            </View>
                        </ImageBackground>
                    )}
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
    },
    background: {
        width: '100%',
        marginBottom: 4,
    },
    equippedTitle: {
        marginTop: -32,
        marginBottom: 4,
        textAlign: 'center',
        color: colors.primary,
        fontSize: 20,
        fontFamily: values.fontBold,
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
        width: '20%',
        aspectRatio: 1,
        marginTop: 2,
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
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    itemInfoContainer: {},
    name: {
        fontSize: 16,
        fontFamily: values.fontBold,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    type: {
        textTransform: 'capitalize',
        fontFamily: values.fontRegular,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    level: {
        fontFamily: values.fontRegular,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    separatorContainer: {
        marginTop: 8,
        marginBottom: 6,
        marginStart: 24,
        marginEnd: 24,
    },
    separatorImage: {
        width: '100%',
    },
    attributesContainer: {
        marginStart: 52,
        marginEnd: 48,
        marginBottom: 16,
    },
    attribute: {
        marginTop: 2,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 8,
        marginStart: 24,
        marginEnd: 24,
        marginBottom: 24,
    },
    actionButton: {
        aspectRatio: values.button_aspect_ratio,
        width: '30%',
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
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
});
