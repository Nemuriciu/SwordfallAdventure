import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export function Gathering() {
    return (
        <View style={styles.container}>
            <Text>Gathering</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
