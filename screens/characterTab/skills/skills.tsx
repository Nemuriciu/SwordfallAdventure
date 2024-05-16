import {
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
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
import {getSkillImg} from '../../../parsers/skillParser.tsx';
import {SpellsModal} from './spellsModal.tsx';

export function Skills() {
    const skills = useSelector((state: RootState) => state.skills);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [spellsListVisible, setSpellsListVisible] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(0);
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
            <SpellsModal
                visible={spellsListVisible}
                setVisible={setSpellsListVisible}
                slot={selectedSlot}
            />
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
            <View style={styles.activeSpellsContainer}>
                <Text style={styles.activeSpellsLabel}>
                    {strings.active_spells + ':'}
                </Text>
                <TouchableOpacity
                    style={styles.activeSpellButton}
                    onPress={() => {
                        setSelectedSlot(1);
                        setSpellsListVisible(true);
                    }}
                    disabled={false}>
                    <ImageBackground
                        style={styles.activeSpellIcon}
                        source={getImage('skills_frame_background')}
                        resizeMode={'stretch'}
                        fadeDuration={0}>
                        <Image
                            style={styles.activeSpellImage}
                            source={
                                skills.spell_1
                                    ? getImage(getSkillImg(skills.spell_1.id))
                                    : getImage('skills_frame_background_plus')
                            }
                            resizeMode={'stretch'}
                            fadeDuration={0}
                        />
                    </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.activeSpellButton}
                    onPress={() => {
                        setSelectedSlot(2);
                        setSpellsListVisible(true);
                    }}
                    disabled={false}>
                    <ImageBackground
                        style={styles.activeSpellIcon}
                        source={getImage('skills_frame_background')}
                        resizeMode={'stretch'}
                        fadeDuration={0}>
                        <Image
                            style={styles.activeSpellImage}
                            source={
                                skills.spell_2
                                    ? getImage(getSkillImg(skills.spell_2.id))
                                    : getImage('skills_frame_background_plus')
                            }
                            resizeMode={'stretch'}
                            fadeDuration={0}
                        />
                    </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.activeSpellButton}
                    onPress={() => {
                        setSelectedSlot(3);
                        setSpellsListVisible(true);
                    }}
                    disabled={false}>
                    <ImageBackground
                        style={styles.activeSpellIcon}
                        source={getImage('skills_frame_background')}
                        resizeMode={'stretch'}
                        fadeDuration={0}>
                        <Image
                            style={styles.activeSpellImage}
                            source={
                                skills.spell_3
                                    ? getImage(getSkillImg(skills.spell_3.id))
                                    : getImage('skills_frame_background_plus')
                            }
                            resizeMode={'stretch'}
                            fadeDuration={0}
                        />
                    </ImageBackground>
                </TouchableOpacity>
            </View>
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
        width: '17.5%',
        height: undefined,
    },
    skillsRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 32,
    },
    activeSpellsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: '9%',
        marginStart: 24,
        marginEnd: 24,
        marginTop: 8,
        marginBottom: 16,
    },
    activeSpellsLabel: {
        marginEnd: 16,
        color: 'white',
        alignSelf: 'center',
        fontSize: 16,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    activeSpellButton: {
        aspectRatio: 1,
    },
    activeSpellIcon: {
        padding: 6,
    },
    activeSpellImage: {
        width: '100%',
        height: '100%',
    },
});
