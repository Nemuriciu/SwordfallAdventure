import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, ImageBackground, Image} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {getImage} from '../../../assets/images/_index';
import {ButtonType, CustomButton} from '../../../components/customButton.tsx';
import {strings} from '../../../utils/strings.ts';
import {CloseButton} from '../../../components/closeButton.tsx';
import {Counter} from '../../../components/counter.tsx';
import {
    getSkillDescription,
    getSkillImg,
    getSkillMaxPoints,
    getSkillName,
} from '../../../parsers/skillParser.tsx';
import {skillsDetailsHide} from '../../../redux/slices/skillsDetailsSlice.tsx';
import {colors} from '../../../utils/colors.ts';

export function SkillsDetails() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const skillsDetails = useSelector(
        (state: RootState) => state.skillsDetails,
    );
    const [pointsAvailable, setPointsAvailable] = useState('0');
    const [pointsSpent, setPointsSpent] = useState('0');
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();
    const didMount_1 = useRef(1);

    useEffect(() => {
        if (skillsDetails.skill !== null) {
            setPointsSpent(skillsDetails.skill.points.toString());
            //setPointsAvailable(userInfo.skillPoints.toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skillsDetails.skill]);

    useEffect(() => {
        if (!didMount_1.current) {
            //TODO: this and deserialize the counter component :(
            //setPointsAvailable(userInfo.skillPoints - (pointsSpent - skillsDetails.skill.points))
        } else {
            didMount_1.current -= 1;
        }
    }, [pointsSpent]);

    function applyPoints() {}

    function handlerSetPointsSpent(val: string) {
        setPointsSpent(val);
    }

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
                                        <Text style={styles.rank}>
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
                                    {skillsDetails.skill.points > 0 && (
                                        <Text style={styles.description}>
                                            {getSkillDescription(
                                                skillsDetails.skill.id,
                                            )}
                                        </Text>
                                    )}
                                    <ImageBackground
                                        style={styles.nextRankImage}
                                        source={getImage(
                                            'skills_details_next_rank',
                                        )}
                                        resizeMode={'stretch'}
                                        fadeDuration={0}>
                                        <Text style={styles.nextRankText}>
                                            {strings.next_rank}
                                        </Text>
                                    </ImageBackground>
                                    <Text style={styles.description}>
                                        {getSkillDescription(
                                            skillsDetails.skill.id,
                                        )}
                                    </Text>
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
                                            skillsDetails.skill.points.toString() ===
                                            pointsSpent
                                        }
                                    />
                                    <View style={styles.pointsContainer}>
                                        {/* Points */}
                                        <Counter
                                            amount={pointsSpent}
                                            setAmount={handlerSetPointsSpent}
                                            editable={false}
                                            min={0}
                                            max={getSkillMaxPoints(
                                                skillsDetails.skill.id,
                                            )}
                                            style={styles.pointsCounter}
                                        />
                                        {/* Available Points Label */}
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
        color: 'white',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    descriptionContainer: {
        alignItems: 'center',
        marginTop: 16,
        marginStart: 16,
        marginEnd: 16,
    },
    description: {
        marginBottom: 12,
        color: 'white',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    nextRankImage: {
        marginBottom: 12,
    },
    nextRankText: {
        aspectRatio: 5,
        margin: 2,
        textAlign: 'center',
        color: colors.primary,
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
    pointsContainer: {width: '35%'},
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
        width: '30%',
    },
    pointsCounter: {
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
