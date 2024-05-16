/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
    TouchableOpacity,
    ViewStyle,
    Image,
    ImageBackground,
    Text,
    StyleSheet,
} from 'react-native';
import {getImage} from '../../../assets/images/_index';
import {Skill} from '../../../types/skill.ts';
import {getSkillImg, getSkillMaxPoints} from '../../../parsers/skillParser.tsx';
import {useDispatch} from 'react-redux';
import {skillsDetailsShow} from '../../../redux/slices/skillsDetailsSlice.tsx';
import {colors} from '../../../utils/colors.ts';

interface props {
    style?: ViewStyle;
    skill: Skill | null;
}

export function SkillsIcon({style, skill}: props) {
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();

    const handlePress = () => {
        if (!disabled) {
            setDisabled(true);
            if (skill) {
                dispatch(skillsDetailsShow(skill));
            }
            setTimeout(() => {
                setDisabled(false);
            }, 300);
        }
    };

    if (skill) {
        return (
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={1}
                disabled={disabled}
                style={style}>
                <ImageBackground
                    source={getImage('skills_frame_background')}
                    resizeMode={'stretch'}
                    fadeDuration={0}
                    style={[
                        styles.frame,
                        {
                            borderColor: skill.points ? 'green' : 'transparent',
                        },
                    ]}>
                    <Image
                        source={getImage(getSkillImg(skill.id))}
                        resizeMode={'stretch'}
                        fadeDuration={0}
                        style={styles.image}
                    />
                    <ImageBackground
                        source={getImage('skills_points_background')}
                        resizeMode={'stretch'}
                        fadeDuration={0}
                        style={styles.textFrame}>
                        <Text
                            style={[
                                styles.text,
                                {
                                    color: skill.points
                                        ? colors.uncommon
                                        : 'white',
                                },
                            ]}>
                            {skill.points + '/' + getSkillMaxPoints(skill.id)}
                        </Text>
                    </ImageBackground>
                </ImageBackground>
            </TouchableOpacity>
        );
    } else {
        return null;
    }
}

const styles = StyleSheet.create({
    frame: {
        borderWidth: 1,
        padding: 6,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textFrame: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: '-25%',
        width: '100%',
        aspectRatio: 3,
    },
    text: {
        fontSize: 13,
        textAlign: 'center',
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
});
