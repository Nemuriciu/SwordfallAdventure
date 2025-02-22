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
import {ButtonType, CustomButton} from '../../../components/customButton.tsx';
import {GatherNode} from './gatherNode.tsx';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {USER_ID} from '../../../App';
import {dynamoDb} from '../../../database';
import {
    increaseGatherLevel,
    setGatherInfo,
} from '../../../redux/slices/gatherInfoSlice.tsx';
import {getNode, Node} from '../../../parsers/nodeParser.tsx';
import {rand} from '../../../parsers/itemParser.tsx';
import arrayShuffle from 'array-shuffle';
import ProgressBar from '../../../components/progressBar.tsx';
import experienceJson from '../../../assets/json/experience.json';
import {colors} from '../../../utils/colors.ts';

export function Gathering() {
    // const userInfo = useSelector((state: RootState) => state.userInfo);
    const gatherInfo = useSelector((state: RootState) => state.gatherInfo);
    const dispatch = useDispatch();
    const didMount = useRef(2);
    // TODO: Gathering level up and experience/gather
    useEffect(() => {
        fetchGatherInfoDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!didMount.current) {
            updateGatherInfoDB();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gatherInfo]);

    useEffect(() => {
        const maxExp = experienceJson.gatheringMaxExp[gatherInfo.level - 1];
        if (gatherInfo.experience >= maxExp) {
            dispatch(increaseGatherLevel(gatherInfo.experience - maxExp));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gatherInfo.experience]);

    function fetchGatherInfoDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            ProjectionExpression: 'gatherInfo',
        };
        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // @ts-ignore
                dispatch(setGatherInfo(unmarshall(data.Item).gatherInfo));
            }
        });
    }

    function updateGatherInfoDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: 'set gatherInfo = :val',
            ExpressionAttributeValues: marshall({':val': gatherInfo}),
        };
        dynamoDb.updateItem(params, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    function refreshNodes() {
        let nodeList: Node[] = [];

        const r_ore = rand(1, 3);
        const r_wood = rand(1, 3);
        const r_herb = rand(1, 2);

        for (let i = 0; i < r_ore; i++) {
            nodeList.push(getNode('ore', gatherInfo.level));
        }
        for (let i = 0; i < r_wood; i++) {
            nodeList.push(getNode('wood', gatherInfo.level));
        }
        for (let i = 0; i < r_herb; i++) {
            nodeList.push(getNode('herb', gatherInfo.level));
        }

        nodeList = arrayShuffle(nodeList);

        dispatch(
            setGatherInfo({
                level: gatherInfo.level,
                experience: gatherInfo.experience,
                isGathering: gatherInfo.isGathering,
                nodeIndex: gatherInfo.nodeIndex,
                timestamp: gatherInfo.timestamp,
                nodes: nodeList,
            }),
        );
    }

    /*DEBUG*/
    function finish() {
        if (gatherInfo.isGathering) {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            dispatch(
                setGatherInfo({
                    level: gatherInfo.level,
                    experience: gatherInfo.experience,
                    isGathering: gatherInfo.isGathering,
                    nodeIndex: gatherInfo.nodeIndex,
                    timestamp: date.toISOString(),
                    nodes: gatherInfo.nodes,
                }),
            );
        }
    }

    return (
        <ImageBackground
            style={styles.container}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            <View style={styles.experienceBarContainer}>
                <Text style={styles.experienceLabel}>Gathering Level</Text>
                <Text style={styles.experienceValue}>{gatherInfo.level}</Text>
                <ProgressBar
                    progress={
                        gatherInfo.experience /
                        experienceJson.gatheringMaxExp[gatherInfo.level - 1]
                    }
                    image={'progress_bar_orange'}
                    style={styles.experienceBar}
                />
                <Text style={styles.experienceLabel}>
                    {gatherInfo.experience}/
                    {experienceJson.gatheringMaxExp[gatherInfo.level - 1]}
                </Text>
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
                    style={styles.nodesList}
                    data={gatherInfo.nodes}
                    keyExtractor={(_item, index) => index.toString()}
                    renderItem={({item, index}) => (
                        <GatherNode node={item} index={index} />
                    )}
                    overScrollMode={'never'}
                />
            </ImageBackground>
            <View style={styles.buttonsContainer}>
                <CustomButton
                    type={ButtonType.Orange}
                    style={styles.buttonStyle}
                    title={'Explore'}
                    onPress={refreshNodes}
                    disabled={gatherInfo.isGathering}
                />
                <CustomButton
                    type={ButtonType.Orange}
                    style={styles.buttonStyle}
                    title={'Finish'}
                    onPress={finish}
                />
            </View>
        </ImageBackground>
    );
}

// @ts-ignore
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    experienceBarContainer: {
        flex: 0.1,
        flexDirection: 'row',
        marginStart: 16,
        marginEnd: 16,
    },
    experienceLabel: {
        marginEnd: 8,
        alignSelf: 'center',
        color: colors.experience_color,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    experienceValue: {
        marginStart: 4,
        marginEnd: 6,
        marginBottom: 2,
        alignSelf: 'center',
        fontSize: 22,
        color: colors.experience_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    experienceBar: {
        flex: 1,
        marginTop: 16,
        marginBottom: 16,
    },
    infoIcon: {
        marginStart: 16,
        alignSelf: 'center',
        aspectRatio: 1,
        width: '7.5%',
        height: undefined,
    },
    innerContainer: {
        flex: 1,
        marginBottom: 8,
        marginStart: 8,
        marginEnd: 8,
    },
    nodesList: {
        marginTop: 8,
        marginBottom: 8,
        marginStart: 2,
        marginEnd: 2,
    },
    buttonsContainer: {
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    buttonStyle: {
        aspectRatio: 3.5,
        width: '35%',
    },
});
