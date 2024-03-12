import {ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import {getImage} from '../../../assets/images/_index';

export function Skills() {
    return (
        <ImageBackground
            style={styles.container}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            <View style={styles.container} />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
