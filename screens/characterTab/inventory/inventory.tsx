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
import {ButtonType, CustomButton} from '../../../components/customButton.tsx';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {USER_ID} from '../../../App';
import {dynamoDb} from '../../../database';
import {Category, isItem, Item} from '../../../types/item';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {
    inventoryAddItems,
    inventoryUpdate,
} from '../../../redux/slices/inventorySlice.tsx';
import {ItemDetails} from '../../../components/itemDetails.tsx';
import {itemDetailsShow} from '../../../redux/slices/itemDetailsSlice.tsx';
import {strings} from '../../../utils/strings.ts';
import {BreakAllModal} from './breakAllModal.tsx';
import Toast from 'react-native-simple-toast';
import cloneDeep from 'lodash.clonedeep';
import {
    areListsIdentical,
    clearInventory,
    sortInventoryList,
} from '../../../utils/arrayUtils.ts';

const COLUMN_NR = 6;

export function Inventory() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const inventory = useSelector((state: RootState) => state.inventory);
    const [usedSlots, setUsedSlots] = useState<number>(
        inventory.list.filter(item => isItem(item)).length,
    );
    const [breakAllVisible, setBreakAllVisible] = useState(false);
    const [breakAllRarity, setBreakAllRarity] = useState('');
    const [disabled, setDisabled] = useState(false);
    const didMount = useRef(2);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchInventoryDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        setUsedSlots(inventory.list.filter(item => isItem(item)).length);
        if (!didMount.current) {
            updateInventoryDB();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inventory]);

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
                dispatch(inventoryUpdate(unmarshall(data.Item).inventory.list));
            }
        });
    }

    function updateInventoryDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: 'set inventory = :val',
            ExpressionAttributeValues: marshall({':val': inventory}),
        };
        dynamoDb.updateItem(params, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    function addItemOnPress() {
        const items = [getRandomEquip('common', 3)];
        if (inventory.list.length - usedSlots > items.length) {
            dispatch(inventoryAddItems(items));
        }
    }

    function sortInventory() {
        let inventoryClone = cloneDeep(inventory.list);
        sortInventoryList(inventoryClone);

        if (!areListsIdentical(inventoryClone, inventory.list)) {
            dispatch(inventoryUpdate(inventoryClone));
        }
    }

    function clearInventoryList() {
        if (usedSlots > 0) {
            dispatch(inventoryUpdate(clearInventory(inventory.list)));
        }
    }

    function slotPress(item: {} | Item, index: number) {
        if (!disabled) {
            setDisabled(true);

            dispatch(itemDetailsShow([item, index]));

            setTimeout(() => {
                setDisabled(false);
            }, 1000);
        }
    }

    function showBreakAll(rarity: string) {
        /* Check at least one equipment exists */
        for (let i = 0; i < inventory.list.length; i++) {
            const item = inventory.list[i];
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
        Toast.show('No equipment of that rarity found.', Toast.SHORT);
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
            <ItemDetails />
            <BreakAllModal
                visible={breakAllVisible}
                setVisible={setBreakAllVisible}
                rarity={breakAllRarity}
            />
            <ImageBackground
                style={styles.innerContainer}
                source={getImage('background_inner')}
                resizeMode={'stretch'}
                fadeDuration={0}>
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
                                    usedSlots / inventory.list.length === 1
                                        ? 'red'
                                        : usedSlots / inventory.list.length >=
                                          0.8
                                        ? 'yellow'
                                        : 'white',
                            },
                        ]}>
                        {usedSlots + '/' + inventory.list.length}
                    </Text>
                    <CustomButton
                        type={ButtonType.Orange}
                        title={'Sort'}
                        onPress={sortInventory}
                        style={styles.sortButton}
                    />
                </View>

                <View style={styles.inventoryContainer}>
                    <FlatList
                        style={styles.inventoryFlatList}
                        data={inventory.list}
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
                                    {isItem(item) &&
                                    canConvert(item, userInfo.level) ? (
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
                        marginBottom: 36,
                    }}>
                    {/* ADD ITEM */}
                    <CustomButton
                        type={ButtonType.Orange}
                        title={'Add Item'}
                        onPress={addItemOnPress}
                        style={styles.button}
                    />
                    {/* CLEAR INVENTORY */}
                    <CustomButton
                        type={ButtonType.Orange}
                        title={'CLEAR'}
                        onPress={clearInventoryList}
                        style={styles.clearButton}
                    />
                </View>
            </ImageBackground>
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
    innerContainer: {
        flex: 1,
        marginTop: 4,
        marginStart: 2,
        marginEnd: 2,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 8,
        marginStart: 32,
    },
    inventoryContainer: {
        flex: 1,
        marginBottom: 8,
        marginStart: 18,
        marginEnd: 18,
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
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    inventorySlotQuantity: {
        position: 'absolute',
        bottom: 5,
        right: 6,
        color: 'white',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 5,
    },
    bagIcon: {
        aspectRatio: 1,
        width: '12.5%',
        height: undefined,
    },
    slotsText: {
        marginTop: 4,
        marginStart: 2,
        marginRight: 'auto',
        fontSize: 16,
        fontFamily: 'Myriad_Bold',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    sortButton: {
        aspectRatio: 3.5,
        width: '30%',
        justifyContent: 'flex-end',
        marginLeft: 'auto',
        marginRight: 24,
    },
    button: {
        aspectRatio: 3.5,
        width: '35%',
        alignSelf: 'center',
        marginStart: 8,
        marginEnd: 8,
    },
    clearButton: {
        aspectRatio: 3.5,
        width: '35%',
        alignSelf: 'center',
        marginStart: 8,
        marginEnd: 8,
    },
    breakContainer: {
        flexDirection: 'row',
        height: '5%',
        marginStart: 24,
        marginEnd: 16,
        marginTop: 12,
        marginBottom: 12,
    },
    breakLabel: {
        marginEnd: 'auto',
        color: 'white',
        alignSelf: 'center',
        fontSize: 16,
        fontFamily: 'Myriad_Regular',
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
