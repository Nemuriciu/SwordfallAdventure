import React, {useState} from 'react';
import {Image, StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import {getImage} from '../../assets/images/_index';

interface props {
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
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
            style={
                style || {
                    position: 'absolute',
                    bottom: '-5%',
                    width: '10%',
                    aspectRatio: 1,
                    alignSelf: 'center',
                }
            }>
            <Image
                source={isPressed ? pressedImage : defaultImage}
                resizeMode={'contain'}
                fadeDuration={0}
                /* eslint-disable-next-line react-native/no-inline-styles */
                style={{width: '100%', height: '100%'}}
            />
        </TouchableOpacity>
    );
}
