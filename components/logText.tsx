import {StyleSheet, Text} from 'react-native';
import React from 'react';

interface props {
    text: string;
}

export function LogText({text}: props) {
    return <Text style={styles.text}>{text}</Text>;
}

const styles = StyleSheet.create({
    container: {},
    text: {
        marginBottom: 8,
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
});
