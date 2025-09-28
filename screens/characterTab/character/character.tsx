import {
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React from 'react';
import {TitleSeparator} from '../../../components/titleSeparator';
import {Equipment} from './equipment';
import {Attributes} from './attributes.tsx';
import {getImage} from '../../../assets/images/_index';
import {colors} from '../../../utils/colors.ts';
import {values} from '../../../utils/values.ts';

export function Character() {
    return (
        <ImageBackground
            style={styles.container}
            source={getImage('background_outer')}
            resizeMode={'stretch'}
            fadeDuration={0}>
            <ScrollView style={styles.scrollView} alwaysBounceVertical={false}>
                <View style={styles.infoOuterContainer}>
                    <Image
                        style={styles.avatar}
                        source={getImage('user_avatar')}
                        resizeMode={'stretch'}
                        fadeDuration={0}
                    />
                    <View style={styles.infoInnerContainer}>
                        <Text style={styles.username}>Username</Text>
                        <Text style={styles.guild}>{'<No Guild>'}</Text>
                        <Text style={styles.arena}>{'<Arena Rank>'}</Text>
                    </View>
                </View>
                <TitleSeparator title={'Equipment'} />
                <Equipment />
                <TitleSeparator title={'Attributes'} />
                <Attributes />
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        marginTop: 12,
        marginBottom: 12,
        paddingStart: 0,
    },
    infoOuterContainer: {
        flexDirection: 'row',
        marginStart: 16,
    },
    infoInnerContainer: {
        marginStart: 16,
        justifyContent: 'center',
    },
    avatar: {
        aspectRatio: 1,
        height: undefined,
        width: '25%',
        borderRadius: 100,
        borderWidth: 4,
        borderColor: '#BE763C',
        overflow: 'hidden',
    },
    username: {
        fontSize: 16,
        color: colors.primary,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    guild: {
        marginTop: 6,
        marginBottom: 6,
        fontSize: 16,
        color: colors.primary,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    arena: {
        fontSize: 16,
        color: colors.primary,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
});
