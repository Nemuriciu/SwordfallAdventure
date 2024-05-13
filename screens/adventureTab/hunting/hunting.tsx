import {
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
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

export function Hunting() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const hunting = useSelector((state: RootState) => state.hunting);
    const dispatch = useDispatch();
    const didMount = useRef(1);

    useEffect(() => {
        fetchHuntingDB();
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
        let creatureList: Creature[] = [];

        for (let i = 0; i < 4; i++) {
            //TODO:
            creatureList.push(getCreature(userInfo.level, depth));
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

        for (let i = 0; i < 4; i++) {
            //TODO:
            creatureList.push(getCreature(userInfo.level, depth));
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
            <View style={styles.topContainer}>
                <Text style={styles.depthText}>{'Depth ' + hunting.depth}</Text>
                <Image
                    style={styles.infoIcon}
                    source={getImage('icon_info')}
                    resizeMode={'stretch'}
                />
            </View>
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
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 6,
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
