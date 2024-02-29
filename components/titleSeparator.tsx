import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {getImage} from '../assets/images/_index';

interface props {
    title: string;
}

const image = getImage('separator');

export function TitleSeparator({title}: props) {
    return (
        <View style={styles.container}>
            <Image
                style={styles.separator}
                source={image}
                resizeMode={'stretch'}
            />
            <Text style={styles.title}>{title}</Text>
            <Image
                style={styles.separator}
                source={image}
                resizeMode={'stretch'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: 16,
        marginEnd: 16,
    },
    separator: {
        flex: 1,
    },
    title: {
        marginStart: 12,
        marginEnd: 12,
        fontFamily: 'Lato_400Regular',
        fontSize: 16,
        color: '#d4ab63',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
});
