import React, {useState} from 'react';
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {getImage} from '../assets/images/_index';
import {values} from '../utils/values.ts';
import {colors} from '../utils/colors.ts';

interface props {
    playerLevel: number;
    zoneLevelMin: number;
    zoneLevelMax: number;
    image: string;
    hasQuest: boolean;
    onPress: () => void;
}

export function ZoneCard({
    playerLevel,
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
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.5}
            disabled={playerLevel < zoneLevelMin}>
            <View
                style={[
                    styles.zoneCard,
                    {borderColor: hasQuest ? colors.primary : 'gray'},
                ]}>
                <View style={styles.zoneLevelContainer}>
                    <Text
                        style={[
                            styles.zoneLevelText,
                            {
                                color:
                                    playerLevel < zoneLevelMin
                                        ? 'rgb(175,0,0)'
                                        : 'white',
                            },
                        ]}>
                        {zoneLevelMin} - {zoneLevelMax}
                    </Text>
                </View>
                {playerLevel < zoneLevelMin && (
                    <View style={styles.zoneLockedOverlay}>
                        <Image
                            style={styles.zoneLockIcon}
                            source={getImage('icon_lock')}
                            resizeMode={'stretch'}
                        />
                    </View>
                )}
                <ImageBackground
                    style={styles.zoneCardImage}
                    source={getImage(image)}
                    resizeMode={'stretch'}>
                    {hasQuest && (
                        <ImageBackground
                            style={styles.zoneQuestIcon}
                            source={getImage('quests_icon_quest')}
                            resizeMode={'stretch'}
                            fadeDuration={0}
                        />
                    )}
                </ImageBackground>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    zoneCard: {
        flex: 1,
        padding: 2,
        marginStart: 40,
        marginEnd: 40,
        marginTop: 4,
        marginBottom: 4,
        backgroundColor: 'transparent',
        borderRadius: 4,
        borderWidth: 2,
    },
    zoneLevelContainer: {
        position: 'absolute',
        left: 24,
        top: 16,
        zIndex: 200,
    },
    zoneLevelText: {
        fontSize: 18,
        fontFamily: values.fontRegular,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    zoneCardImage: {
        aspectRatio: 1.5,
    },
    zoneQuestIcon: {
        flex: 0.3,
        alignSelf: 'flex-end',
        aspectRatio: 1,
        marginTop: 12,
        marginEnd: 4,
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
    zoneLockedOverlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    zoneLockIcon: {
        aspectRatio: 1,
        width: '40%',
        height: undefined,
        opacity: 0.8,
    },
});
