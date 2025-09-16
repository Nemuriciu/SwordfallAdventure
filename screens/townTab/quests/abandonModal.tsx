import React, {useState} from 'react';
import {StyleSheet, View, ImageBackground, Text} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {getImage} from '../../../assets/images/_index';
import SpannableBuilder from '@mj-studio/react-native-spannable-string';
import {
    ButtonType,
    CustomButton,
} from '../../../components/buttons/customButton.tsx';
import {strings} from '../../../utils/strings.ts';
import {RootState} from '../../../redux/store.tsx';
import cloneDeep from 'lodash.clonedeep';
import {sortQuests} from '../../../parsers/questParser.tsx';
import {questsSetList} from '../../../redux/slices/questsSlice.tsx';

interface props {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    index: number;
}

export function AbandonModal({visible, setVisible, index}: props) {
    const quests = useSelector((state: RootState) => state.quests);
    const dispatch = useDispatch();
    const [disabled, setDisabled] = useState(false);
    SpannableBuilder.getInstanceWithComponent(Text);

    function abandonQuest() {
        setDisabled(true);

        const questsList = cloneDeep(quests.questsList);
        questsList[index].isActive = false;
        questsList[index].progress = 0;

        sortQuests(questsList);
        dispatch(questsSetList(questsList));

        /* Hide Abandon Modal */
        setTimeout(() => {
            setVisible(false);
        }, 100);

        setTimeout(() => {
            setDisabled(false);
        }, 500);
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
            backdropTransitionOutTiming={0}
            useNativeDriver={true}>
            <View style={styles.container}>
                <ImageBackground
                    style={styles.background}
                    source={getImage('background_details')}
                    resizeMode={'stretch'}
                    fadeDuration={0}>
                    <View style={styles.innerContainer}>
                        <Title />
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                type={ButtonType.Orange}
                                style={styles.actionButton}
                                title={strings.yes}
                                onPress={abandonQuest}
                                disabled={disabled}
                            />
                            <CustomButton
                                type={ButtonType.Orange}
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
        fontFamily: 'Myriad_Regular',
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
