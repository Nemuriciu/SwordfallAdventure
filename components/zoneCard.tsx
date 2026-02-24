import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getImage} from '../assets/images/_index';
import {Card} from '@rneui/themed';
import {values} from '../utils/values.ts';
import {colors} from '../utils/colors.ts';

interface props {
    zoneName: string;
    zoneLevelMin: number;
    zoneLevelMax: number;
    image: string;
    hasQuest: boolean;
    onPress: () => void;
}

export function ZoneCard({
    zoneName,
    zoneLevelMin,
    zoneLevelMax,
    image,
    hasQuest,
    onPress,
}: props) {
    const [disabled, setDisabled] = useState(false);

    const handlePress = () => {
        if (!disabled) {
            setDisabled(true);
            if (onPress) {
                onPress();
            }
            setTimeout(() => {
                setDisabled(false);
            }, 250);
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.5}>
            <Card
                containerStyle={[
                    styles.zoneCard,
                    {borderColor: hasQuest ? colors.primary : 'gray'},
                ]}>
                <Card.Image source={getImage(image)}>
                    <View style={styles.zoneTopContainer}>
                        <Text style={styles.zoneLevel}>
                            Lv. {zoneLevelMin} - {zoneLevelMax}
                        </Text>
                        {/* TODO: Quest Icon */}
                    </View>
                    <Text style={styles.zoneTitle}>{zoneName}</Text>
                </Card.Image>
            </Card>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    zoneCard: {
        flex: 1,
        padding: 2,
        marginStart: 24,
        marginEnd: 24,
        marginTop: 4,
        marginBottom: 4,
        backgroundColor: 'transparent',
        borderRadius: 4,
        borderWidth: 2,
    },
    zoneTopContainer: {
        flex: 1,
        marginStart: 16,
        marginEnd: 16,
        marginTop: 8,
    },
    zoneLevel: {
        marginTop: 8,
        marginBottom: 8,
        color: 'white',
        fontSize: 16,
        fontFamily: values.fontRegular,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    zoneTitle: {
        marginTop: 8,
        marginBottom: 16,
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
});
