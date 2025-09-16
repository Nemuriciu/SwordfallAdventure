import React, {useState} from 'react';
import {TouchableOpacity, ViewStyle, Image, StyleSheet} from 'react-native';
import {getImage} from '../../assets/images/_index';

interface props {
    onPress: () => void;
    disabled?: boolean;
    style?: ViewStyle;
}

export function PlusButton({onPress, disabled, style}: props) {
    const [internalDisabled, setInternalDisabled] = useState(false);
    const defaultImage = getImage('button_plus');
    const disabledImage = getImage('button_plus_disabled');

    const handlePress = () => {
        if (!disabled) {
            setInternalDisabled(true);
            if (onPress) {
                onPress();
            }
            setTimeout(() => {
                setInternalDisabled(false);
            }, 200);
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={1}
            disabled={disabled || internalDisabled}
            style={style}>
            <Image
                style={styles.image}
                source={disabled ? disabledImage : defaultImage}
                resizeMode={'stretch'}
                fadeDuration={0}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1,
        width: '100%',
        height: undefined,
    },
});
