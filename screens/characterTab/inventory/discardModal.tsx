import React, {useState} from 'react';
import {StyleSheet, View, ImageBackground, Text, Image} from 'react-native';
import Modal from 'react-native-modal';
import {getImage} from '../../../assets/images/_index';
import {Item} from '../../../types/item.ts';
import SpannableBuilder from '@mj-studio/react-native-spannable-string';
import {
    getItemCategory,
    getItemColor,
    getItemName,
    getItemRarity,
    getBreakValue,
} from '../../../parsers/itemParser.tsx';
import {Slider} from '@miblanchard/react-native-slider';
import {colors} from '../../../utils/colors.ts';
import {
    ButtonType,
    CustomButton,
} from '../../../components/buttons/customButton.tsx';
import {strings} from '../../../utils/strings.ts';
import {inventoryStore} from '../../../store_zustand/inventoryStore.tsx';
import {itemDetailsStore} from '../../../store_zustand/itemDetailsStore.tsx';
import {userInfoStore} from '../../../store_zustand/userInfoStore.tsx';
import {values} from '../../../utils/values.ts';

interface props {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    item: Item;
    index: number;
}

export function DiscardModal({visible, setVisible, item, index}: props) {
    const shards = userInfoStore(state => state.shards);
    const updateShards = userInfoStore(state => state.updateShards);
    const inventoryRemoveItemAt = inventoryStore(
        state => state.inventoryRemoveItemAt,
    );
    const itemDetailsHide = itemDetailsStore(state => state.itemDetailsHide);
    const [quantity, setQuantity] = useState(1);
    const [disabled, setDisabled] = useState(false);
    SpannableBuilder.getInstanceWithComponent(Text);

    function removeItem() {
        setDisabled(true);

        /* Add Break Shards If Item is Equipment */
        if (getItemCategory(item.id) === 'equipment') {
            updateShards(shards + getBreakValue(item));
        }
        /* Hide Item Details */
        itemDetailsHide();
        /* Remove item from Inventory */
        inventoryRemoveItemAt(index, quantity);
        /* Hide Discard Modal */
        setVisible(false);

        setTimeout(() => {
            setDisabled(false);
        }, 250);
    }

    const Title = () => {
        return SpannableBuilder.getInstance(styles.title)
            .append(
                'Are you sure you want to ' +
                    (getItemCategory(item.id) === 'equipment'
                        ? 'break '
                        : 'discard '),
            )
            .appendColored(
                getItemName(item.id),
                getItemColor(getItemRarity(item.id)),
            )
            .append(' ?')
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
                        {item.quantity > 1 && (
                            <View style={styles.sliderContainer}>
                                <Slider
                                    value={quantity}
                                    step={1}
                                    minimumValue={1}
                                    maximumValue={item.quantity}
                                    minimumTrackTintColor={colors.primary}
                                    onValueChange={val => setQuantity(val[0])}
                                    renderAboveThumbComponent={(_, ix) => (
                                        <Text style={styles.thumbValue}>
                                            {ix}
                                        </Text>
                                    )}
                                    thumbStyle={styles.sliderThumb}
                                />
                            </View>
                        )}
                        {getItemCategory(item.id) === 'equipment' && (
                            <View style={styles.rewardsContainer}>
                                <Text style={styles.shardsTitle}>
                                    You will receive:
                                </Text>
                                <View style={styles.shardsContainer}>
                                    <Image
                                        style={styles.shardsIcon}
                                        source={getImage('icon_shards')}
                                        fadeDuration={0}
                                    />
                                    <Text style={styles.shardsText}>
                                        {getBreakValue(item)}
                                    </Text>
                                </View>
                            </View>
                        )}
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                type={ButtonType.Red}
                                style={styles.actionButton}
                                title={strings.yes}
                                onPress={removeItem}
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
        fontSize: 18,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    subtitle: {
        marginBottom: 36,
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    shardsTitle: {
        marginBottom: 12,
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    rewardsContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    shardsContainer: {
        flexDirection: 'row',
        marginBottom: 18,
    },
    shardsIcon: {
        aspectRatio: 1,
        width: '8.5%',
        height: undefined,
    },
    shardsText: {
        marginStart: 4,
        marginTop: 2,
        alignSelf: 'center',
        color: 'white',
        fontSize: 16,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    sliderContainer: {
        marginStart: 12,
        marginEnd: 12,
        marginBottom: 24,
    },
    sliderThumb: {
        backgroundColor: 'white',
    },
    thumbValue: {
        color: colors.primary,
        fontSize: 16,
        fontFamily: values.fontBold,
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
