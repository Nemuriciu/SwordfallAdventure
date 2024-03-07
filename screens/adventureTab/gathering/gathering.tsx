import {FlatList, ImageBackground, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {getImage} from '../../../assets/images/_index';
import {OrangeButton} from '../../../components/orangeButton.tsx';
import {GatherNode} from '../../../components/gatherNode.tsx';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {USER_ID} from '../../../App';
import {dynamoDb} from '../../../database';
import {setGatherInfo} from '../../../redux/slices/gatherInfoSlice.tsx';
import {getNode, Node} from '../../../parsers/nodeParser.tsx';
import {rand} from '../../../parsers/itemParser.tsx';
import {RewardsModal} from '../../../components/rewardsModal.tsx';
import arrayShuffle from 'array-shuffle';

export function Gathering() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const gatherInfo = useSelector((state: RootState) => state.gatherInfo);
    const dispatch = useDispatch();
    const didMount = useRef(2);

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
        const r_herb = rand(1, 3);

        for (let i = 0; i < r_ore; i++) {
            nodeList.push(getNode(userInfo.level, 'ore'));
        }
        for (let i = 0; i < r_wood; i++) {
            nodeList.push(getNode(userInfo.level, 'wood'));
        }
        for (let i = 0; i < r_herb; i++) {
            nodeList.push(getNode(userInfo.level, 'herb'));
        }

        nodeList = arrayShuffle(nodeList);

        dispatch(
            setGatherInfo({
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
            <RewardsModal />
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
                <OrangeButton
                    style={styles.buttonStyle}
                    title={'Explore'}
                    onPress={refreshNodes}
                    disabled={gatherInfo.isGathering}
                />
                <OrangeButton
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
    innerContainer: {
        flex: 1,
        marginTop: 12,
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
