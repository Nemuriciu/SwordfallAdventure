import React, {useState} from 'react';
import {
    Image,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import {getImage} from '../../assets/images/_index';

interface props {
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
}

export function BackButton({onPress, style}: props) {
    const [isPressed, setIsPressed] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const defaultImage = getImage('button_back');
    const pressedImage = getImage('button_back_pressed');

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

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
            disabled={disabled}
            style={style}>
            <Image
                style={styles.image}
                source={isPressed ? pressedImage : defaultImage}
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
