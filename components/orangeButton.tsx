/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {TouchableOpacity, ViewStyle, Text, ImageBackground} from 'react-native';
import {getImage} from '../assets/images/_index';

interface OrangeButton {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
}

const defaultImage = getImage('button_orange');
const pressedImage = getImage('button_orange_pressed');

export const OrangeButton: React.FC<OrangeButton> = ({
    title,
    onPress,
    style,
}) => {
    const [isPressed, setIsPressed] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const handlePress = () => {
        if (!disabled) {
            setDisabled(true);
            if (onPress) {
                onPress();
            }
            setTimeout(() => {
                setDisabled(false);
            }, 500);
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
                source={isPressed ? pressedImage : defaultImage}
                resizeMode={'stretch'}>
                <Text
                    style={{
                        width: '100%',
                        height: '100%',
                        color: 'white',
                        //fontFamily: 'Lato_400Regular',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        textShadowColor: 'rgba(0, 0, 0, 1)',
                        textShadowOffset: {width: 1, height: 1},
                        textShadowRadius: 1,
                    }}>
                    {title}
                </Text>
            </ImageBackground>
        </TouchableOpacity>
    );
};
