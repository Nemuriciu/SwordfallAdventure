import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {getImage} from '../../../assets/images/_index';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {dynamoDb} from '../../../database';
import {USER_ID} from '../../../App';
import {getItemImg} from '../../../parsers/itemParser.tsx';
import {isItem, Item} from '../../../types/item';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {equipmentUpdate} from '../../../redux/slices/equipmentSlice.tsx';
import {itemDetailsShow} from '../../../redux/slices/itemDetailsSlice.tsx';

export function Equipment() {
    const equipment = useSelector((state: RootState) => state.equipment);
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();
    const didMount = useRef(2);

    useEffect(() => {
        fetchEquipmentDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!didMount.current) {
            updateEquipmentDB();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [equipment]);

    function fetchEquipmentDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            ProjectionExpression: 'equipment',
        };
        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // @ts-ignore
                dispatch(equipmentUpdate(unmarshall(data.Item).equipment));
            }
        });
    }
    function updateEquipmentDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: 'set equipment = :val',
            ExpressionAttributeValues: marshall({':val': equipment}),
        };
        dynamoDb.updateItem(params, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    function slotPress(item: Item | {}) {
        if (!disabled) {
            setDisabled(true);

            dispatch(itemDetailsShow([item, -1]));

            setTimeout(() => {
                setDisabled(false);
            }, 300);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.row_1}>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => slotPress(equipment.helmet)}
                    disabled={disabled || !isItem(equipment.helmet)}>
                    <Image
                        style={styles.iconImage}
                        source={
                            isItem(equipment.helmet)
                                ? getImage(getItemImg(equipment.helmet.id))
                                : getImage('icon_helmet')
                        }
                    />
                    <Text style={styles.iconText}>
                        {isItem(equipment.helmet)
                            ? equipment.helmet.upgrade
                                ? '+' + equipment.helmet.upgrade
                                : ''
                            : ''}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row_2}>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => slotPress(equipment.weapon)}
                    disabled={disabled || !isItem(equipment.weapon)}>
                    <Image
                        style={styles.iconImage}
                        source={
                            isItem(equipment.weapon)
                                ? getImage(getItemImg(equipment.weapon.id))
                                : getImage('icon_weapon')
                        }
                    />
                    <Text style={styles.iconText}>
                        {isItem(equipment.weapon)
                            ? equipment.weapon.upgrade
                                ? '+' + equipment.weapon.upgrade
                                : ''
                            : ''}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => slotPress(equipment.chest)}
                    disabled={disabled || !isItem(equipment.chest)}>
                    <Image
                        style={styles.iconImage}
                        source={
                            isItem(equipment.chest)
                                ? getImage(getItemImg(equipment.chest.id))
                                : getImage('icon_chest')
                        }
                    />
                    <Text style={styles.iconText}>
                        {isItem(equipment.chest)
                            ? equipment.chest.upgrade
                                ? '+' + equipment.chest.upgrade
                                : ''
                            : ''}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => slotPress(equipment.offhand)}
                    disabled={disabled || !isItem(equipment.offhand)}>
                    <Image
                        style={styles.iconImage}
                        source={
                            isItem(equipment.offhand)
                                ? getImage(getItemImg(equipment.offhand.id))
                                : getImage('icon_offhand')
                        }
                    />
                    <Text style={styles.iconText}>
                        {isItem(equipment.offhand)
                            ? equipment.offhand.upgrade
                                ? '+' + equipment.offhand.upgrade
                                : ''
                            : ''}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row_3}>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => slotPress(equipment.gloves)}
                    disabled={disabled || !isItem(equipment.gloves)}>
                    <Image
                        style={styles.iconImage}
                        source={
                            isItem(equipment.gloves)
                                ? getImage(getItemImg(equipment.gloves.id))
                                : getImage('icon_gloves')
                        }
                    />
                    <Text style={styles.iconText}>
                        {isItem(equipment.gloves)
                            ? equipment.gloves.upgrade
                                ? '+' + equipment.gloves.upgrade
                                : ''
                            : ''}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => slotPress(equipment.pants)}
                    disabled={disabled || !isItem(equipment.pants)}>
                    <Image
                        style={styles.iconImage}
                        source={
                            isItem(equipment.pants)
                                ? getImage(getItemImg(equipment.pants.id))
                                : getImage('icon_pants')
                        }
                    />
                    <Text style={styles.iconText}>
                        {isItem(equipment.pants)
                            ? equipment.pants.upgrade
                                ? '+' + equipment.pants.upgrade
                                : ''
                            : ''}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => slotPress(equipment.boots)}
                    disabled={disabled || !isItem(equipment.boots)}>
                    <Image
                        style={styles.iconImage}
                        source={
                            isItem(equipment.boots)
                                ? getImage(getItemImg(equipment.boots.id))
                                : getImage('icon_boots')
                        }
                    />
                    <Text style={styles.iconText}>
                        {isItem(equipment.boots)
                            ? equipment.boots.upgrade
                                ? '+' + equipment.boots.upgrade
                                : ''
                            : ''}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    iconContainer: {
        width: '15%',
        aspectRatio: 1,
        marginStart: 2,
        marginEnd: 2,
    },
    iconImage: {
        width: '100%',
        height: '100%',
    },
    iconText: {
        position: 'absolute',
        top: '5%',
        right: '10%',
        fontSize: 16,
        color: 'white',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    row_1: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    row_2: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4,
    },
    row_3: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4,
        marginBottom: 16,
    },
});
