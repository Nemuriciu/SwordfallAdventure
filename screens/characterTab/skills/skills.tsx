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
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {USER_ID} from '../../../App';
import {dynamoDb} from '../../../database';
import {SkillsDetails} from './skillsDetails.tsx';
import {getSkillImg} from '../../../parsers/skillParser.tsx';
import {SpellsModal} from './spellsModal.tsx';
import {skillsStore} from '../../../store_zustand/skillsStore.tsx';

export function Skills() {
    const skillsList = skillsStore(state => state.skillsList);
    const spell_1 = skillsStore(state => state.spell_1);
    const spell_2 = skillsStore(state => state.spell_2);
    const spell_3 = skillsStore(state => state.spell_3);
    const skillsUpdate = skillsStore(state => state.skillsUpdate);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [spellsListVisible, setSpellsListVisible] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(0);
    const didMount = useRef(2);

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
    }, [skillsList, spell_1, spell_2, spell_3]);

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
                const {skills} = unmarshall(data.Item);
                skillsUpdate(
                    skills.skillsList,
                    skills.spell_1,
                    skills.spell_2,
                    skills.spell_3,
                );
            }
        });
    }

    function updateSkillsDB() {
        const params = {
            TableName: 'users',
            Key: marshall({id: USER_ID}),
            UpdateExpression: `
            set skills.#skillsList = :skillsList,
                skills.#spell_1 = :spell_1,
                skills.#spell_2 = :spell_2,
                skills.#spell_3 = :spell_3`,
            ExpressionAttributeNames: {
                '#skillsList': 'skillsList',
                '#spell_1': 'spell_1',
                '#spell_2': 'spell_2',
                '#spell_3': 'spell_3',
            },
            ExpressionAttributeValues: marshall({
                ':skillsList': skillsList,
                ':spell_1': spell_1,
                ':spell_2': spell_2,
                ':spell_3': spell_3,
            }),
        };
        dynamoDb.updateItem(params, function (err) {
            if (err) {
                console.log(err);
            }
        });
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
        fontFamily: 'Myriad',
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
