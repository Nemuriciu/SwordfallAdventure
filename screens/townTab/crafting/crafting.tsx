import {
    FlatList,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getImage} from '../../../assets/images/_index';
import {ButtonGroup} from '@rneui/themed';
import {strings} from '../../../utils/strings.ts';
import {colors} from '../../../utils/colors.ts';
import {Item} from '../../../types/item.ts';
import {CraftingCard} from './craftingCard.tsx';
import {
    getCraftingConsumablesList,
    getCraftingEquipmentList,
} from '../../../parsers/craftingParser.tsx';
import {CraftingDetails} from './craftingDetails.tsx';
import {userInfoStore} from '../../../store_zustand/userInfoStore.tsx';
import {craftingDetailsStore} from '../../../store_zustand/craftingDetailsStore.tsx';

export function Crafting() {
    const level = userInfoStore(state => state.level);
    const craftingDetailsShow = craftingDetailsStore(
        state => state.craftingDetailsShow,
    );
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [equipmentList, setEquipmentList] = useState<[Item[], Item[][]]>([
        [],
        [],
    ]);
    const [consumablesList, setConsumablesList] = useState<[Item[], Item[][]]>([
        [],
        [],
    ]);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setEquipmentList(getCraftingEquipmentList(level));
        setConsumablesList(getCraftingConsumablesList(level));
    }, [level]);

    function onClick(item: Item, materials: Item[], index: number) {
        if (!disabled) {
            setDisabled(true);

            craftingDetailsShow(item, materials, index);

            setTimeout(() => {
                setDisabled(false);
            }, 250);
        }
    }

    // @ts-ignore
    const renderItem = ({item, index}) => (
        <TouchableOpacity
            onPress={() =>
                onClick(
                    item,
                    selectedIndex === 0
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
                        ? equipmentList[1][index]
                        : consumablesList[1][index]
                }
            />
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            style={styles.outerContainer}
            source={getImage('background_outer')}
            resizeMode={'stretch'}>
            <CraftingDetails />
            {/* Category Buttons */}
            <ButtonGroup
                onPress={value => setSelectedIndex(value)}
                selectedIndex={selectedIndex}
                buttons={[strings.equipment, strings.consumables]}
                containerStyle={styles.buttonGroupContainer}
                selectedButtonStyle={styles.selectedButton}
                textStyle={styles.buttonText}
            />
            {/* Crafting List */}
            <FlatList
                style={styles.craftingList}
                data={
                    selectedIndex === 0 ? equipmentList[0] : consumablesList[0]
                }
                keyExtractor={item => item.id}
                renderItem={renderItem}
                overScrollMode={'never'}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    buttonGroupContainer: {
        marginTop: 12,
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
    craftingList: {
        //TODO: margins
        flex: 1,
        marginTop: 5,
        marginBottom: 6,
    },
});
