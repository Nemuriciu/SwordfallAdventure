import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getImage} from '../../../assets/images/_index';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {dynamoDb} from '../../../database';
import {USER_ID} from '../../../App';

export function Equipment() {
    const [helmet, setHelmet] = useState(null);
    const [chest, setChest] = useState(null);
    const [pants, setPants] = useState(null);
    const [weapon, setWeapon] = useState(null);
    const [offhand, setOffhand] = useState(null);
    const [gloves, setGloves] = useState(null);
    const [boots, setBoots] = useState(null);

    const fetchEquipment = () => {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            ProjectionExpression: 'equipment',
        };
        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // noinspection JSCheckFunctionSignatures
                const equipment = unmarshall(data.Item).equipment;
                setHelmet(equipment.helmet);
                setChest(equipment.chest);
                setPants(equipment.pants);
                setWeapon(equipment.weapon);
                setOffhand(equipment.offhand);
                setGloves(equipment.gloves);
                setBoots(equipment.boots);
            }
        });
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.row_1}>
                <Image
                    style={styles.icon}
                    source={
                        helmet ? getImage(helmet.img) : getImage('icon_helmet')
                    }
                />
            </View>
            <View style={styles.row_2}>
                {/*TODO:*/}
                <ImageBackground
                    style={styles.back}
                    source={
                        weapon ? getImage(weapon.img) : getImage('icon_weapon')
                    }>
                    <View style={styles.textView}>
                        <Text style={styles.text} />
                    </View>
                </ImageBackground>
                <Image
                    style={styles.icon}
                    source={
                        chest ? getImage(chest.img) : getImage('icon_chest')
                    }
                />
                <Image
                    style={styles.icon}
                    source={
                        offhand
                            ? getImage(offhand.img)
                            : getImage('icon_offhand')
                    }
                />
            </View>
            <View style={styles.row_3}>
                <Image
                    style={styles.icon}
                    source={
                        gloves ? getImage(gloves.img) : getImage('icon_gloves')
                    }
                />
                <Image
                    style={styles.icon}
                    source={
                        pants ? getImage(pants.img) : getImage('icon_pants')
                    }
                />
                <Image
                    style={styles.icon}
                    source={
                        boots ? getImage(boots.img) : getImage('icon_boots')
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    icon: {
        aspectRatio: 1,
        width: '17%',
        height: undefined,
        alignSelf: 'center',
        marginStart: 2,
        marginEnd: 2,
    },
    back: {
        aspectRatio: 1,
    },
    textView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    text: {
        marginTop: 4,
        marginEnd: 4,
        textAlign: 'right',
        color: 'white',
        fontSize: 16,
        //fontFamily: 'Lato_400Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    enhancementText: {
        width: '40%',
        aspectRatio: 1,
    },
    row_1: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    row_2: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4,
    },
    row_3: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 2,
        marginBottom: 8,
    },
});
