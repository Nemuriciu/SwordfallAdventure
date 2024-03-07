import React, {useEffect, useState} from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store.tsx';
import {
    itemDetailsHide,
    upgradeSelectedItem,
} from '../redux/slices/itemDetailsSlice.tsx';
import {isItem, Item} from '../types/item.ts';
import {
    getItemCategory,
    getItemColor,
    getItemImg,
    getItemName,
    getItemRarity,
    getItemType,
} from '../parsers/itemParser.tsx';
import {getImage} from '../assets/images/_index';
import {OrangeButton} from './orangeButton.tsx';
import {colors} from '../utils/colors.ts';
import {getStats, Stats} from '../parsers/attributeParser.tsx';
import {CloseButton} from './closeButton.tsx';
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
import {isFull} from '../utils/arrayUtils.ts';
import Toast from 'react-native-simple-toast';
import {updateShards} from '../redux/slices/userInfoSlice.tsx';

const emptyStats = {
    health: 0,
    physicalAtk: 0,
    magicalAtk: 0,
    physicalRes: 0,
    magicalRes: 0,
    critical: 0,
    dodge: 0,
    bonusHealth: 0,
    bonusPhysicalAtk: 0,
    bonusMagicalAtk: 0,
    bonusPhysicalRes: 0,
    bonusMagicalRes: 0,
    bonusCritical: 0,
    bonusDodge: 0,
};

export function ItemDetails() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const itemDetails = useSelector((state: RootState) => state.itemDetails);
    const inventory = useSelector((state: RootState) => state.inventory);
    const equipment = useSelector((state: RootState) => state.equipment);
    const [itemStats, setItemStats] = useState<Stats>(emptyStats);
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isItem(itemDetails.item)) {
            setItemStats(getStats(itemDetails.item));
        }
    }, [itemDetails.item]);

    function upgradeItem() {
        if (isItem(itemDetails.item)) {
            if (itemDetails.item.upgrade < 6) {
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
    //TODO: removeItem quantity for quantity > 1
    function breakItem() {
        if (isItem(itemDetails.item)) {
            const shardAmount = 100;
            Alert.alert(
                //'Break ' + getItemName(itemDetails.item.id)
                '',
                'Are you sure you want to break ' +
                    getItemName(itemDetails.item.id) +
                    ' ?\n\n' +
                    ' You will receive ' +
                    shardAmount +
                    ' shards.',
                [
                    {
                        text: 'Yes',
                        onPress: () => {
                            /* Hide Item Details */
                            dispatch(itemDetailsHide());
                            /* Remove item from Inventory */
                            dispatch(inventoryRemoveItemAt(itemDetails.index));
                            /* Get Shard value from Break */
                            dispatch(updateShards(userInfo.shards + 100));
                        },
                    },
                    {
                        text: 'No',
                    },
                ],
            );
        }
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={itemDetails.modalVisible}>
            {isItem(itemDetails.item) && (
                <View style={styles.modalAlpha}>
                    <View style={styles.container}>
                        <ImageBackground
                            style={styles.background}
                            source={getImage('background_details')}
                            resizeMode={'stretch'}>
                            <View style={styles.innerContainer}>
                                <View style={styles.topContainer}>
                                    <View style={styles.imageContainer}>
                                        <Image
                                            style={styles.image}
                                            source={getImage(
                                                getItemImg(itemDetails.item.id),
                                            )}
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
                                        source={getImage('separator')}
                                        resizeMode={'contain'}
                                    />
                                </View>
                                <View style={styles.attributesContainer}>
                                    {itemStats.health > 0 && (
                                        <Text
                                            style={[
                                                styles.attribute,
                                                {color: colors.health_color},
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
                                <View style={styles.buttonsContainer}>
                                    {getItemCategory(itemDetails.item.id) ===
                                        'equipment' && (
                                        <OrangeButton
                                            title={strings.upgrade}
                                            onPress={upgradeItem}
                                            disabled={
                                                disabled ||
                                                itemDetails.item.upgrade >= 6
                                            }
                                            style={styles.actionButton}
                                        />
                                    )}
                                    {getItemCategory(itemDetails.item.id) !==
                                        'resource' && (
                                        <OrangeButton
                                            title={
                                                itemDetails.index !== -1
                                                    ? strings.equip
                                                    : strings.unequip
                                            }
                                            onPress={
                                                itemDetails.index !== -1
                                                    ? equipItem
                                                    : unequipItem
                                            }
                                            disabled={disabled}
                                            style={styles.actionButton}
                                        />
                                    )}
                                    {itemDetails.index !== -1 && (
                                        <OrangeButton
                                            title={
                                                getItemCategory(
                                                    itemDetails.item.id,
                                                ) === 'equipment'
                                                    ? strings.Break
                                                    : strings.discard
                                            }
                                            onPress={breakItem}
                                            disabled={disabled}
                                            style={styles.actionButton}
                                        />
                                    )}
                                </View>
                                <CloseButton
                                    onPress={() => dispatch(itemDetailsHide())}
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
    innerContainer: {},
    topContainer: {
        flexDirection: 'row',
        marginTop: 32,
        marginStart: 32,
        marginEnd: 32,
    },
    imageContainer: {
        width: '25%',
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
        fontSize: 18,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    itemInfoContainer: {},
    name: {
        marginTop: 4,
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
        marginTop: 12,
        marginBottom: 10,
        marginStart: 24,
        marginEnd: 24,
    },
    separatorImage: {
        width: '100%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 8,
    },
    attributesContainer: {
        marginStart: 52,
        marginEnd: 48,
        marginBottom: 24,
    },
    attribute: {
        marginTop: 2,
        fontSize: 15,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    actionButton: {
        aspectRatio: 2.5,
        width: '27.5%',
        marginBottom: 36,
    },
    closeButton: {
        position: 'absolute',
        bottom: '-5%',
        width: '10%',
        aspectRatio: 1,
        alignSelf: 'center',
    },
});
