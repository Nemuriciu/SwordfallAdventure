import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export function Skills() {
    return (
        <View style={styles.container}>
            <Text>Skills</Text>
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
