import {ImageBackground, Text, TextStyle, View, ViewStyle} from 'react-native';
import React from 'react';
import {getImage} from '../assets/images/_index';

interface props {
    text: string;
    image: string;
    containerStyle: ViewStyle;
    textContainerStyle: ViewStyle;
    textStyle: TextStyle;
}

export function IconText({
    text,
    image,
    containerStyle,
    textContainerStyle,
    textStyle,
}: props) {
    return (
        <ImageBackground
            style={containerStyle}
            source={getImage(image)}
            resizeMode={'stretch'}
            fadeDuration={0}>
            <View style={textContainerStyle}>
                <Text
                    style={textStyle}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    {text}
                </Text>
            </View>
        </ImageBackground>
    );
}
