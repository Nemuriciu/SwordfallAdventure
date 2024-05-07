/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {TouchableOpacity, Text, ImageBackground, ViewStyle} from 'react-native';
import {getImage} from '../assets/images/_index';

interface props {
    type: ButtonType;
    title: string;
    onPress: () => void;
    disabled?: boolean;
    style?: ViewStyle;
}

export enum ButtonType {
    Orange = 'orange',
    Green = 'green',
    Red = 'red',
}

export function CustomButton({type, title, onPress, disabled, style}: props) {
    const [isPressed, setIsPressed] = useState(false);
    //const [disabled, setDisabled] = useState(false);
    const defaultImage =
        type === ButtonType.Orange
            ? getImage('button_orange')
            : type === ButtonType.Green
            ? getImage('button_green')
            : getImage('button_red');
    const pressedImage =
        type === ButtonType.Orange
            ? getImage('button_orange_pressed')
            : type === ButtonType.Green
            ? getImage('button_green')
            : getImage('button_red');
    const disabledImage = getImage('button_orange_disabled');

    const handlePress = () => {
        if (!disabled) {
            if (onPress) {
                onPress();
            }
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
            <ImageBackground
                source={
                    disabled
                        ? disabledImage
                        : isPressed
                        ? pressedImage
                        : defaultImage
                }
                resizeMode={'stretch'}
                fadeDuration={0}>
                <Text
                    style={{
                        width: '100%',
                        height: '100%',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        color: 'white',
                        fontFamily: 'Myriad_Regular',
                        textShadowColor: 'rgba(0, 0, 0, 1)',
                        textShadowOffset: {width: 1, height: 1},
                        textShadowRadius: 5,
                    }}>
                    {title}
                </Text>
            </ImageBackground>
        </TouchableOpacity>
    );
}
