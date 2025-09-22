import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {getImage} from '../../../assets/images/_index';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {dynamoDb, USER_ID} from '../../../database';
import {getItemImg} from '../../../parsers/itemParser.tsx';
import {isItem, Item} from '../../../types/item';
import {itemDetailsStore} from '../../../store_zustand/itemDetailsStore.tsx';
import {equipmentStore} from '../../../store_zustand/equipmentStore.tsx';

export function Equipment() {
    const helmet = equipmentStore(state => state.helmet);
    const weapon = equipmentStore(state => state.weapon);
    const chest = equipmentStore(state => state.chest);
    const offhand = equipmentStore(state => state.offhand);
    const gloves = equipmentStore(state => state.gloves);
    const pants = equipmentStore(state => state.pants);
    const boots = equipmentStore(state => state.boots);
    const equipmentUpdate = equipmentStore(state => state.equipmentUpdate);
    const itemDetailsShow = itemDetailsStore(state => state.itemDetailsShow);
    const [disabled, setDisabled] = useState(false);
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
    }, [helmet, weapon, chest, offhand, gloves, pants, boots]);

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
                const {equipment} = unmarshall(data.Item);
                equipmentUpdate(
                    equipment.helmet,
                    equipment.weapon,
                    equipment.chest,
                    equipment.offhand,
                    equipment.gloves,
                    equipment.pants,
                    equipment.boots,
                );
            }
        });
    }
    function updateEquipmentDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: `
            set equipment.#helmet = :helmet,
                equipment.#weapon = :weapon,
                equipment.#chest = :chest,
                equipment.#offhand = :offhand,
                equipment.#gloves = :gloves,
                equipment.#pants = :pants,
                equipment.#boots = :boots`,
            ExpressionAttributeNames: {
                '#helmet': 'helmet',
                '#weapon': 'weapon',
                '#chest': 'chest',
                '#offhand': 'offhand',
                '#gloves': 'gloves',
                '#pants': 'pants',
                '#boots': 'boots',
            },
            ExpressionAttributeValues: marshall({
                ':helmet': helmet,
                ':weapon': weapon,
                ':chest': chest,
                ':offhand': offhand,
                ':gloves': gloves,
                ':pants': pants,
                ':boots': boots,
            }),
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

            itemDetailsShow(item, -1);

            setTimeout(() => {
                setDisabled(false);
            }, 250);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.row_1}>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => slotPress(helmet)}
                    disabled={disabled || !isItem(helmet)}>
                    <Image
                        style={styles.iconImage}
                        source={
                            isItem(helmet)
                                ? getImage(getItemImg(helmet.id))
                                : getImage('icon_helmet')
                        }
                        fadeDuration={0}
                    />
                    <Text style={styles.iconText}>
                        {isItem(helmet)
                            ? helmet.upgrade
                                ? '+' + helmet.upgrade
                                : ''
                            : ''}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row_2}>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => slotPress(weapon)}
                    disabled={disabled || !isItem(weapon)}>
                    <Image
                        style={styles.iconImage}
                        source={
                            isItem(weapon)
                                ? getImage(getItemImg(weapon.id))
                                : getImage('icon_weapon')
                        }
                        fadeDuration={0}
                    />
                    <Text style={styles.iconText}>
                        {isItem(weapon)
                            ? weapon.upgrade
                                ? '+' + weapon.upgrade
                                : ''
                            : ''}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => slotPress(chest)}
                    disabled={disabled || !isItem(chest)}>
                    <Image
                        style={styles.iconImage}
                        source={
                            isItem(chest)
                                ? getImage(getItemImg(chest.id))
                                : getImage('icon_chest')
                        }
                        fadeDuration={0}
                    />
                    <Text style={styles.iconText}>
                        {isItem(chest)
                            ? chest.upgrade
                                ? '+' + chest.upgrade
                                : ''
                            : ''}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => slotPress(offhand)}
                    disabled={disabled || !isItem(offhand)}>
                    <Image
                        style={styles.iconImage}
                        source={
                            isItem(offhand)
                                ? getImage(getItemImg(offhand.id))
                                : getImage('icon_offhand')
                        }
                        fadeDuration={0}
                    />
                    <Text style={styles.iconText}>
                        {isItem(offhand)
                            ? offhand.upgrade
                                ? '+' + offhand.upgrade
                                : ''
                            : ''}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row_3}>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => slotPress(gloves)}
                    disabled={disabled || !isItem(gloves)}>
                    <Image
                        style={styles.iconImage}
                        source={
                            isItem(gloves)
                                ? getImage(getItemImg(gloves.id))
                                : getImage('icon_gloves')
                        }
                        fadeDuration={0}
                    />
                    <Text style={styles.iconText}>
                        {isItem(gloves)
                            ? gloves.upgrade
                                ? '+' + gloves.upgrade
                                : ''
                            : ''}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => slotPress(pants)}
                    disabled={disabled || !isItem(pants)}>
                    <Image
                        style={styles.iconImage}
                        source={
                            isItem(pants)
                                ? getImage(getItemImg(pants.id))
                                : getImage('icon_pants')
                        }
                        fadeDuration={0}
                    />
                    <Text style={styles.iconText}>
                        {isItem(pants)
                            ? pants.upgrade
                                ? '+' + pants.upgrade
                                : ''
                            : ''}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => slotPress(boots)}
                    disabled={disabled || !isItem(boots)}>
                    <Image
                        style={styles.iconImage}
                        source={
                            isItem(boots)
                                ? getImage(getItemImg(boots.id))
                                : getImage('icon_boots')
                        }
                        fadeDuration={0}
                    />
                    <Text style={styles.iconText}>
                        {isItem(boots)
                            ? boots.upgrade
                                ? '+' + boots.upgrade
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
