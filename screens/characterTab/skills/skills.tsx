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
import {SkillsDetails} from './skillsDetails.tsx';
import {getSkillImg} from '../../../parsers/skillParser.tsx';
import {SpellsModal} from './spellsModal.tsx';
import {skillsStore} from '../../../store_zustand/skillsStore.tsx';
import {values} from '../../../utils/values.ts';
import {GetCommand} from '@aws-sdk/lib-dynamodb';
import {convertForDB, dynamoDB, USER_ID} from '../../../database';
import {UpdateItemCommand} from '@aws-sdk/client-dynamodb';

export function Skills() {
    const skillsList = skillsStore(state => state.skillsList);
    const spell_1 = skillsStore(state => state.spell_1);
    const spell_2 = skillsStore(state => state.spell_2);
    const spell_3 = skillsStore(state => state.spell_3);
    const skillsSetAll = skillsStore(state => state.skillsSetAll);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [spellsListVisible, setSpellsListVisible] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(0);
    const didMount = useRef(2);

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        fetchSkillsDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!didMount.current) {
            // noinspection JSIgnoredPromiseFromCall
            updateSkillsDB();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skillsList, spell_1, spell_2, spell_3]);

    async function fetchSkillsDB() {
        try {
            const command = new GetCommand({
                TableName: 'users',
                Key: {
                    id: USER_ID,
                },
                ProjectionExpression: 'skills',
            });

            // @ts-ignore
            const response = await dynamoDB.send(command);
            const {skills} = response.Item;
            skillsSetAll(
                skills.skillsList,
                skills.spell_1,
                skills.spell_2,
                skills.spell_3,
            );
        } catch (error) {
            console.error('Error fetching Skills:', error);
            throw error;
        }
    }

    async function updateSkillsDB() {
        try {
            const command = new UpdateItemCommand({
                TableName: 'users',
                Key: {
                    id: {S: USER_ID!},
                },
                UpdateExpression: 'SET skills = :skills',
                ExpressionAttributeValues: {
                    ':skills': {
                        M: {
                            skillsList: convertForDB(skillsList),
                            spell_1: convertForDB(spell_1),
                            spell_2: convertForDB(spell_2),
                            spell_3: convertForDB(spell_3),
                        },
                    },
                },
                ReturnValues: 'ALL_NEW',
            });

            // @ts-ignore
            await dynamoDB.send(command);
        } catch (error) {
            console.error('Error updating Skills:', error);
            throw error;
        }
    }

    return (
        <ImageBackground
            style={styles.outerContainer}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            <SkillsDetails />
            <SpellsModal
                visible={spellsListVisible}
                setVisible={setSpellsListVisible}
                slot={selectedSlot}
            />
            {/* Offense/Defense Buttons */}
            <ButtonGroup
                onPress={value => setSelectedIndex(value)}
                selectedIndex={selectedIndex}
                buttons={[strings.offense, strings.defense]}
                containerStyle={styles.buttonGroupContainer}
                selectedButtonStyle={styles.selectedButton}
                textStyle={styles.buttonText}
            />
            {/* Offense Skill List */}
            {skillsList && selectedIndex === 0 && (
                <ScrollView style={styles.innerContainer}>
                    <View style={styles.skillsRowContainer}>
                        <SkillsIcon
                            style={styles.skillsIconContainer}
                            skill={skillsList['100']}
                        />
                        <SkillsIcon
                            style={styles.skillsIconContainer}
                            skill={skillsList['101']}
                        />
                    </View>
                    <View style={styles.skillsRowContainer}>
                        <SkillsIcon
                            style={styles.skillsIconContainer}
                            skill={skillsList['102']}
                        />
                        <SkillsIcon
                            style={styles.skillsIconContainer}
                            skill={skillsList['103']}
                        />
                        <SkillsIcon
                            style={styles.skillsIconContainer}
                            skill={skillsList['104']}
                        />
                        <SkillsIcon
                            style={styles.skillsIconContainer}
                            skill={skillsList['105']}
                        />
                    </View>
                </ScrollView>
            )}
            {/* Defense Skill List */}
            {skillsList && selectedIndex === 1 && (
                <ScrollView style={styles.innerContainer}>
                    <View style={styles.skillsRowContainer}>
                        <SkillsIcon
                            style={styles.skillsIconContainer}
                            skill={skillsList['500']}
                        />
                        <SkillsIcon
                            style={styles.skillsIconContainer}
                            skill={skillsList['501']}
                        />
                    </View>
                    <View style={styles.skillsRowContainer}>
                        <SkillsIcon
                            style={styles.skillsIconContainer}
                            skill={skillsList['502']}
                        />
                        <SkillsIcon
                            style={styles.skillsIconContainer}
                            skill={skillsList['503']}
                        />
                        <SkillsIcon
                            style={styles.skillsIconContainer}
                            skill={skillsList['504']}
                        />
                        <SkillsIcon
                            style={styles.skillsIconContainer}
                            skill={skillsList['505']}
                        />
                    </View>
                </ScrollView>
            )}
            {/* Active Spells */}
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
                                spell_1
                                    ? getImage(getSkillImg(spell_1.id))
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
                                spell_2
                                    ? getImage(getSkillImg(spell_2.id))
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
                                spell_3
                                    ? getImage(getSkillImg(spell_3.id))
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
    outerContainer: {
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
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    selectedButton: {
        backgroundColor: colors.secondary,
    },
    innerContainer: {
        flex: 1,
        marginStart: 4,
        marginEnd: 4,
        marginTop: 2,
        marginBottom: 4,
    },
    skillsIconContainer: {
        aspectRatio: 1,
        width: '15%',
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
        marginStart: 16,
        marginEnd: 16,
        marginTop: 8,
        marginBottom: 12,
    },
    activeSpellsLabel: {
        marginEnd: 16,
        color: 'white',
        alignSelf: 'center',
        fontSize: 16,
        fontFamily: values.font,
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
