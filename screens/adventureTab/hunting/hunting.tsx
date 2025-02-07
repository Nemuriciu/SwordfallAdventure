import {
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {getImage} from '../../../assets/images/_index';
import {colors} from '../../../utils/colors.ts';
import {CreatureCard} from './creatureCard.tsx';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {Creature} from '../../../types/creature.ts';
import {getCreature} from '../../../parsers/creatureParser.tsx';
import {huntingUpdate} from '../../../redux/slices/huntingSlice.tsx';
import {ButtonType, CustomButton} from '../../../components/customButton.tsx';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {USER_ID} from '../../../App';
import {dynamoDb} from '../../../database';
import {strings} from '../../../utils/strings.ts';
import {rand} from '../../../parsers/itemParser.tsx';
import {Slider} from '@miblanchard/react-native-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CREATURE_COUNT_MIN = 5;
export const CREATURE_COUNT_MAX = 7;

export function Hunting() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const hunting = useSelector((state: RootState) => state.hunting);
    const [creatureLevel, setCreatureLevel] = useState(0);
    const dispatch = useDispatch();
    const didMount = useRef(1);
    const didMount_1 = useRef(1);

    useEffect(() => {
        fetchHuntingDB();
        // noinspection JSIgnoredPromiseFromCall
        fetchAsyncStorage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!didMount.current) {
            updateHuntingDB();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hunting]);
    useEffect(() => {
        if (!didMount_1.current) {
            if (creatureLevel <= 0) {
                setCreatureLevel(userInfo.level);
                // noinspection JSIgnoredPromiseFromCall
                setStorageCreatureLevel(userInfo.level);
            }
        } else {
            didMount_1.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo.level]);

    async function fetchAsyncStorage() {
        try {
            const level = await AsyncStorage.getItem('creatureLevelSlider');
            if (level !== null) {
                setCreatureLevel(parseInt(level as string, 10));
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function setStorageCreatureLevel(level: number) {
        try {
            await AsyncStorage.setItem('creatureLevelSlider', level.toString());
        } catch (e) {
            console.error(e);
        }
    }

    function fetchHuntingDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            ProjectionExpression: 'hunting',
        };
        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // @ts-ignore
                dispatch(huntingUpdate(unmarshall(data.Item).hunting));
            }
        });
    }

    function updateHuntingDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: 'set hunting = :val',
            ExpressionAttributeValues: marshall({':val': hunting}),
        };
        dynamoDb.updateItem(params, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    function goDeeper() {
        const depth = hunting.depth + 1;
        const creatureList: Creature[] = [];

        for (let i = 0; i < rand(CREATURE_COUNT_MIN, CREATURE_COUNT_MAX); i++) {
            creatureList.push(getCreature(creatureLevel, depth));
        }

        dispatch(
            huntingUpdate({
                depth: depth,
                creatureList: creatureList,
                killCount: 0,
            }),
        );
    }

    function resetDepth() {
        const depth = 0;
        let creatureList: Creature[] = [];

        for (let i = 0; i < rand(CREATURE_COUNT_MIN, CREATURE_COUNT_MAX); i++) {
            creatureList.push(getCreature(creatureLevel, depth));
        }

        dispatch(
            huntingUpdate({
                depth: depth,
                creatureList: creatureList,
                killCount: 0,
            }),
        );
    }

    return (
        <ImageBackground
            style={styles.container}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            {/* Depth */}
            <View style={styles.depthContainer}>
                <Text style={styles.depthText}>{'Depth ' + hunting.depth}</Text>
                <Image
                    style={styles.infoIcon}
                    source={getImage('icon_info')}
                    resizeMode={'stretch'}
                />
            </View>
            {/* Creature Level Slider */}
            {userInfo.level > 1 && (
                <View style={styles.creatureLevelContainer}>
                    <Text style={styles.creatureLevelText}>
                        Creature Level: {creatureLevel}
                    </Text>
                    <Slider
                        value={creatureLevel}
                        step={1}
                        minimumValue={1}
                        maximumValue={userInfo.level ? userInfo.level : 1}
                        minimumTrackTintColor={colors.primary}
                        onValueChange={level => {
                            setCreatureLevel(level[0]);
                        }}
                        onSlidingComplete={level => {
                            // noinspection JSIgnoredPromiseFromCall
                            setStorageCreatureLevel(level[0]);
                        }}
                        containerStyle={styles.creatureSliderContainer}
                        thumbStyle={styles.sliderThumb}
                    />
                </View>
            )}
            <ImageBackground
                style={styles.innerContainer}
                source={getImage('background_inner')}
                resizeMode={'stretch'}>
                <FlatList
                    style={styles.creatureList}
                    data={hunting.creatureList} //hunting.creatureList
                    keyExtractor={(_item, index) => index.toString()}
                    renderItem={({item, index}) => (
                        <CreatureCard creature={item} index={index} />
                    )}
                    overScrollMode={'never'}
                />
            </ImageBackground>
            <View style={styles.buttonContainer}>
                <CustomButton
                    type={ButtonType.Orange}
                    style={styles.button}
                    title={strings.back}
                    onPress={goDeeper}
                />
                <CustomButton
                    type={ButtonType.Orange}
                    style={styles.button}
                    title={strings.go_deeper}
                    disabled={hunting.killCount < 3}
                    onPress={goDeeper}
                />
                {/* TODO: disable button on depth 0 */}
                <CustomButton
                    type={ButtonType.Orange}
                    style={styles.button}
                    title={strings.reset}
                    onPress={resetDepth}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    depthContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 4,
    },
    depthText: {
        width: '100%',
        textAlign: 'center',
        fontSize: 20,
        color: colors.primary,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    infoIcon: {
        position: 'absolute',
        right: 16,
        aspectRatio: 1,
        width: '7.5%',
        height: undefined,
    },
    creatureLevelContainer: {
        flexDirection: 'row',
        marginStart: 12,
        marginEnd: 12,
    },
    creatureLevelText: {
        width: '35%',
        textAlign: 'center',
        alignSelf: 'center',
        color: colors.primary,
        fontSize: 16,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    creatureSliderContainer: {
        flex: 1,
        marginStart: 12,
    },
    sliderThumb: {
        backgroundColor: 'white',
    },
    thumbValue: {
        color: colors.primary,
        fontSize: 16,
        fontFamily: 'Myriad_Bold',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    innerContainer: {
        flex: 1,
        marginTop: 6,
        marginBottom: 8,
        marginStart: 8,
        marginEnd: 8,
    },
    creatureList: {
        marginTop: 8,
        marginBottom: 8,
        marginStart: 2,
        marginEnd: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginStart: 8,
        marginEnd: 8,
        marginBottom: 8,
    },
    button: {
        aspectRatio: 3,
        width: '30%',
    },
});
