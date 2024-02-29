import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export function Exploring() {
    return (
        <View style={styles.container}>
            <Text>Exploring</Text>
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
