import React, {useEffect, useState} from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store.tsx';
import {hideItemDetails} from '../redux/slices/itemDetailsSlice.tsx';
import {isItem} from '../types/item.ts';
import {
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
import {addItemAt, pushItem} from '../redux/slices/inventorySlice.tsx';
import {
    equipBoots,
    equipChest,
    equipGloves,
    equipHelmet,
    equipOffhand,
    equipPants,
    equipWeapon,
} from '../redux/slices/equipmentSlice.tsx';
import {strings} from '../utils/strings.ts';
import {isFull} from '../utils/inventoryArray.ts';
import Toast from 'react-native-simple-toast';

const emptyStats = {
    health: 0,
    physicalAtk: 0,
    magicalAtk: 0,
    physicalRes: 0,
    magicalRes: 0,
    bonusHealth: 0,
    bonusPhysicalAtk: 0,
    bonusMagicalAtk: 0,
    bonusPhysicalRes: 0,
    bonusMagicalRes: 0,
};
//TODO: Equipped Item Details + Upgrade + Break
export function ItemDetails() {
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

                dispatch(addItemAt([itemRemoved, itemDetails.index]));
                dispatch(hideItemDetails());
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

                    dispatch(pushItem(itemRemoved));
                    dispatch(hideItemDetails());
                }
            }

            setTimeout(() => {
                setDisabled(false);
            }, 1000);
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
                                                      ' Health'
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
                                                      ' Physical ATK'
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
                                                      ' Magical ATK'
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
                                                      ' Physical RES'
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
                                                      ' Magical RES'
                                                    : ''
                                                : ''}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.buttonsContainer}>
                                    <OrangeButton
                                        title={strings.upgrade}
                                        onPress={() => {}}
                                        disabled={disabled}
                                        style={styles.actionButton}
                                    />
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
                                    <OrangeButton
                                        title={strings.Break}
                                        onPress={() => {}}
                                        disabled={disabled}
                                        style={styles.actionButton}
                                    />
                                </View>
                                <CloseButton
                                    onPress={() => dispatch(hideItemDetails())}
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
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
    },
    itemInfoContainer: {},
    name: {
        marginTop: 4,
        fontWeight: 'bold',
        fontSize: 16,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
    },
    type: {
        marginTop: 2,
        textTransform: 'capitalize',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
    },
    level: {
        marginTop: 2,
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
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
        justifyContent: 'center',
        marginBottom: 8,
    },
    attributesContainer: {
        marginStart: 52,
        marginEnd: 48,
        marginBottom: 24,
    },
    attribute: {
        marginTop: 2,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
    },
    actionButton: {
        aspectRatio: 2.5,
        width: '25%',
        marginStart: 6,
        marginEnd: 6,
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
