import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ImageBackground, Text, Image} from 'react-native';
import Modal from 'react-native-modal';
import {getImage} from '../../../assets/images/_index';
import SpannableBuilder from '@mj-studio/react-native-spannable-string';
import {
    getBreakValue,
    getItemCategory,
    getItemColor,
    getItemRarity,
} from '../../../parsers/itemParser.tsx';
import {colors} from '../../../utils/colors.ts';
import {
    ButtonType,
    CustomButton,
} from '../../../components/buttons/customButton.tsx';
import {strings} from '../../../utils/strings.ts';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {Category, isItem} from '../../../types/item.ts';
import {inventoryRemoveMultipleItemsAt} from '../../../redux/slices/inventorySlice.tsx';
import {updateShards} from '../../../redux/slices/userInfoSlice.tsx';

interface props {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    rarity: string;
}

export function BreakAllModal({visible, setVisible, rarity}: props) {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const inventory = useSelector((state: RootState) => state.inventory);
    const [disabled, setDisabled] = useState(false);
    const [shards, setShards] = useState(0);
    const [removedItems, setRemovedItems] = useState<number[]>([]);
    const dispatch = useDispatch();
    SpannableBuilder.getInstanceWithComponent(Text);

    useEffect(() => {
        if (visible) {
            /* Index items which need to be removed */
            let totalShards = 0;
            const itemsIndex: number[] = [];
            for (let i = 0; i < inventory.list.length; i++) {
                const item = inventory.list[i];
                if (isItem(item)) {
                    //TODO: Skip locked items
                    if (
                        getItemCategory(item.id) === Category.equipment &&
                        getItemRarity(item.id) === rarity
                    ) {
                        //TODO: shards based on rarity + upgrade
                        totalShards += getBreakValue(item);
                        itemsIndex.push(i);
                    }
                }
            }
            setShards(totalShards);
            setRemovedItems(itemsIndex);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    function removeAllEquipment() {
        setDisabled(true);

        dispatch(updateShards(userInfo.shards + shards));
        /* Remove items from inventory */
        dispatch(
            inventoryRemoveMultipleItemsAt({
                index: removedItems,
                quantity: Array(removedItems.length).fill(1),
            }),
        );

        /* Hide Modal */
        setTimeout(() => {
            setVisible(false);
        }, 200);

        setTimeout(() => {
            setDisabled(false);
        }, 500);
    }

    const Title = () => {
        return SpannableBuilder.getInstance(styles.title)
            .append('Are you sure you want to break all ')
            .appendColored(
                rarity.slice(0, 1).toUpperCase() +
                    rarity.slice(1, rarity.length),
                getItemColor(rarity),
            )
            .append(' equipment?')
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
                                <Text style={styles.shardsText}>{shards}</Text>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                type={ButtonType.Orange}
                                style={styles.actionButton}
                                title={strings.yes}
                                onPress={() => removeAllEquipment()}
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
    subtitle: {
        marginBottom: 36,
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    shardsTitle: {
        marginBottom: 12,
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontFamily: 'Myriad',
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
        fontFamily: 'Myriad',
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
        fontFamily: 'Myriad_Bold',
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
