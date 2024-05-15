import {ImageBackground, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {getImage} from '../../../assets/images/_index';
import {ButtonGroup} from '@rneui/themed';
import {strings} from '../../../utils/strings.ts';
import {colors} from '../../../utils/colors.ts';
import {SkillsIcon} from './skillsIcon.tsx';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {USER_ID} from '../../../App';
import {dynamoDb} from '../../../database';
import {skillsUpdate} from '../../../redux/slices/skillsSlice.tsx';
import {SkillsDetails} from './skillsDetails.tsx';

export function Skills() {
    const skills = useSelector((state: RootState) => state.skills);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const didMount = useRef(2);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchSkillsDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!didMount.current) {
            updateSkillsDB();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skills]);

    function fetchSkillsDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            ProjectionExpression: 'skills',
        };
        dynamoDb.getItem(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                // @ts-ignore
                dispatch(skillsUpdate(unmarshall(data.Item).skills));
            }
        });
    }

    function updateSkillsDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: 'set skills = :val',
            ExpressionAttributeValues: marshall({':val': skills}),
        };
        dynamoDb.updateItem(params, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    return (
        <ImageBackground
            style={styles.container}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            <SkillsDetails />
            <ButtonGroup
                onPress={value => setSelectedIndex(value)}
                selectedIndex={selectedIndex}
                buttons={[strings.offense, strings.defense]}
                containerStyle={styles.buttonGroupContainer}
                selectedButtonStyle={styles.selectedButton}
                textStyle={styles.buttonText}
            />
            <ImageBackground
                style={styles.outerContainer}
                source={getImage('background_inner')}
                resizeMode={'stretch'}
                fadeDuration={0}>
                {selectedIndex === 0 && (
                    <ScrollView style={styles.innerContainer}>
                        <View style={styles.skillsRowContainer}>
                            <SkillsIcon
                                style={styles.skillsIconContainer}
                                skill={skills.list['100']}
                            />
                            <SkillsIcon
                                style={styles.skillsIconContainer}
                                skill={skills.list['101']}
                            />
                        </View>
                        <View style={styles.skillsRowContainer}>
                            <SkillsIcon
                                style={styles.skillsIconContainer}
                                skill={skills.list['102']}
                            />
                            <SkillsIcon
                                style={styles.skillsIconContainer}
                                skill={skills.list['103']}
                            />
                            <SkillsIcon
                                style={styles.skillsIconContainer}
                                skill={skills.list['104']}
                            />
                            <SkillsIcon
                                style={styles.skillsIconContainer}
                                skill={skills.list['105']}
                            />
                        </View>
                    </ScrollView>
                )}
                {selectedIndex === 1 && (
                    <ScrollView style={styles.innerContainer}>
                        <View style={styles.skillsRowContainer}>
                            <SkillsIcon
                                style={styles.skillsIconContainer}
                                skill={skills.list['500']}
                            />
                            <SkillsIcon
                                style={styles.skillsIconContainer}
                                skill={skills.list['501']}
                            />
                        </View>
                        <View style={styles.skillsRowContainer}>
                            <SkillsIcon
                                style={styles.skillsIconContainer}
                                skill={skills.list['502']}
                            />
                            <SkillsIcon
                                style={styles.skillsIconContainer}
                                skill={skills.list['503']}
                            />
                            <SkillsIcon
                                style={styles.skillsIconContainer}
                                skill={skills.list['504']}
                            />
                            <SkillsIcon
                                style={styles.skillsIconContainer}
                                skill={skills.list['505']}
                            />
                        </View>
                    </ScrollView>
                )}
            </ImageBackground>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonGroupContainer: {
        marginTop: 12,
        marginStart: 32,
        marginEnd: 32,
        backgroundColor: 'transparent',
    },
    buttonText: {
        alignSelf: 'stretch',
        textAlign: 'center',
        color: colors.primary,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    selectedButton: {
        backgroundColor: colors.secondary,
    },
    outerContainer: {
        flex: 1,
        marginStart: 4,
        marginEnd: 4,
        marginTop: 2,
        marginBottom: 4,
    },
    innerContainer: {
        flex: 1,
        marginStart: 24,
        marginEnd: 24,
        marginTop: 18,
        marginBottom: 12,
    },
    skillsIconContainer: {
        aspectRatio: 1,
        width: '18.5%',
        height: undefined,
    },
    skillsRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 32,
    },
});
