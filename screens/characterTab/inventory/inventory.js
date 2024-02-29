import {
    FlatList,
    Text,
    ImageBackground,
    StyleSheet,
    View,
    Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getRandomEquip} from '../../../utils/itemParser';
import {getImage} from '../../../assets/images/_index';
import {OrangeButton} from '../../../components/orangeButton';
import {addItem, isFull, removeItemAt} from '../../../utils/inventoryArray';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {USER_ID} from '../../../App';
import {dynamoDb} from '../../../database';

const DEFAULT_SLOT_NR = 36;
const COLUMN_NR = 6;

export function Inventory() {
    const [maxSlots] = useState(DEFAULT_SLOT_NR);
    const [inventoryList, setInventoryList] = useState(
        new Array(maxSlots).fill({}),
    );
    const [usedSlots, setUsedSlots] = useState(
        inventoryList.filter(item => item).length,
    );

    useEffect(() => {
        getInventoryDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getInventoryDB = () => {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            ProjectionExpression: 'inventory',
            ReturnConsumedCapacity: 'TOTAL',
        };
        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log('GET DB\n' + err);
            } else {
                console.log('GET DB\n' + data);
                // noinspection JSCheckFunctionSignatures
                const inventory = unmarshall(data.Item).inventory;
                updateInventory(inventory);
            }
        });
    };

    const updateInventoryDB = () => {
        console.log(inventoryList);
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: 'set inventory =:newInventory',
            ExpressionAttributeValues: {
                // prettier-ignore
                ':newInventory': { 'L': inventoryList },
            },
            ReturnConsumedCapacity: 'TOTAL',
        };
        dynamoDb.updateItem(params, function (err, data) {
            if (err) {
                console.log('UPDATE DB FAILED\n' + err);
            } else {
                console.log('UPDATE DB SUCCESS\n' + data);
                // noinspection JSCheckFunctionSignatures
                const inventory = unmarshall(data.Item).inventory;
                updateInventory(inventory);
            }
        });
    };

    const updateInventory = list => {
        setInventoryList(list);
        setUsedSlots(list.filter(item => item).length);
    };

    const createListOfItems = () => {
        let list = Array.from(inventoryList);
        for (let i = 0; i < 34; i++) {
            list[i] = getRandomEquip('rarity_gray', 1);
        }
        return list;
    };

    const addItemOnPress = () => {
        const item = getRandomEquip('rarity_blue', 1);
        if (!isFull(inventoryList)) {
            const newList = addItem(item, inventoryList);
            updateInventory(newList);
            updateInventoryDB();
        }
    };

    const removeItemOnPress = () => {
        if (usedSlots > 0) {
            const newList = removeItemAt(usedSlots - 1, inventoryList, 1);
            updateInventory(newList);
        }
    };

    return (
        <ImageBackground
            style={styles.container}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            <ImageBackground
                style={styles.innerContainer}
                source={getImage('background_inner')}
                resizeMode={'stretch'}>
                <View style={styles.infoContainer}>
                    <Image
                        style={styles.bagIcon}
                        source={getImage('icon_bag')}
                    />
                    <Text style={styles.slotsText} numberOfLines={1}>
                        {usedSlots + '/' + maxSlots}
                    </Text>
                    <OrangeButton
                        title={'Sort'}
                        onPress={null}
                        style={styles.sortButton}
                    />
                </View>
                <View style={styles.inventoryContainer}>
                    <FlatList
                        style={styles.gridList}
                        data={inventoryList}
                        renderItem={({item}) => (
                            <View style={styles.item}>
                                <ImageBackground
                                    style={{
                                        width: '100%',
                                        height: undefined,
                                        aspectRatio: 1,
                                    }}
                                    source={
                                        item
                                            ? getImage(item.img)
                                            : getImage('icon_slot')
                                    }>
                                    <View style={styles.overlay}>
                                        <Text style={styles.text} />
                                        <Text style={styles.text} />
                                    </View>
                                </ImageBackground>
                            </View>
                        )}
                        numColumns={COLUMN_NR}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                {/* DEBUG */}
                <View style={{marginBottom: 24}}>
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
    gridList: {
        flex: 1,
    },
    item: {
        flex: 1,
        margin: 2,
    },
    overlay: {},
    text: {
        color: 'white',
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
        color: 'white',
        fontFamily: 'Lato_700Bold',
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
        marginBottom: 16,
    },
});
