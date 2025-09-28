import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {getImage} from '../../../assets/images/_index';
import {isItem} from '../../../types/item.ts';
import {
    getResistancePercent,
    getStats,
} from '../../../parsers/attributeParser.tsx';
import {colors} from '../../../utils/colors.ts';
import {strings} from '../../../utils/strings.ts';
import cloneDeep from 'lodash.clonedeep';
import {startingStats} from '../../../types/stats.ts';
import {userInfoStore} from '../../../store_zustand/userInfoStore.tsx';
import {equipmentStore} from '../../../store_zustand/equipmentStore.tsx';
import {attributesStore} from '../../../store_zustand/attributesStore.tsx';
import {values} from '../../../utils/values.ts';

export function Attributes() {
    const level = userInfoStore(state => state.level);

    const helmet = equipmentStore(state => state.helmet);
    const weapon = equipmentStore(state => state.weapon);
    const chest = equipmentStore(state => state.chest);
    const offhand = equipmentStore(state => state.offhand);
    const gloves = equipmentStore(state => state.gloves);
    const pants = equipmentStore(state => state.pants);
    const boots = equipmentStore(state => state.boots);

    const health = attributesStore(state => state.health);
    const physicalAtk = attributesStore(state => state.physicalAtk);
    const magicalAtk = attributesStore(state => state.magicalAtk);
    const physicalRes = attributesStore(state => state.physicalRes);
    const magicalRes = attributesStore(state => state.magicalRes);
    const critical = attributesStore(state => state.critical);
    const dodge = attributesStore(state => state.dodge);

    const updateAttributes = attributesStore(state => state.updateAttributes);

    const [phyResPercent, setPhyResPercent] = useState(true);
    const [magResPercent, setMagResPercent] = useState(true);
    const didMount = useRef(1);

    useEffect(() => {
        if (!didMount.current) {
            attributesUpdate();
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [helmet, weapon, chest, offhand, gloves, pants, boots]);

    function attributesUpdate() {
        let playerAttributes = cloneDeep(startingStats);

        /* List with all Equipped Items */
        const items = [
            helmet,
            weapon,
            offhand,
            chest,
            pants,
            gloves,
            boots,
        ].filter(isItem);

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

        updateAttributes(playerAttributes);
    }

    return (
        <View style={styles.container}>
            <View style={styles.row_1}>
                <Image style={styles.icon} source={getImage('icon_health')} />
                <Text style={styles.healthLabel} numberOfLines={1}>
                    {strings.health}
                </Text>
                <Text style={styles.healthValue} numberOfLines={1}>
                    {health ? health : ''}
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
                    {physicalAtk ? physicalAtk : ''}
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
                        {physicalRes
                            ? phyResPercent
                                ? getResistancePercent(
                                      physicalRes,
                                      level,
                                  ).toFixed(1) + '%'
                                : physicalRes
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
                    {magicalAtk ? magicalAtk : ''}
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
                        {magicalRes
                            ? magResPercent
                                ? getResistancePercent(
                                      magicalRes,
                                      level,
                                  ).toFixed(1) + '%'
                                : magicalRes
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
                    {critical ? (critical * 100).toFixed(1) + '%' : ''}
                </Text>
                <Image style={styles.icon} source={getImage('icon_dodge')} />
                <Text style={styles.dodgeLabel} numberOfLines={1}>
                    {strings.dodge}
                </Text>
                <Text style={styles.dodgeValue} numberOfLines={1}>
                    {dodge ? (dodge * 100).toFixed(1) + '%' : ''}
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
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    healthValue: {
        flex: 1,
        textAlign: 'right',
        color: colors.health_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    phyAtkLabel: {
        width: '23%',
        color: colors.physicalAtk_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    phyAtkValue: {
        flex: 1,
        textAlign: 'right',
        color: colors.physicalAtk_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    phyResLabel: {
        color: colors.physicalRes_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    phyResValue: {
        textAlign: 'right',
        color: colors.physicalRes_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    magAtkLabel: {
        width: '23%',
        color: colors.magicalAtk_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    magAtkValue: {
        flex: 1,
        textAlign: 'right',
        color: colors.magicalAtk_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    magResLabel: {
        color: colors.magicalRes_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    magResValue: {
        textAlign: 'right',
        color: colors.magicalRes_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    criticalLabel: {
        width: '23%',
        color: colors.critical_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    criticalValue: {
        flex: 1,
        textAlign: 'right',
        color: colors.critical_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    dodgeLabel: {
        width: '23%',
        color: colors.dodge_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    dodgeValue: {
        flex: 1,
        textAlign: 'right',
        color: colors.dodge_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
});
