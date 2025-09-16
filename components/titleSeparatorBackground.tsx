import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import React from 'react';
import {getImage} from '../assets/images/_index';
import {colors} from '../utils/colors.ts';

interface props {
    title: string;
    background: string;
    style: ViewStyle;
}

const separatorImage = getImage('icon_separator_semi');

export function TitleSeparatorBackground({title, background, style}: props) {
    return (
        <View style={style}>
            <Image
                style={styles.separator}
                source={separatorImage}
                resizeMode={'contain'}
                fadeDuration={0}
            />
            <ImageBackground
                style={styles.titleContainer}
                source={getImage(background)}
                resizeMode={'contain'}
                fadeDuration={0}>
                <Text style={styles.title} adjustsFontSizeToFit={true}>
                    {title}
                </Text>
            </ImageBackground>
            <Image
                style={styles.separator}
                source={separatorImage}
                resizeMode={'contain'}
                fadeDuration={0}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    separator: {
        flex: 1,
        height: 24,
    },
    titleContainer: {
        flex: 1,
        aspectRatio: 4,
        justifyContent: 'center',
        marginStart: 8,
        marginEnd: 8,
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    title: {
        width: '100%',
        fontSize: 30,
        textAlign: 'center',
        color: colors.primary,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
});
