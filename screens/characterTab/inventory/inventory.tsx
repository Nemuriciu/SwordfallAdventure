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
    getItemImg,
    getRandomEquip,
} from '../../../utils/parsers/itemParser.tsx';
import {getImage} from '../../../assets/images/_index';
import {OrangeButton} from '../../../components/orangeButton';
import {
    addItem,
    clearInventory,
    isFull,
    removeLastItem,
} from '../../../utils/inventoryArray';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {USER_ID} from '../../../App';
import {dynamoDb} from '../../../database';
import {isItem, Item} from '../../../types/item';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {updateInventory} from '../../../redux/slices/inventorySlice.tsx';
import {ItemDetails} from '../../../components/itemDetails.tsx';
import {showItemDetails} from '../../../redux/slices/itemDetailsSlice.tsx';

const COLUMN_NR = 6;

export function Inventory() {
    const inventory = useSelector((state: RootState) => state.inventory);
    const [usedSlots, setUsedSlots] = useState<number>(
        inventory.list.filter(item => isItem(item)).length,
    );
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
                dispatch(updateInventory(unmarshall(data.Item).inventory.list));
            }
        });
    }
    function updateInventoryDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: 'set inventory = :inventory',
            ExpressionAttributeValues: marshall({':inventory': inventory}),
        };
        dynamoDb.updateItem(params, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    function addItemOnPress() {
        const item = getRandomEquip('common', 1);
        if (!isFull(inventory.list)) {
            const newList = addItem(item, inventory.list);
            dispatch(updateInventory(newList));
        }
    }
    function removeItemOnPress() {
        if (usedSlots > 0) {
            const newList: (Item | {})[] = removeLastItem(inventory.list, 1);
            dispatch(updateInventory(newList));
        }
    }

    function clearInventoryList() {
        if (usedSlots > 0) {
            dispatch(updateInventory(clearInventory(inventory.list)));
        }
    }

    function slotPress(item: {} | Item, index: number) {
        if (!disabled) {
            setDisabled(true);

            dispatch(showItemDetails([item, index]));

            setTimeout(() => {
                setDisabled(false);
            }, 1000);
        }
    }

    return (
        <ImageBackground
            style={styles.container}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            <ItemDetails />
            <ImageBackground
                style={styles.innerContainer}
                source={getImage('background_inner')}
                resizeMode={'stretch'}>
                <View style={styles.infoContainer}>
                    <Image
                        style={styles.bagIcon}
                        source={getImage('icon_bag')}
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
                    <OrangeButton
                        title={'Sort'}
                        onPress={() => {}}
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
                                    }>
                                    <View>
                                        {/* eslint-disable-next-line react-native/no-inline-styles */}
                                        <Text style={{color: 'white'}} />
                                        {/* eslint-disable-next-line react-native/no-inline-styles */}
                                        <Text style={{color: 'white'}} />
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        )}
                        numColumns={COLUMN_NR}
                    />
                </View>
                {/* DEBUG */}
                <View
                    /* eslint-disable-next-line react-native/no-inline-styles */
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 16,
                    }}>
                    {/* ADD ITEM */}
                    <OrangeButton
                        title={'Add Item'}
                        onPress={addItemOnPress}
                        style={styles.button}
                    />
                    {/* REMOVE ITEM */}
                    <OrangeButton
                        title={'Remove Item'}
                        onPress={removeItemOnPress}
                        style={styles.button}
                    />
                </View>
                {/* CLEAR INVENTORY */}
                <OrangeButton
                    title={'CLEAR'}
                    onPress={clearInventoryList}
                    style={styles.clearButton}
                />
            </ImageBackground>
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
        marginBottom: 4,
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
    bagIcon: {
        aspectRatio: 1,
        width: '12.5%',
        height: undefined,
    },
    slotsText: {
        marginTop: 4,
        marginStart: 2,
        marginRight: 'auto',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
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
        marginBottom: 24,
    },
});
