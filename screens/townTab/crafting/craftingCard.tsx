import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    FlatList,
    Dimensions,
} from 'react-native';
import {getImage} from '../../../assets/images/_index';
import {
    getItemColor,
    getItemImg,
    getItemName,
    getItemRarity,
} from '../../../parsers/itemParser.tsx';
import {Item} from '../../../types/item.ts';
import {strings} from '../../../utils/strings.ts';

interface props {
    craftedItem: Item;
    materials: Item[];
}

export function CraftingCard({craftedItem, materials}: props) {
    // @ts-ignore
    const renderItem = ({item}) => (
        <ImageBackground
            style={styles.materialSlot}
            source={getImage(getItemImg(item.id))}
            fadeDuration={0}>
            <Text style={styles.materialQuantity}>
                {item.quantity > 1 ? item.quantity : ''}
            </Text>
        </ImageBackground>
    );
    // noinspection RequiredAttributes
    return (
        <ImageBackground
            style={styles.background}
            source={getImage('background_node')}
            resizeMode={'stretch'}
            fadeDuration={0}>
            <View>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={getImage(getItemImg(craftedItem.id))}
                            fadeDuration={0}
                        />
                    </View>
                    <View style={styles.itemInfoContainer}>
                        <Text
                            style={[
                                styles.name,
                                {
                                    color: getItemColor(
                                        getItemRarity(craftedItem.id),
                                    ),
                                },
                            ]}>
                            {getItemName(craftedItem.id)}
                        </Text>
                        <Text style={styles.level}>
                            {'Level ' + craftedItem.level}
                        </Text>
                    </View>
                    <View style={styles.materialsContainer}>
                        <Text style={styles.materialsText}>
                            {strings.materials}
                        </Text>
                        <FlatList
                            style={styles.flatList}
                            contentContainerStyle={styles.flatListContent}
                            horizontal
                            scrollEnabled={false}
                            data={materials}
                            keyExtractor={item => item.id}
                            renderItem={renderItem}
                            overScrollMode={'never'}
                        />
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        marginBottom: 2,
    },
    container: {
        flexDirection: 'row',
    },
    imageContainer: {
        width: '14%',
        aspectRatio: 1,
        marginStart: 32,
        marginTop: 12,
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    itemInfoContainer: {
        width: '40%',
        marginStart: 8,
        marginTop: 12,
        marginBottom: 4,
    },
    name: {
        marginTop: 2,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    level: {
        marginTop: 4,
        marginBottom: 4,
        color: 'white',
        fontSize: 13,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    materialsText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 13,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    materialsContainer: {
        flex: 1,
        marginStart: 8,
        marginEnd: 16,
        marginTop: 8,
        marginBottom: 4,
    },
    flatList: {
        marginTop: 2,
    },
    flatListContent: {
        flex: 1,
        justifyContent: 'center',
    },
    materialSlot: {
        aspectRatio: 1,
        height: Dimensions.get('screen').height / 25,
        marginStart: 1,
        marginEnd: 1,
    },
    materialQuantity: {
        position: 'absolute',
        bottom: 3,
        right: 4,
        color: 'white',
        fontSize: 12,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
});
