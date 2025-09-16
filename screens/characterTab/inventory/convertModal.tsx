import React, {useState} from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    Text,
    Dimensions,
    Image,
} from 'react-native';
import Modal from 'react-native-modal';
import {getImage} from '../../../assets/images/_index';
import {Item} from '../../../types/item.ts';
import SpannableBuilder from '@mj-studio/react-native-spannable-string';
import {
    getItemColor,
    getItemName,
    getItemRarity,
    getItemImg,
    getConvertQuantity,
    getConvertRatio,
} from '../../../parsers/itemParser.tsx';
import {
    ButtonType,
    CustomButton,
} from '../../../components/buttons/customButton.tsx';
import {strings} from '../../../utils/strings.ts';
import cloneDeep from 'lodash.clonedeep';
import {inventoryStore} from '../../../_zustand/inventoryStore.tsx';
import {itemDetailsStore} from '../../../_zustand/itemDetailsStore.tsx';

interface props {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    item: Item;
    index: number;
}

export function ConvertModal({visible, setVisible, item, index}: props) {
    const inventoryAddItems = inventoryStore(state => state.inventoryAddItems);

    const inventoryRemoveItemAt = inventoryStore(
        state => state.inventoryRemoveItemAt,
    );
    const itemDetailsHide = itemDetailsStore(state => state.itemDetailsHide);
    const [disabled, setDisabled] = useState(false);
    SpannableBuilder.getInstanceWithComponent(Text);

    function convertItem() {
        setDisabled(true);

        let convertedItem = cloneDeep(item);
        convertedItem.level += 1;
        convertedItem.quantity = getConvertQuantity(item);
        /* Hide Item Details */
        itemDetailsHide();
        /* Remove Item from Inventory */
        inventoryRemoveItemAt(index, item.quantity);
        /* Add Converted Item to Inventory */
        inventoryAddItems([convertedItem]);
        /* Hide Discard Modal */
        setVisible(false);

        setTimeout(() => {
            setDisabled(false);
        }, 250);
    }

    const Title = () => {
        return SpannableBuilder.getInstance(styles.title)
            .append('Do you want to convert all ')
            .appendColored(
                getItemName(item.id),
                getItemColor(getItemRarity(item.id)),
            )
            .append(' to next level?')
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
                        <View style={styles.itemsContainer}>
                            <View style={styles.leftItemContainer}>
                                <ImageBackground
                                    style={styles.itemSlot}
                                    source={getImage(getItemImg(item.id))}
                                    fadeDuration={0}>
                                    <Text style={styles.itemQuantity}>
                                        {item.quantity > 1 ? item.quantity : ''}
                                    </Text>
                                </ImageBackground>
                                <Text style={styles.itemLevelText}>
                                    Level {item.level}
                                </Text>
                            </View>
                            <View style={styles.ratioContainer}>
                                <Image
                                    style={styles.convertIcon}
                                    source={getImage('icon_convert_right')}
                                    fadeDuration={0}
                                />
                                <Text style={styles.convertText}>
                                    {getConvertRatio(item)} : 1
                                </Text>
                            </View>
                            <View style={styles.rightItemContainer}>
                                <ImageBackground
                                    style={styles.itemSlot}
                                    source={getImage(getItemImg(item.id))}
                                    fadeDuration={0}>
                                    <Text style={styles.itemQuantity}>
                                        {getConvertQuantity(item) > 1
                                            ? getConvertQuantity(item)
                                            : ''}
                                    </Text>
                                </ImageBackground>
                                <Text style={styles.itemLevelText}>
                                    Level {item.level + 1}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                type={ButtonType.Orange}
                                style={styles.actionButton}
                                title={strings.yes}
                                onPress={convertItem}
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
        fontSize: 18,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    itemsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 18,
    },
    leftItemContainer: {
        marginStart: 8,
    },
    ratioContainer: {
        marginBottom: 16,
    },
    rightItemContainer: {
        marginEnd: 8,
    },
    itemSlot: {
        aspectRatio: 1,
        height: Dimensions.get('screen').height / 16,
        marginStart: 1,
        marginEnd: 1,
    },
    convertIcon: {
        aspectRatio: 1,
        marginStart: 4,
        height: Dimensions.get('screen').height / 24,
    },
    convertText: {
        position: 'absolute',
        bottom: -12,
        alignSelf: 'center',
        color: 'white',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    itemLevelText: {
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    itemQuantity: {
        position: 'absolute',
        bottom: 5,
        right: 6,
        color: 'white',
        fontFamily: 'Myriad',
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
