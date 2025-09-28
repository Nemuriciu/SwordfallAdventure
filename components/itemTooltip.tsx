import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {isItem} from '../types/item.ts';
import {
    getItemCategory,
    getItemColor,
    getItemDetailsBackgroundImg,
    getItemImg,
    getItemName,
    getItemRarity,
    getItemType,
} from '../parsers/itemParser.tsx';
import {getImage} from '../assets/images/_index';
import {userInfoStore} from '../store_zustand/userInfoStore.tsx';
import {values} from '../utils/values.ts';
import {itemTooltipStore} from '../store_zustand/itemTooltipStore.tsx';
import {strings} from '../utils/strings.ts';
import {colors} from '../utils/colors.ts';
import {getStats} from '../parsers/attributeParser.tsx';
import {emptyStats, Stats} from '../types/stats.ts';

export function ItemTooltip() {
    const level = userInfoStore(state => state.level);
    const visible = itemTooltipStore(state => state.visible);
    const item = itemTooltipStore(state => state.item);
    const itemTooltipHide = itemTooltipStore(state => state.itemTooltipHide);

    const [itemStats, setItemStats] = useState<Stats>(emptyStats);

    useEffect(() => {
        if (isItem(item)) {
            if (getItemCategory(item.id) === 'equipment') {
                setItemStats(getStats(item));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    return (
        <Modal
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            isVisible={visible}
            backdropTransitionInTiming={1}
            backdropTransitionOutTiming={1}
            backdropOpacity={0.5}
            useNativeDriver={true}
            onBackdropPress={() => {
                itemTooltipHide();
            }}>
            <View style={styles.modalAlpha}>
                <View style={styles.container}>
                    {isItem(item) && (
                        <ImageBackground
                            style={styles.background}
                            source={getImage(getItemDetailsBackgroundImg(item))}
                            resizeMode={'stretch'}
                            fadeDuration={0}>
                            <View style={styles.innerContainer}>
                                <View style={styles.topContainer}>
                                    <View style={styles.imageContainer}>
                                        <Image
                                            style={styles.image}
                                            source={getImage(
                                                getItemImg(item.id),
                                            )}
                                            fadeDuration={0}
                                        />
                                        <Text style={styles.imageUpgrade}>
                                            {item.upgrade
                                                ? '+' + item.upgrade
                                                : ''}
                                        </Text>
                                    </View>
                                    <View style={styles.itemInfoContainer}>
                                        <Text
                                            style={[
                                                styles.name,
                                                {
                                                    color: getItemColor(
                                                        getItemRarity(item.id),
                                                    ),
                                                },
                                            ]}>
                                            {isItem(item)
                                                ? getItemName(item.id)
                                                : ''}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.type,
                                                {
                                                    color: getItemColor(
                                                        getItemRarity(item.id),
                                                    ),
                                                },
                                            ]}>
                                            {isItem(item)
                                                ? getItemRarity(item.id) +
                                                  ' ' +
                                                  getItemType(item.id)
                                                : ''}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.level,
                                                {
                                                    color:
                                                        getItemCategory(
                                                            item.id,
                                                        ) === 'equipment' &&
                                                        item.level > level
                                                            ? 'red'
                                                            : 'white',
                                                },
                                            ]}>
                                            {isItem(item)
                                                ? 'Level ' + item.level
                                                : ''}
                                        </Text>
                                    </View>
                                </View>
                                {getItemCategory(item.id) === 'equipment' && (
                                    <View style={styles.separatorContainer}>
                                        <Image
                                            style={styles.separatorImage}
                                            source={getImage('icon_separator')}
                                            resizeMode={'contain'}
                                            fadeDuration={0}
                                        />
                                    </View>
                                )}
                                {getItemCategory(item.id) === 'equipment' && (
                                    <View style={styles.attributesContainer}>
                                        {itemStats.health > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.health_color,
                                                    },
                                                ]}>
                                                {itemStats
                                                    ? itemStats.health +
                                                          itemStats.bonusHealth >
                                                      0
                                                        ? '+ ' +
                                                          (itemStats.health +
                                                              itemStats.bonusHealth) +
                                                          ' ' +
                                                          strings.health
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                        {itemStats.physicalAtk > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.physicalAtk_color,
                                                    },
                                                ]}>
                                                {itemStats
                                                    ? itemStats.physicalAtk +
                                                          itemStats.bonusPhysicalAtk >
                                                      0
                                                        ? '+ ' +
                                                          (itemStats.physicalAtk +
                                                              itemStats.bonusPhysicalAtk) +
                                                          ' ' +
                                                          strings.physical_atk
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                        {itemStats.magicalAtk > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.magicalAtk_color,
                                                    },
                                                ]}>
                                                {itemStats
                                                    ? itemStats.magicalAtk +
                                                          itemStats.bonusMagicalAtk >
                                                      0
                                                        ? '+ ' +
                                                          (itemStats.magicalAtk +
                                                              itemStats.bonusMagicalAtk) +
                                                          ' ' +
                                                          strings.magical_atk
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                        {itemStats.physicalRes > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.physicalRes_color,
                                                    },
                                                ]}>
                                                {itemStats
                                                    ? itemStats.physicalRes +
                                                          itemStats.bonusPhysicalRes >
                                                      0
                                                        ? '+ ' +
                                                          (itemStats.physicalRes +
                                                              itemStats.bonusPhysicalRes) +
                                                          ' ' +
                                                          strings.physical_res
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                        {itemStats.magicalRes > 0 && (
                                            <Text
                                                style={[
                                                    styles.attribute,
                                                    {
                                                        color: colors.magicalRes_color,
                                                    },
                                                ]}>
                                                {itemStats
                                                    ? itemStats.magicalRes +
                                                          itemStats.bonusMagicalRes >
                                                      0
                                                        ? '+ ' +
                                                          (itemStats.magicalRes +
                                                              itemStats.bonusMagicalRes) +
                                                          ' ' +
                                                          strings.magical_res
                                                        : ''
                                                    : ''}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>
                        </ImageBackground>
                    )}
                </View>
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
        marginStart: 24,
        marginEnd: 24,
    },
    background: {
        width: '100%',
        marginBottom: 4,
    },
    innerContainer: {
        marginTop: 16,
        marginBottom: 16,
        marginStart: 32,
        marginEnd: 32,
    },
    topContainer: {
        flexDirection: 'row',
    },
    imageContainer: {
        width: '22.5%',
        aspectRatio: 1,
        marginTop: 2,
        marginEnd: 12,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageUpgrade: {
        position: 'absolute',
        top: '7.5%',
        right: '12.5%',
        color: 'white',
        fontSize: 16,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    itemInfoContainer: {},
    name: {
        fontFamily: values.fontBold,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    type: {
        textTransform: 'capitalize',
        fontSize: 13,
        fontFamily: values.fontRegular,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    level: {
        fontSize: 13,
        fontFamily: values.fontRegular,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    separatorContainer: {
        marginTop: 8,
        marginBottom: 6,
    },
    separatorImage: {
        width: '100%',
    },
    attributesContainer: {
        marginStart: 24,
        marginEnd: 32,
    },
    attribute: {
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
});
