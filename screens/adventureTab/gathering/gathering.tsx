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
import {
    ButtonType,
    CustomButton,
} from '../../../components/buttons/customButton.tsx';
import {GatherNode} from './gatherNode.tsx';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {dynamoDb, USER_ID} from '../../../database';
import {getNode, Node} from '../../../parsers/nodeParser.tsx';
import {rand} from '../../../parsers/itemParser.tsx';
import arrayShuffle from 'array-shuffle';
import ProgressBar from '../../../components/progressBar.tsx';
import experienceJson from '../../../assets/json/experience.json';
import {colors} from '../../../utils/colors.ts';
import {gatheringStore} from '../../../store_zustand/gatheringStore.tsx';
import {values} from '../../../utils/values.ts';

export function Gathering() {
    const gatherLevel = gatheringStore(state => state.level);
    const gatherExp = gatheringStore(state => state.exp);
    const isGathering = gatheringStore(state => state.isGathering);
    const nodeIndex = gatheringStore(state => state.nodeIndex);
    const gatherTimestamp = gatheringStore(state => state.timestamp);
    const nodes = gatheringStore(state => state.nodes);
    const setGatherInfo = gatheringStore(state => state.setGatherInfo);
    const didMount = useRef(2);

    useEffect(() => {
        fetchGatheringDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!didMount.current) {
            updateGatheringDB();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        gatherLevel,
        gatherExp,
        isGathering,
        nodeIndex,
        gatherTimestamp,
        nodes,
    ]);

    function fetchGatheringDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            ProjectionExpression: 'gathering',
        };
        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // @ts-ignore
                const {gathering} = unmarshall(data.Item);
                setGatherInfo(
                    gathering.level,
                    gathering.experience,
                    gathering.isGathering,
                    gathering.nodeIndex,
                    gathering.timestamp,
                    gathering.nodes,
                );
            }
        });
    }

    function updateGatheringDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: `
            set gathering.#experience = :experience,
                gathering.#isGathering = :isGathering,
                gathering.#level = :level,
                gathering.#nodeIndex = :nodeIndex,
                gathering.#nodes = :nodes,
                gathering.#timestamp = :timestamp`,
            ExpressionAttributeNames: {
                '#experience': 'experience',
                '#isGathering': 'isGathering',
                '#level': 'level',
                '#nodeIndex': 'nodeIndex',
                '#nodes': 'nodes',
                '#timestamp': 'timestamp',
            },
            ExpressionAttributeValues: marshall({
                ':experience': gatherExp,
                ':isGathering': isGathering,
                ':level': gatherLevel,
                ':nodeIndex': nodeIndex,
                ':nodes': nodes,
                ':timestamp': gatherTimestamp,
            }),
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
            nodeList.push(getNode('ore', gatherLevel));
        }
        for (let i = 0; i < r_wood; i++) {
            nodeList.push(getNode('wood', gatherLevel));
        }
        for (let i = 0; i < r_herb; i++) {
            nodeList.push(getNode('herb', gatherLevel));
        }

        nodeList = arrayShuffle(nodeList);

        setGatherInfo(
            gatherLevel,
            gatherExp,
            isGathering,
            nodeIndex,
            gatherTimestamp,
            nodeList,
        );
    }

    /*DEBUG*/
    function finish() {
        if (isGathering) {
            const date = new Date();
            date.setDate(date.getDate() - 1);

            setGatherInfo(
                gatherLevel,
                gatherExp,
                isGathering,
                nodeIndex,
                date.toISOString(),
                nodes,
            );
        }
    }

    return (
        <ImageBackground
            style={styles.outerContainer}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            {/* Gathering Experience */}
            <View style={styles.experienceBarContainer}>
                <Text style={styles.experienceLabel}>Gathering Level</Text>
                <Text style={styles.experienceValue}>{gatherLevel}</Text>
                <ProgressBar
                    progress={
                        gatherExp /
                        experienceJson.gatheringMaxExp[gatherLevel - 1]
                    }
                    image={'progress_bar_orange'}
                    style={styles.experienceBar}
                />
                <Text style={styles.experienceLabel}>
                    {gatherExp}/
                    {experienceJson.gatheringMaxExp[gatherLevel - 1]}
                </Text>
                <Image
                    style={styles.infoIcon}
                    source={getImage('icon_info')}
                    resizeMode={'stretch'}
                />
            </View>
            {/* Nodes List */}
            <FlatList
                style={styles.nodesList}
                data={nodes}
                keyExtractor={(_item, index) => index.toString()}
                renderItem={({item, index}) => (
                    <GatherNode node={item} index={index} />
                )}
                overScrollMode={'never'}
            />
            {/* Gathering Buttons */}
            <View style={styles.buttonsContainer}>
                <CustomButton
                    type={ButtonType.Red}
                    style={styles.buttonStyle}
                    title={'Explore'}
                    onPress={refreshNodes}
                    disabled={isGathering}
                />
                <CustomButton
                    type={ButtonType.Red}
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
    outerContainer: {
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
        fontFamily: values.fontRegular,
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
        fontFamily: values.font,
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
    nodesList: {
        //TODO: margins
        flex: 1,
        marginTop: 8,
        marginBottom: 8,
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
