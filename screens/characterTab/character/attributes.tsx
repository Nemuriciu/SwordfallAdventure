import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {getImage} from '../../../assets/images/_index';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {isItem} from '../../../types/item.ts';
import {
    getResistancePercent,
    getStats,
} from '../../../parsers/attributeParser.tsx';
import {updateAttributes} from '../../../redux/slices/attributesSlice.tsx';
import {colors} from '../../../utils/colors.ts';
import {strings} from '../../../utils/strings.ts';
import cloneDeep from 'lodash.clonedeep';
import {startingStats} from '../../../types/stats.ts';
import {userInfoStore} from '../../../_zustand/userInfoStore.tsx';

export function Attributes() {
    const level = userInfoStore(state => state.level);

    const equipment = useSelector((state: RootState) => state.equipment);
    const attributes = useSelector((state: RootState) => state.attributes);
    const [phyResPercent, setPhyResPercent] = useState(true);
    const [magResPercent, setMagResPercent] = useState(true);
    const dispatch = useDispatch();
    const didMount = useRef(1);

    useEffect(() => {
        if (!didMount.current) {
            attributesUpdate();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [equipment]);

    function attributesUpdate() {
        let playerAttributes = cloneDeep(startingStats);

        /* List with all Equipped Items */
        const items = Object.entries(equipment)
            .filter(([, value]) => isItem(value))
            .map(item => item[1]);

        /* Add Stats for each item to attributes */
        for (let i = 0; i < items.length; i++) {
            const itemStats = getStats(items[i]);

            playerAttributes.health += itemStats.health + itemStats.bonusHealth;
            playerAttributes.physicalAtk +=
                itemStats.physicalAtk + itemStats.bonusPhysicalAtk;
            playerAttributes.magicalAtk +=
                itemStats.magicalAtk + itemStats.bonusMagicalAtk;
            playerAttributes.physicalRes +=
                itemStats.physicalRes + itemStats.bonusPhysicalRes;
            playerAttributes.magicalRes +=
                itemStats.magicalRes + itemStats.bonusMagicalRes;
            playerAttributes.critical +=
                itemStats.critical + itemStats.bonusCritical;
            playerAttributes.dodge += itemStats.dodge + itemStats.bonusDodge;
        }

        dispatch(updateAttributes(playerAttributes));
    }

    return (
        <View style={styles.container}>
            <View style={styles.row_1}>
                <Image style={styles.icon} source={getImage('icon_health')} />
                <Text style={styles.healthLabel} numberOfLines={1}>
                    {strings.health}
                </Text>
                <Text style={styles.healthValue} numberOfLines={1}>
                    {attributes.health ? attributes.health : ''}
                </Text>
                <View style={styles.icon} />
                <Text style={styles.healthLabel} />
                <Text style={styles.healthValue} />
            </View>
            <View style={styles.row_2}>
                <Image
                    style={styles.icon}
                    source={getImage('icon_physical_attack')}
                />
                <Text style={styles.phyAtkLabel} numberOfLines={1}>
                    {strings.physical_atk}
                </Text>
                <Text style={styles.phyAtkValue} numberOfLines={1}>
                    {attributes.physicalAtk ? attributes.physicalAtk : ''}
                </Text>
                <Image
                    style={styles.icon}
                    source={getImage('icon_physical_resist')}
                />
                <TouchableOpacity
                    style={styles.resLabelContainer}
                    onPress={() => setPhyResPercent(!phyResPercent)}
                    activeOpacity={1}>
                    <Text style={styles.phyResLabel} numberOfLines={1}>
                        {strings.physical_res}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.resValueContainer}
                    onPress={() => setPhyResPercent(!phyResPercent)}
                    activeOpacity={1}>
                    <Text style={styles.phyResValue} numberOfLines={1}>
                        {attributes.physicalRes
                            ? phyResPercent
                                ? getResistancePercent(
                                      attributes.physicalRes,
                                      level,
                                  ).toFixed(1) + '%'
                                : attributes.physicalRes
                            : ''}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row_3}>
                <Image
                    style={styles.icon}
                    source={getImage('icon_magical_attack')}
                />
                <Text style={styles.magAtkLabel} numberOfLines={1}>
                    {strings.magical_atk}
                </Text>
                <Text style={styles.magAtkValue} numberOfLines={1}>
                    {attributes.magicalAtk ? attributes.magicalAtk : ''}
                </Text>
                <Image
                    style={styles.icon}
                    source={getImage('icon_magical_resist')}
                />
                <TouchableOpacity
                    style={styles.resLabelContainer}
                    onPress={() => setMagResPercent(!magResPercent)}
                    activeOpacity={1}>
                    <Text style={styles.magResLabel} numberOfLines={1}>
                        {strings.magical_res}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.resValueContainer}
                    onPress={() => setMagResPercent(!magResPercent)}
                    activeOpacity={1}>
                    <Text style={styles.magResValue} numberOfLines={1}>
                        {attributes.magicalRes
                            ? magResPercent
                                ? getResistancePercent(
                                      attributes.magicalRes,
                                      level,
                                  ).toFixed(1) + '%'
                                : attributes.magicalRes
                            : ''}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row_4}>
                <Image style={styles.icon} source={getImage('icon_critical')} />
                <Text style={styles.criticalLabel} numberOfLines={1}>
                    {strings.critical}
                </Text>
                <Text style={styles.criticalValue} numberOfLines={1}>
                    {attributes.critical
                        ? (attributes.critical * 100).toFixed(1) + '%'
                        : ''}
                </Text>
                <Image style={styles.icon} source={getImage('icon_dodge')} />
                <Text style={styles.dodgeLabel} numberOfLines={1}>
                    {strings.dodge}
                </Text>
                <Text style={styles.dodgeValue} numberOfLines={1}>
                    {attributes.dodge
                        ? (attributes.dodge * 100).toFixed(1) + '%'
                        : ''}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        marginBottom: 12,
        marginStart: 4,
        marginEnd: 18,
    },
    icon: {
        aspectRatio: 1,
        width: '7%',
        height: undefined,
        alignSelf: 'center',
        marginStart: 20,
        marginEnd: 4,
    },
    row_1: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    row_2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    row_3: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    row_4: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    resLabelContainer: {
        width: '23%',
    },
    resValueContainer: {
        flex: 1,
    },
    healthLabel: {
        width: '22.5%',
        color: colors.health_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    healthValue: {
        flex: 1,
        textAlign: 'right',
        color: colors.health_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    phyAtkLabel: {
        width: '23%',
        color: colors.physicalAtk_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    phyAtkValue: {
        flex: 1,
        textAlign: 'right',
        color: colors.physicalAtk_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    phyResLabel: {
        color: colors.physicalRes_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    phyResValue: {
        textAlign: 'right',
        color: colors.physicalRes_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    magAtkLabel: {
        width: '23%',
        color: colors.magicalAtk_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    magAtkValue: {
        flex: 1,
        textAlign: 'right',
        color: colors.magicalAtk_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    magResLabel: {
        color: colors.magicalRes_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    magResValue: {
        textAlign: 'right',
        color: colors.magicalRes_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    criticalLabel: {
        width: '23%',
        color: colors.critical_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    criticalValue: {
        flex: 1,
        textAlign: 'right',
        color: colors.critical_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    dodgeLabel: {
        width: '23%',
        color: colors.dodge_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    dodgeValue: {
        flex: 1,
        textAlign: 'right',
        color: colors.dodge_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
});
