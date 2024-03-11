import React, {useEffect, useState} from 'react';
import {Image, Text, StyleSheet, View, ImageBackground} from 'react-native';
import {getImage} from '../assets/images/_index';
import {colors} from '../utils/colors.ts';
import {OrangeButton} from './orangeButton.tsx';
import {Creature} from '../types/creature.ts';
import {getCreatureImg, getCreatureName} from '../parsers/creatureParser.tsx';
import {getItemColor} from '../parsers/itemParser.tsx';
import {getResistancePercent} from '../parsers/attributeParser.tsx';
import {useDispatch, useSelector} from 'react-redux';
import {combatShow} from '../redux/slices/combatSlice.tsx';
import {RootState} from '../redux/store.tsx';

interface props {
    creature: Creature;
    index: number;
}

export function CreatureCard({creature, index}: props) {
    const attributes = useSelector((state: RootState) => state.attributes);
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {}, []);

    function attackCreature() {
        if (!disabled) {
            setDisabled(true);

            dispatch(combatShow([creature, index, attributes, creature.stats]));

            setTimeout(() => {
                setDisabled(false);
            }, 500);
        }
    }

    return (
        <ImageBackground
            style={styles.container}
            source={getImage('background_node')}>
            <View style={styles.avatarContainer}>
                <Image
                    style={styles.avatar}
                    source={getImage(getCreatureImg(creature.id))}
                    resizeMode={'stretch'}
                />
                <Image
                    style={styles.avatarFrame}
                    source={getImage('avatar_frame_' + creature.rarity)}
                />
                <View style={styles.levelContainer}>
                    <ImageBackground
                        source={getImage('icon_level')}
                        resizeMode={'stretch'}>
                        <View style={styles.levelTextContainer}>
                            <Text style={styles.levelText}>
                                {creature.level}
                            </Text>
                        </View>
                    </ImageBackground>
                </View>
            </View>
            <View style={styles.innerContainer}>
                <Text
                    style={[
                        styles.name,
                        {color: getItemColor(creature.rarity)},
                    ]}>
                    {getCreatureName(creature.id)}
                </Text>
                <View style={styles.bottomContainer}>
                    <View style={styles.statsContainer}>
                        <View style={styles.row_1}>
                            <Image
                                style={styles.statsIcon}
                                source={getImage('icon_health')}
                            />
                            <Text style={styles.healthValue} numberOfLines={1}>
                                {creature.stats.health
                                    ? creature.stats.health +
                                      creature.stats.bonusHealth
                                    : ''}
                            </Text>
                        </View>
                        <View style={styles.row_2}>
                            <Image
                                style={styles.statsIcon}
                                source={getImage('icon_physical_attack')}
                            />
                            <Text style={styles.phyAtkValue} numberOfLines={1}>
                                {creature.stats.physicalAtk
                                    ? creature.stats.physicalAtk +
                                      creature.stats.bonusPhysicalAtk
                                    : ''}
                            </Text>
                            <Image
                                style={styles.statsIcon}
                                source={getImage('icon_physical_resist')}
                            />
                            <Text style={styles.phyResValue} numberOfLines={1}>
                                {creature.stats.physicalRes
                                    ? getResistancePercent(
                                          creature.stats.physicalRes +
                                              creature.stats.bonusPhysicalRes,
                                          creature.level,
                                      ).toFixed(1) + '%'
                                    : ''}
                            </Text>
                        </View>
                        <View style={styles.row_3}>
                            <Image
                                style={styles.statsIcon}
                                source={getImage('icon_magical_attack')}
                            />
                            <Text style={styles.magAtkValue} numberOfLines={1}>
                                {creature.stats.magicalAtk
                                    ? creature.stats.magicalAtk +
                                      creature.stats.bonusMagicalAtk
                                    : ''}
                            </Text>
                            <Image
                                style={styles.statsIcon}
                                source={getImage('icon_magical_resist')}
                            />
                            <Text style={styles.magResValue} numberOfLines={1}>
                                {creature.stats.magicalRes
                                    ? getResistancePercent(
                                          creature.stats.magicalRes +
                                              creature.stats.bonusMagicalRes,
                                          creature.level,
                                      ).toFixed(1) + '%'
                                    : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <OrangeButton
                            title={'Attack'}
                            onPress={attackCreature}
                            style={styles.attackButton}
                        />
                        <View style={styles.staminaContainer}>
                            <Text style={styles.staminaText}>10</Text>
                            <Image
                                source={getImage('icon_stamina')}
                                style={styles.staminaIcon}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    avatarContainer: {
        aspectRatio: 1,
        width: '22.5%',
        height: undefined,
        marginTop: 12,
        marginBottom: 12,
        marginStart: 16,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    avatarFrame: {
        position: 'absolute',
        top: '-5%',
        left: '-5%',
        width: '107.5%',
        height: '107.5%',
    },
    levelContainer: {
        position: 'absolute',
        left: '38%',
        bottom: '-7.5%',
        aspectRatio: 1,
        width: '27%',
    },
    levelTextContainer: {
        width: '100%',
        height: '100%',
    },
    levelText: {
        marginTop: 4,
        color: 'white',
        textAlign: 'center',
        fontSize: 13,
        fontFamily: 'Myriad_Bold',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    innerContainer: {
        flex: 1,
        marginTop: 8,
        marginStart: 12,
        marginEnd: 12,
    },
    name: {
        marginBottom: 4,
        fontSize: 16,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    bottomContainer: {
        flexDirection: 'row',
    },
    statsContainer: {
        flex: 1,
    },
    statsIcon: {
        aspectRatio: 1,
        width: '10%',
        marginEnd: 4,
    },
    row_1: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    row_2: {
        flexDirection: 'row',
        marginTop: 4,
    },
    row_3: {
        flexDirection: 'row',
        marginTop: 4,
    },
    healthValue: {
        color: colors.health_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    phyAtkValue: {
        flex: 1,
        color: colors.physicalAtk_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    phyResValue: {
        flex: 1,
        color: colors.physicalRes_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    magAtkValue: {
        flex: 1,
        color: colors.magicalAtk_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    magResValue: {
        flex: 1,
        color: colors.magicalRes_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    buttonContainer: {
        aspectRatio: 3.5,
        width: '35%',
    },
    attackButton: {},
    staminaContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    staminaText: {
        marginStart: 6,
        width: '20%',
        textAlign: 'right',
        alignSelf: 'center',
        color: colors.stamina_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    staminaIcon: {
        aspectRatio: 1,
        width: '20%',
        marginTop: 2,
    },
});
