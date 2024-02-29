import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export function Hunting() {
    return (
        <View style={styles.container}>
            <Text>Hunting</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#777',
    },
});
