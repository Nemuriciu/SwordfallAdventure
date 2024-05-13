import {
    FlatList,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getImage} from '../../../assets/images/_index';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {ButtonGroup} from '@rneui/themed';
import {strings} from '../../../utils/strings.ts';
import {colors} from '../../../utils/colors.ts';
import {Item} from '../../../types/item.ts';
import {CraftingCard} from './craftingCard.tsx';
import {
    getCraftingConsumablesList,
    getCraftingEquipmentList,
    getCraftingResourcesList,
} from '../../../parsers/craftingParser.tsx';
import {CraftingDetails} from './craftingDetails.tsx';
import {craftingDetailsShow} from '../../../redux/slices/craftingDetailsSlice.tsx';

export function Crafting() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [resourcesList, setResourcesList] = useState<[Item[], Item[][]]>([
        [],
        [],
    ]);
    const [equipmentList, setEquipmentList] = useState<[Item[], Item[][]]>([
        [],
        [],
    ]);
    const [consumablesList, setConsumablesList] = useState<[Item[], Item[][]]>([
        [],
        [],
    ]);
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setResourcesList(getCraftingResourcesList(userInfo.level));
        setEquipmentList(getCraftingEquipmentList(userInfo.level));
        setConsumablesList(getCraftingConsumablesList(userInfo.level));
    }, [userInfo.level]);

    function onClick(item: Item, materials: Item[], index: number) {
        if (!disabled) {
            setDisabled(true);

            dispatch(craftingDetailsShow([item, materials, index]));

            setTimeout(() => {
                setDisabled(false);
            }, 500);
        }
    }

    // @ts-ignore
    const renderItem = ({item, index}) => (
        <TouchableOpacity
            onPress={() =>
                onClick(
                    item,
                    selectedIndex === 0
                        ? resourcesList[1][index]
                        : selectedIndex === 1
                        ? equipmentList[1][index]
                        : consumablesList[1][index],
                    index,
                )
            }
            disabled={disabled}>
            <CraftingCard
                craftedItem={item}
                materials={
                    selectedIndex === 0
                        ? resourcesList[1][index]
                        : selectedIndex === 1
                        ? equipmentList[1][index]
                        : consumablesList[1][index]
                }
                index={index}
            />
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            style={styles.container}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            <CraftingDetails />
            <ButtonGroup
                onPress={value => setSelectedIndex(value)}
                selectedIndex={selectedIndex}
                buttons={[
                    strings.resources,
                    strings.equipment,
                    strings.consumables,
                ]}
                containerStyle={styles.buttonGroupContainer}
                selectedButtonStyle={styles.selectedButton}
                textStyle={styles.buttonText}
            />
            <ImageBackground
                style={styles.innerContainer}
                source={getImage('background_inner')}
                resizeMode={'stretch'}
                fadeDuration={0}>
                <FlatList
                    style={styles.craftingList}
                    initialNumToRender={1}
                    data={
                        selectedIndex === 0
                            ? resourcesList[0]
                            : selectedIndex === 1
                            ? equipmentList[0]
                            : consumablesList[0]
                    }
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    overScrollMode={'never'}
                />
            </ImageBackground>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonGroupContainer: {
        marginTop: 12,
        marginBottom: 8,
        marginStart: 16,
        marginEnd: 16,
        backgroundColor: 'transparent',
    },
    buttonText: {
        alignSelf: 'stretch',
        textAlign: 'center',
        color: colors.primary,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    selectedButton: {
        backgroundColor: colors.secondary,
    },
    innerContainer: {
        flex: 1,
        marginStart: 2,
        marginEnd: 2,
    },
    craftingList: {
        marginTop: 4,
        marginBottom: 4,
    },
    itemBackground: {},
    image: {
        aspectRatio: 1,
        width: '13.5%',
        marginTop: 8,
        marginBottom: 8,
        marginStart: 18,
    },
});
