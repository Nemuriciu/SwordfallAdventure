import React, {useState} from 'react';
import {TouchableOpacity, ViewStyle, Image} from 'react-native';
import {getImage} from '../assets/images/_index';

interface props {
    onPress: () => void;
    style?: ViewStyle;
}

export function CloseButton({onPress, style}: props) {
    const [isPressed, setIsPressed] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const defaultImage = getImage('button_close');
    const pressedImage = getImage('button_close_pressed');

    const handlePress = () => {
        if (!disabled) {
            setDisabled(true);
            if (onPress) {
                onPress();
            }
            setTimeout(() => {
                setDisabled(false);
            }, 300);
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
                source={isPressed ? pressedImage : defaultImage}
                /* eslint-disable-next-line react-native/no-inline-styles */
                style={{width: '100%', height: '100%'}}
            />
        </TouchableOpacity>
    );
}
