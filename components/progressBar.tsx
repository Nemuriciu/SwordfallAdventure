import React, {useState} from 'react';
import {Image, ImageBackground, View, ViewStyle} from 'react-native';
import {getImage} from '../assets/images/_index';

interface props {
    progress: number;
    image: string;
    style?: ViewStyle;
}
const ProgressBar = ({progress, image, style}: props) => {
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    return (
        <View
            style={style}
            onLayout={event => {
                setWidth(event.nativeEvent.layout.width);
                setHeight(event.nativeEvent.layout.height);
            }}>
            <ImageBackground
                source={getImage('progress_bar_background')}
                resizeMode={'stretch'}
                fadeDuration={0}>
                <View
                    /* eslint-disable-next-line react-native/no-inline-styles */
                    style={{
                        height: '100%',
                        width: `${progress * 100}%`,
                        overflow: 'hidden',
                    }}>
                    <Image
                        style={{
                            height: height,
                            width: width,
                        }}
                        source={getImage(image)}
                        resizeMode={'stretch'}
                        fadeDuration={0}
                    />
                </View>
            </ImageBackground>
        </View>
    );
};

export default ProgressBar;
