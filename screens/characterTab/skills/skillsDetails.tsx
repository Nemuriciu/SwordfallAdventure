/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {getImage} from '../../../assets/images/_index';
import {ButtonType, CustomButton} from '../../../components/customButton.tsx';
import {strings} from '../../../utils/strings.ts';
import {CloseButton} from '../../../components/closeButton.tsx';
import {
    getSkillCooldown,
    getSkillDescription,
    getSkillImg,
    getSkillMaxPoints,
    getSkillName,
    getSkillPrimaryEffect,
    getSkillSecondaryEffect,
} from '../../../parsers/skillParser.tsx';
import {
    skillsDetailsHide,
    skillsDetailsUpdateSkill,
} from '../../../redux/slices/skillsDetailsSlice.tsx';
import {colors} from '../../../utils/colors.ts';
import cloneDeep from 'lodash.clonedeep';
import {Skill} from '../../../types/skill.ts';
import {skillsUpdateSkill} from '../../../redux/slices/skillsSlice.tsx';
import {updateSkillPoints} from '../../../redux/slices/userInfoSlice.tsx';
import SpannableBuilder from '@mj-studio/react-native-spannable-string';

interface props {
    description: string;
    primaryEffect: number[] | undefined;
    secondaryEffect: number[] | undefined;
    next: boolean;
}

export function SkillsDetails() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const skillsDetails = useSelector(
        (state: RootState) => state.skillsDetails,
    );
    const [pointsAvailable, setPointsAvailable] = useState(0);
    const [pointsSpent, setPointsSpent] = useState(0);
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();
    SpannableBuilder.getInstanceWithComponent(Text);

    useEffect(() => {
        if (skillsDetails.skill !== null) {
            setPointsSpent(skillsDetails.skill.points);
            setPointsAvailable(userInfo.skillPoints);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skillsDetails.skill]);

    function addPoints() {
        if (skillsDetails.skill) {
            if (
                pointsAvailable > 0 &&
                pointsSpent !== getSkillMaxPoints(skillsDetails.skill.id)
            ) {
                setPointsSpent(pointsSpent + 1);
                setPointsAvailable(pointsAvailable - 1);
            }
        }
    }

    function removePoints() {
        if (skillsDetails.skill) {
            if (pointsSpent > 0) {
                setPointsSpent(pointsSpent - 1);
                setPointsAvailable(pointsAvailable + 1);
            }
        }
    }

    function applyPoints() {
        if (!disabled) {
            setDisabled(true);
            const skill = cloneDeep(skillsDetails.skill) as Skill;
            skill.points = pointsSpent;
            /* Update Player Available Skill Points */
            dispatch(updateSkillPoints(pointsAvailable));
            /* Update Skill Points spent */
            setTimeout(() => {
                dispatch(skillsUpdateSkill([skill.id, skill]));
            }, 100);
            /* Update Selected Skill */
            setTimeout(() => {
                dispatch(skillsDetailsUpdateSkill(skill));
            }, 200);
            setTimeout(() => {
                setDisabled(false);
            }, 400);
        }
    }

    const CooldownText = () => {
        return SpannableBuilder.getInstance(styles.cooldown)
            .appendColored(strings.cooldown + ': ', colors.dex_color)
            .append(
                getSkillCooldown((skillsDetails.skill as Skill).id) + ' turns',
            )
            .build();
    };

    const Description = ({
        description,
        primaryEffect,
        secondaryEffect,
        next,
    }: props) => {
        /* Add PrimaryEffect and SecondaryEffect to Description */
        if (primaryEffect) {
            description = description.replaceAll(
                '{PE}',
                next
                    ? Math.fround(primaryEffect[pointsSpent] * 100).toString()
                    : Math.fround(
                          primaryEffect[pointsSpent - 1] * 100,
                      ).toString(),
            );
        }
        if (secondaryEffect) {
            description = description.replaceAll(
                '{SE}',
                next
                    ? Math.fround(secondaryEffect[pointsSpent] * 100).toString()
                    : Math.fround(
                          secondaryEffect[pointsSpent - 1] * 100,
                      ).toString(),
            );
        }

        let spannableBuilder = SpannableBuilder.getInstance(styles.description);
        /* Split description in array of substrings with matching keywords */
        //TODO: add more keywords
        const substrings = [
            'Physical ATK',
            'Magical ATK',
            'Physical RES',
            'Magical RES',
            'bleeding',
            'burning',
            'poison',
        ];
        const splitDescription: string[] = [];
        let remainingStr = description;

        while (remainingStr) {
            const nextOccurrence = findNextOccurrence(remainingStr, substrings);
            if (nextOccurrence) {
                const {index, substring} = nextOccurrence;
                if (index !== 0) {
                    splitDescription.push(remainingStr.slice(0, index));
                }
                splitDescription.push(substring);
                remainingStr = remainingStr.slice(index + substring.length);
            } else {
                splitDescription.push(remainingStr);
                break;
            }
        }

        for (const key in splitDescription) {
            const str = splitDescription[key];
            if (substrings.includes(str)) {
                switch (str) {
                    case 'Physical ATK':
                        spannableBuilder.appendColored(
                            str,
                            colors.physicalAtk_color,
                        );
                        break;
                    case 'Magical ATK':
                        spannableBuilder.appendColored(
                            str,
                            colors.magicalAtk_color,
                        );
                        break;
                    case 'Physical RES':
                        spannableBuilder.appendColored(
                            str,
                            colors.physicalRes_color,
                        );
                        break;
                    case 'Magical RES':
                        spannableBuilder.appendColored(
                            str,
                            colors.magicalRes_color,
                        );
                        break;
                    case 'bleeding':
                        spannableBuilder.appendColored(
                            str,
                            colors.bleeding_color,
                        );
                        break;
                    case 'burning':
                        spannableBuilder.appendColored(
                            str,
                            colors.burning_color,
                        );
                        break;
                    case 'poison':
                        spannableBuilder.appendColored(
                            str,
                            colors.poison_color,
                        );
                        break;
                }
            } else {
                spannableBuilder.append(str);
            }
        }

        return spannableBuilder.build();
    };

    /* Function to find the next occurrence of the substrings */
    const findNextOccurrence = (
        str: string,
        subStrs: string[],
    ): {index: number; substring: string} | null => {
        let minIndex = -1;
        let foundSubstring = '';

        for (const subStr of subStrs) {
            const index = str.indexOf(subStr);
            if (index !== -1 && (minIndex === -1 || index < minIndex)) {
                minIndex = index;
                foundSubstring = subStr;
            }
        }

        return minIndex !== -1
            ? {index: minIndex, substring: foundSubstring}
            : null;
    };

    // noinspection RequiredAttributes
    return (
        <Modal
            animationIn={'zoomIn'}
            animationOut={'fadeOut'}
            isVisible={skillsDetails.modalVisible}
            backdropTransitionOutTiming={0}
            useNativeDriver={true}>
            <View style={styles.modalAlpha}>
                <View style={styles.container}>
                    {skillsDetails.skill && (
                        <ImageBackground
                            style={styles.background}
                            source={getImage('background_details')}
                            resizeMode={'stretch'}
                            fadeDuration={0}>
                            <View>
                                <View style={styles.topContainer}>
                                    <View style={styles.imageContainer}>
                                        <ImageBackground
                                            source={getImage(
                                                'skills_frame_background',
                                            )}
                                            resizeMode={'contain'}
                                            fadeDuration={0}
                                            style={styles.frame}>
                                            <Image
                                                source={getImage(
                                                    getSkillImg(
                                                        skillsDetails.skill.id,
                                                    ),
                                                )}
                                                resizeMode={'stretch'}
                                                fadeDuration={0}
                                                style={styles.image}
                                            />
                                        </ImageBackground>
                                    </View>
                                    <View>
                                        <Text style={styles.name}>
                                            {getSkillName(
                                                skillsDetails.skill.id,
                                            )}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.rank,
                                                {
                                                    color:
                                                        pointsSpent !==
                                                        skillsDetails.skill
                                                            .points
                                                            ? 'yellow'
                                                            : 'white',
                                                },
                                            ]}>
                                            {'Rank  ' +
                                                pointsSpent +
                                                ' / ' +
                                                getSkillMaxPoints(
                                                    skillsDetails.skill.id,
                                                )}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.descriptionContainer}>
                                    {pointsSpent > 0 && (
                                        <Description
                                            description={getSkillDescription(
                                                skillsDetails.skill.id,
                                            )}
                                            primaryEffect={getSkillPrimaryEffect(
                                                skillsDetails.skill.id,
                                            )}
                                            secondaryEffect={getSkillSecondaryEffect(
                                                skillsDetails.skill.id,
                                            )}
                                            next={false}
                                        />
                                    )}
                                    {pointsSpent <
                                        getSkillMaxPoints(
                                            skillsDetails.skill.id,
                                        ) && (
                                        <ImageBackground
                                            style={styles.nextRankImage}
                                            source={getImage(
                                                'skills_details_next_rank',
                                            )}
                                            resizeMode={'stretch'}
                                            fadeDuration={0}>
                                            <Text
                                                style={
                                                    styles.nextRankDescription
                                                }>
                                                {strings.next_rank}
                                            </Text>
                                        </ImageBackground>
                                    )}
                                    {pointsSpent <
                                        getSkillMaxPoints(
                                            skillsDetails.skill.id,
                                        ) && (
                                        <Description
                                            description={getSkillDescription(
                                                skillsDetails.skill.id,
                                            )}
                                            primaryEffect={getSkillPrimaryEffect(
                                                skillsDetails.skill.id,
                                            )}
                                            secondaryEffect={getSkillSecondaryEffect(
                                                skillsDetails.skill.id,
                                            )}
                                            next={true}
                                        />
                                    )}
                                    {skillsDetails.skill &&
                                        getSkillCooldown(
                                            skillsDetails.skill.id,
                                        ) && <CooldownText />}
                                </View>
                                <View style={styles.separatorContainer}>
                                    <Image
                                        style={styles.separatorImage}
                                        source={getImage('icon_separator')}
                                        resizeMode={'contain'}
                                        fadeDuration={0}
                                    />
                                </View>
                                <View style={styles.buttonsContainer}>
                                    {/* Apply Button */}
                                    <CustomButton
                                        type={ButtonType.Orange}
                                        title={strings.apply}
                                        onPress={applyPoints}
                                        style={styles.actionButton}
                                        disabled={
                                            disabled
                                                ? true
                                                : skillsDetails.skill.points ===
                                                  pointsSpent
                                        }
                                    />
                                    {/* Points Spent */}
                                    <View style={styles.pointsContainer}>
                                        {/* Points */}
                                        <View
                                            style={styles.spentPointsContainer}>
                                            <ImageBackground
                                                style={
                                                    styles.spentPointsBackground
                                                }
                                                source={getImage(
                                                    'background_crafting_amount',
                                                )}
                                                resizeMode={'stretch'}
                                                fadeDuration={0}>
                                                <View
                                                    style={
                                                        styles.spentPointsInnerContainer
                                                    }>
                                                    <TouchableOpacity
                                                        style={
                                                            styles.arrowContainer
                                                        }
                                                        onPress={removePoints}
                                                        activeOpacity={1}
                                                        disabled={
                                                            pointsSpent <= 0
                                                        }>
                                                        <Image
                                                            style={
                                                                styles.leftArrow
                                                            }
                                                            source={
                                                                pointsSpent <= 0
                                                                    ? getImage(
                                                                          'icon_left_arrow_disabled',
                                                                      )
                                                                    : getImage(
                                                                          'icon_left_arrow',
                                                                      )
                                                            }
                                                            resizeMode={
                                                                'stretch'
                                                            }
                                                            fadeDuration={0}
                                                        />
                                                    </TouchableOpacity>
                                                    <TextInput
                                                        style={[
                                                            styles.spentPointsInput,
                                                            {
                                                                color:
                                                                    pointsSpent !==
                                                                    skillsDetails
                                                                        .skill
                                                                        .points
                                                                        ? 'yellow'
                                                                        : 'white',
                                                            },
                                                        ]}
                                                        value={pointsSpent.toString()}
                                                        editable={false}
                                                        maxLength={getSkillMaxPoints(
                                                            skillsDetails.skill
                                                                .id,
                                                        )}
                                                    />
                                                    <TouchableOpacity
                                                        style={
                                                            styles.arrowContainer
                                                        }
                                                        onPress={addPoints}
                                                        activeOpacity={1}
                                                        disabled={
                                                            pointsAvailable <=
                                                                0 ||
                                                            pointsSpent ===
                                                                getSkillMaxPoints(
                                                                    skillsDetails
                                                                        .skill
                                                                        .id,
                                                                )
                                                        }>
                                                        <Image
                                                            style={
                                                                styles.rightArrow
                                                            }
                                                            source={
                                                                pointsAvailable <=
                                                                    0 ||
                                                                pointsSpent ===
                                                                    getSkillMaxPoints(
                                                                        skillsDetails
                                                                            .skill
                                                                            .id,
                                                                    )
                                                                    ? getImage(
                                                                          'icon_right_arrow_disabled',
                                                                      )
                                                                    : getImage(
                                                                          'icon_right_arrow',
                                                                      )
                                                            }
                                                            resizeMode={
                                                                'stretch'
                                                            }
                                                            fadeDuration={0}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </ImageBackground>
                                        </View>
                                        <Text
                                            style={styles.availablePointsText}
                                            adjustsFontSizeToFit={true}
                                            numberOfLines={1}>
                                            {strings.points +
                                                ':  ' +
                                                pointsAvailable}
                                        </Text>
                                    </View>
                                </View>
                                <CloseButton
                                    onPress={() => {
                                        dispatch(skillsDetailsHide());
                                    }}
                                    style={styles.closeButton}
                                />
                            </View>
                        </ImageBackground>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalAlpha: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        width: '100%',
        marginBottom: 2,
    },
    topContainer: {
        flexDirection: 'row',
        marginTop: 24,
        marginStart: 32,
        marginEnd: 32,
    },
    imageContainer: {
        width: '22%',
        aspectRatio: 1,
        marginEnd: 12,
    },
    frame: {
        padding: 6,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    name: {
        marginTop: 4,
        marginStart: 4,
        color: 'white',
        fontSize: 16,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    rank: {
        marginTop: 2,
        marginStart: 4,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    descriptionContainer: {
        alignItems: 'center',
        marginTop: 16,
        marginStart: 36,
        marginEnd: 36,
    },
    description: {
        marginBottom: 12,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    nextRankImage: {
        marginBottom: 12,
    },
    nextRankDescription: {
        aspectRatio: 5,
        margin: 2,
        textAlign: 'center',
        color: colors.primary,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    cooldown: {
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    separatorContainer: {
        marginTop: 8,
        marginBottom: 8,
        marginStart: 24,
        marginEnd: 24,
    },
    separatorImage: {
        width: '100%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4,
        marginBottom: 36,
    },
    pointsContainer: {
        width: '37.%',
    },
    spentPointsBackground: {
        width: '100%',
    },
    spentPointsInnerContainer: {
        flexDirection: 'row',
    },
    arrowContainer: {
        aspectRatio: 1,
        width: '25%',
        height: undefined,
    },
    textInputContainer: {},
    spentPointsInput: {
        flex: 1,
        padding: 0,
        textAlign: 'center',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    leftArrow: {
        aspectRatio: 1,
        width: '100%',
        height: undefined,
    },
    rightArrow: {
        aspectRatio: 1,
        width: '100%',
        height: undefined,
    },
    availablePointsText: {
        marginTop: 6,
        marginStart: 4,
        marginEnd: 4,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    actionButton: {
        marginStart: 6,
        marginEnd: 12,
        aspectRatio: 3,
        width: '32.5%',
    },
    spentPointsContainer: {
        aspectRatio: 4.5,
    },
    closeButton: {
        position: 'absolute',
        bottom: '-5%',
        width: '10%',
        aspectRatio: 1,
        alignSelf: 'center',
    },
});
