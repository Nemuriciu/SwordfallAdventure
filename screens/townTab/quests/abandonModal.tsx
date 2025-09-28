import React, {useState} from 'react';
import {StyleSheet, View, ImageBackground, Text} from 'react-native';
import Modal from 'react-native-modal';
import {getImage} from '../../../assets/images/_index';
import SpannableBuilder from '@mj-studio/react-native-spannable-string';
import {
    ButtonType,
    CustomButton,
} from '../../../components/buttons/customButton.tsx';
import {strings} from '../../../utils/strings.ts';
import cloneDeep from 'lodash.clonedeep';
import {sortQuests} from '../../../parsers/questParser.tsx';
import {questsStore} from '../../../store_zustand/questsStore.tsx';
import {values} from '../../../utils/values.ts';

interface props {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    index: number;
}

export function AbandonModal({visible, setVisible, index}: props) {
    const questsList = questsStore(state => state.questsList);
    const questsSetList = questsStore(state => state.questsSetList);

    const [disabled, setDisabled] = useState(false);
    SpannableBuilder.getInstanceWithComponent(Text);

    function abandonQuest() {
        setDisabled(true);

        const _questsList = cloneDeep(questsList);
        _questsList[index].isActive = false;
        _questsList[index].progress = 0;

        sortQuests(_questsList);
        questsSetList(_questsList);

        /* Hide Abandon Modal */
        setVisible(false);

        setTimeout(() => {
            setDisabled(false);
        }, 250);
    }

    const Title = () => {
        return SpannableBuilder.getInstance(styles.title)
            .append(
                'Are you sure you want to abandon quest?\n\n' +
                    'Progress will be lost, but the quest will ' +
                    'still be available for restart.',
            )
            .build();
    };

    // noinspection RequiredAttributes
    return (
        <Modal
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            isVisible={visible}
            backdropTransitionInTiming={1}
            backdropTransitionOutTiming={1}
            useNativeDriver={true}>
            <View style={styles.container}>
                <ImageBackground
                    style={styles.background}
                    source={getImage('item_background_default')}
                    resizeMode={'stretch'}
                    fadeDuration={0}>
                    <View style={styles.innerContainer}>
                        <Title />
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                type={ButtonType.Red}
                                style={styles.actionButton}
                                title={strings.yes}
                                onPress={abandonQuest}
                                disabled={disabled}
                            />
                            <CustomButton
                                type={ButtonType.Red}
                                style={styles.actionButton}
                                title={strings.no}
                                onPress={() => setVisible(false)}
                                disabled={disabled}
                            />
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalAlpha: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        width: '100%',
    },
    innerContainer: {
        marginTop: 42,
        marginBottom: 42,
        marginStart: 32,
        marginEnd: 32,
    },
    title: {
        marginBottom: 28,
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontFamily: values.fontRegular,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    actionButton: {
        aspectRatio: 3,
        width: '40%',
    },
});
