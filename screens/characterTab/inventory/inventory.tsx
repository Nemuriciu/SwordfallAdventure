import {
    FlatList,
    Text,
    ImageBackground,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
    canConvert,
    getItemCategory,
    getItemImg,
    getItemRarity,
    getRandomEquip,
} from '../../../parsers/itemParser.tsx';
import {getImage} from '../../../assets/images/_index';
import {
    ButtonType,
    CustomButton,
} from '../../../components/buttons/customButton.tsx';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {dynamoDb, USER_ID} from '../../../database';
import {Category, isItem, Item} from '../../../types/item';
import {strings} from '../../../utils/strings.ts';
import {BreakAllModal} from './breakAllModal.tsx';
import cloneDeep from 'lodash.clonedeep';
import {
    areListsIdentical,
    clearInventory,
    sortInventoryList,
} from '../../../utils/arrayUtils.ts';
import {itemDetailsStore} from '../../../store_zustand/itemDetailsStore.tsx';
import {inventoryStore} from '../../../store_zustand/inventoryStore.tsx';
import {userInfoStore} from '../../../store_zustand/userInfoStore.tsx';
import {values} from '../../../utils/values.ts';

const COLUMN_NR = 7;

export function Inventory() {
    const level = userInfoStore(state => state.level);

    const inventoryList = inventoryStore(state => state.inventoryList);
    const inventoryUpdate = inventoryStore(state => state.inventoryUpdate);
    const inventoryAddItems = inventoryStore(state => state.inventoryAddItems);
    const [usedSlots, setUsedSlots] = useState<number>(
        inventoryList.filter(item => isItem(item)).length,
    );

    const [breakAllVisible, setBreakAllVisible] = useState(false);
    const [breakAllRarity, setBreakAllRarity] = useState('');
    const [disabled, setDisabled] = useState(false);
    const didMount = useRef(2);

    const itemShow = itemDetailsStore(state => state.itemDetailsShow);

    useEffect(() => {
        fetchInventoryDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        setUsedSlots(inventoryList.filter(item => isItem(item)).length);
        if (!didMount.current) {
            updateInventoryDB();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inventoryList]);

    function fetchInventoryDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            ProjectionExpression: 'inventory',
        };
        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // @ts-ignore
                inventoryUpdate(unmarshall(data.Item).inventory.inventoryList);
            }
        });
    }

    function updateInventoryDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: 'set inventory.inventoryList = :val',
            ExpressionAttributeValues: marshall({':val': inventoryList}),
        };
        dynamoDb.updateItem(params, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    function addItemOnPress() {
        const items = [getRandomEquip('common', level)];
        if (inventoryList.length - usedSlots > items.length) {
            inventoryAddItems(items);
        }
    }

    function sortInventory() {
        let inventoryClone = cloneDeep(inventoryList);
        sortInventoryList(inventoryClone);

        if (!areListsIdentical(inventoryClone, inventoryList)) {
            inventoryUpdate(inventoryClone);
        }
    }

    function clearInventoryList() {
        if (usedSlots > 0) {
            inventoryUpdate(clearInventory(inventoryList));
        }
    }

    function slotPress(item: {} | Item, index: number) {
        if (!disabled) {
            setDisabled(true);
            // dispatch(itemDetailsShow([item, index]));

            itemShow(item, index);

            setTimeout(() => {
                setDisabled(false);
            }, 250);
        }
    }

    function showBreakAll(rarity: string) {
        /* Check at least one equipment exists */
        for (let i = 0; i < inventoryList.length; i++) {
            const item = inventoryList[i];
            if (isItem(item)) {
                if (
                    getItemCategory(item.id) === Category.equipment &&
                    getItemRarity(item.id) === rarity
                ) {
                    setBreakAllRarity(rarity);
                    setBreakAllVisible(true);
                    return;
                }
            }
        }
        //TODO: localization
        // Toast.show('No equipment of that rarity found.', Toast.SHORT); TODO: Replace Toast
    }

    const breakButton = (image: string, onPress: () => void) => {
        return (
            <TouchableOpacity style={styles.breakButton} onPress={onPress}>
                <Image
                    style={styles.breakButtonImage}
                    source={getImage(image)}
                    resizeMode={'stretch'}
                    fadeDuration={0}
                />
            </TouchableOpacity>
        );
    };

    return (
        <ImageBackground
            style={styles.container}
            source={getImage('background_outer')}
            resizeMode={'stretch'}
            fadeDuration={0}>
            <BreakAllModal
                visible={breakAllVisible}
                setVisible={setBreakAllVisible}
                rarity={breakAllRarity}
            />
            {/* Inventory Info + Sort */}
            <View style={styles.infoContainer}>
                <Image
                    style={styles.bagIcon}
                    source={getImage('icon_bag')}
                    fadeDuration={0}
                />
                <Text
                    numberOfLines={1}
                    style={[
                        styles.slotsText,
                        // eslint-disable-next-line react-native/no-inline-styles
                        {
                            color:
                                usedSlots / inventoryList.length === 1
                                    ? 'red'
                                    : usedSlots / inventoryList.length >= 0.8
                                      ? 'yellow'
                                      : 'white',
                        },
                    ]}>
                    {usedSlots + '/' + inventoryList.length}
                </Text>
                <CustomButton
                    type={ButtonType.Red}
                    title={'Sort'}
                    onPress={sortInventory}
                    style={styles.sortButton}
                />
            </View>
            {/* Inventory */}
            <View style={styles.inventoryContainer}>
                <FlatList
                    style={styles.inventoryFlatList}
                    data={inventoryList}
                    renderItem={({item, index}) => (
                        <TouchableOpacity
                            onPress={() => slotPress(item, index)}
                            disabled={disabled || !isItem(item)}
                            style={styles.inventorySlotContainer}>
                            <ImageBackground
                                style={styles.inventorySlot}
                                source={
                                    isItem(item)
                                        ? getImage(getItemImg(item.id))
                                        : getImage('icon_slot')
                                }
                                fadeDuration={0}>
                                {isItem(item) && canConvert(item, level) ? (
                                    <Image
                                        style={styles.inventorySlotConvert}
                                        source={getImage('icon_convert')}
                                        resizeMode={'stretch'}
                                    />
                                ) : null}
                                <Text style={styles.inventorySlotUpgrade}>
                                    {isItem(item) && item.upgrade
                                        ? '+' + item.upgrade
                                        : ''}
                                </Text>
                                <Text style={styles.inventorySlotQuantity}>
                                    {isItem(item) && item.quantity > 1
                                        ? item.quantity
                                        : ''}
                                </Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    )}
                    numColumns={COLUMN_NR}
                    overScrollMode={'never'}
                />
            </View>
            {/* DEBUG */}
            <View
                /* eslint-disable-next-line react-native/no-inline-styles */
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 8,
                }}>
                {/* ADD ITEM */}
                <CustomButton
                    type={ButtonType.Red}
                    title={'Add Item'}
                    onPress={addItemOnPress}
                    style={styles.debugButton}
                />
                {/* CLEAR INVENTORY */}
                <CustomButton
                    type={ButtonType.Red}
                    title={'Clear'}
                    onPress={clearInventoryList}
                    style={styles.debugButton}
                />
            </View>
            {/* Equipment Break */}
            <View style={styles.breakContainer}>
                <Text style={styles.breakLabel}>
                    {strings.equipment + ' ' + strings.Break + ':'}
                </Text>
                {breakButton('icon_break_common', () => showBreakAll('common'))}
                {breakButton('icon_break_uncommon', () =>
                    showBreakAll('uncommon'),
                )}
                {breakButton('icon_break_rare', () => showBreakAll('rare'))}
                {breakButton('icon_break_epic', () => showBreakAll('epic'))}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 4,
        marginStart: 32,
    },
    inventoryContainer: {
        flex: 1,
        // marginBottom: 4,
        marginStart: 12,
        marginEnd: 12,
    },
    inventoryFlatList: {
        flex: 1,
    },
    inventorySlotContainer: {
        flex: 1,
        margin: 2,
    },
    inventorySlot: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    inventorySlotConvert: {
        position: 'absolute',
        top: 2,
        left: 4,
        aspectRatio: 0.5,
        width: undefined,
        height: '60%',
    },
    inventorySlotUpgrade: {
        position: 'absolute',
        top: 4,
        right: 6,
        color: 'white',
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    inventorySlotQuantity: {
        position: 'absolute',
        bottom: 5,
        right: 6,
        color: 'white',
        fontSize: 13,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 5,
    },
    bagIcon: {
        aspectRatio: 1,
        width: '12%',
        height: undefined,
    },
    slotsText: {
        marginTop: 2,
        marginStart: 2,
        marginRight: 'auto',
        fontFamily: values.fontBold,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    sortButton: {
        aspectRatio: values.button_aspect_ratio,
        width: '25%',
        justifyContent: 'flex-end',
        marginLeft: 'auto',
        marginRight: 28,
    },
    debugButton: {
        aspectRatio: values.button_aspect_ratio,
        width: '25%',
        alignSelf: 'center',
        marginStart: 16,
        marginEnd: 16,
    },
    breakContainer: {
        flexDirection: 'row',
        height: '5%',
        marginStart: 24,
        marginEnd: 16,
        marginTop: 32,
        marginBottom: 12,
    },
    breakLabel: {
        marginEnd: 'auto',
        color: 'white',
        alignSelf: 'center',
        fontSize: 16,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    breakButton: {},
    breakButtonImage: {
        marginStart: 2,
        marginEnd: 8,
        aspectRatio: 1.25,
        height: '100%',
        width: undefined,
    },
});
