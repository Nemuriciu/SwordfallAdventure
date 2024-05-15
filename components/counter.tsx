import React from 'react';
import {
    TouchableOpacity,
    ImageBackground,
    ViewStyle,
    View,
    StyleSheet,
    Image,
    TextInput,
} from 'react-native';
import {getImage} from '../assets/images/_index';

interface props {
    amount: string;
    setAmount: (val: string) => void;
    editable: boolean;
    min: number;
    max: number;
    style?: ViewStyle;
}

export function Counter({amount, setAmount, editable, min, max, style}: props) {
    function updateAmount(val: string) {
        const filteredText = val.replace(/[- #*;,.<>{}[\]\\/]/gi, '');
        setAmount(filteredText);
    }

    function increaseCraftAmount() {
        if (amount !== '') {
            if (parseInt(amount, 10) < max) {
                setAmount((1 + parseInt(amount, 10)).toString());
            }
        } else {
            setAmount('1');
        }
    }

    function decreaseCraftAmount() {
        if (amount !== '') {
            if (parseInt(amount, 10) > min) {
                setAmount((parseInt(amount, 10) - 1).toString());
            }
        } else {
            setAmount('1');
        }
    }

    return (
        <View style={style}>
            <ImageBackground
                style={styles.background}
                source={getImage('background_crafting_amount')}
                resizeMode={'stretch'}
                fadeDuration={0}>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.arrowContainer}
                        onPress={decreaseCraftAmount}
                        activeOpacity={1}>
                        <Image
                            style={styles.leftArrow}
                            source={getImage('icon_left_arrow')}
                            resizeMode={'stretch'}
                            fadeDuration={0}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.textInput}
                        value={amount}
                        onChangeText={val => updateAmount(val)}
                        keyboardType={'numeric'}
                        editable={editable}
                        maxLength={max.toString().length}
                    />
                    <TouchableOpacity
                        style={styles.arrowContainer}
                        onPress={increaseCraftAmount}
                        activeOpacity={1}>
                        <Image
                            style={styles.rightArrow}
                            source={getImage('icon_right_arrow')}
                            resizeMode={'stretch'}
                            fadeDuration={0}
                        />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
    },
    container: {
        flexDirection: 'row',
    },
    arrowContainer: {
        aspectRatio: 1,
        width: '25%',
        height: undefined,
    },
    textInputContainer: {},
    textInput: {
        flex: 1,
        padding: 0,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    leftArrow: {
        aspectRatio: 1,
        width: '100%',
        height: undefined,
    },
    rightArrow: {
        aspectRatio: 1,
        width: '100%',
        height: undefined,
    },
});
