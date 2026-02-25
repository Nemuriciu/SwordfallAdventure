import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {getImage} from '../../../assets/images/_index';
import {colors} from '../../../utils/colors.ts';
import {
    ButtonType,
    CustomButton,
} from '../../../components/buttons/customButton.tsx';
import {Creature} from '../../../types/creature.ts';
import {
    getCreatureImg,
    getCreatureName,
} from '../../../parsers/creatureParser.tsx';
import {getItemColor} from '../../../parsers/itemParser.tsx';
import {getResistancePercent} from '../../../parsers/attributeParser.tsx';
import {userInfoStore} from '../../../store_zustand/userInfoStore.tsx';
import {combatStore} from '../../../store_zustand/combatStore.tsx';
import {attributesStore} from '../../../store_zustand/attributesStore.tsx';
import {Stats} from '../../../types/stats.ts';
import {values} from '../../../utils/values.ts';
import {huntingStore} from '../../../store_zustand/huntingStore.tsx';

interface props {
    creature: Creature;
    index: number;
}

export function CreatureCard({creature, index}: props) {
    const zoneId = huntingStore(state => state.zoneId);
    const stamina = userInfoStore(state => state.stamina);
    const userInfoSetStamina = userInfoStore(state => state.userInfoSetStamina);
    const combatShow = combatStore(state => state.combatShow);

    const health = attributesStore(state => state.health);
    const physicalAtk = attributesStore(state => state.physicalAtk);
    const magicalAtk = attributesStore(state => state.magicalAtk);
    const physicalRes = attributesStore(state => state.physicalRes);
    const magicalRes = attributesStore(state => state.magicalRes);
    const critical = attributesStore(state => state.critical);
    const dodge = attributesStore(state => state.dodge);
    const bonusHealth = attributesStore(state => state.bonusHealth);
    const bonusPhysicalAtk = attributesStore(state => state.bonusPhysicalAtk);
    const bonusMagicalAtk = attributesStore(state => state.bonusMagicalAtk);
    const bonusPhysicalRes = attributesStore(state => state.bonusPhysicalRes);
    const bonusMagicalRes = attributesStore(state => state.bonusMagicalRes);
    const bonusCritical = attributesStore(state => state.bonusCritical);
    const bonusDodge = attributesStore(state => state.bonusDodge);

    const [disabled, setDisabled] = useState(false);

    useEffect(() => {}, []);

    function attackCreature() {
        if (!disabled) {
            setDisabled(true);

            const staminaCost: number = 10; //TODO:
            if (stamina >= staminaCost) {
                const attributes: Stats = {
                    health: health,
                    physicalAtk: physicalAtk,
                    magicalAtk: magicalAtk,
                    physicalRes: physicalRes,
                    magicalRes: magicalRes,
                    critical: critical,
                    dodge: dodge,
                    bonusHealth: bonusHealth,
                    bonusPhysicalAtk: bonusPhysicalAtk,
                    bonusMagicalAtk: bonusMagicalAtk,
                    bonusPhysicalRes: bonusPhysicalRes,
                    bonusMagicalRes: bonusMagicalRes,
                    bonusCritical: bonusCritical,
                    bonusDodge: bonusDodge,
                };
                combatShow(creature, index, attributes, creature.stats);
                userInfoSetStamina(stamina - staminaCost);
            } else {
                //TODO: localization
                // Toast.show('Not enough stamina.', Toast.SHORT); TODO: Replace Toast
            }

            setTimeout(() => {
                setDisabled(false);
            }, 250);
        }
    }

    return (
        <ImageBackground
            style={styles.container}
            source={getImage('background_node')}>
            <View style={styles.avatarContainer}>
                <Image
                    style={styles.avatar}
                    source={getImage(getCreatureImg(zoneId, creature.id))}
                    resizeMode={'stretch'}
                    fadeDuration={0}
                />
                <Image
                    style={styles.avatarFrame}
                    source={getImage('avatar_frame_' + creature.rarity)}
                    fadeDuration={0}
                />
                <View style={styles.levelContainer}>
                    <ImageBackground
                        source={getImage('icon_level')}
                        resizeMode={'stretch'}
                        fadeDuration={0}>
                        <View style={styles.levelTextContainer}>
                            <Text
                                style={styles.levelText}
                                adjustsFontSizeToFit={true}>
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
                    {getCreatureName(zoneId, creature.id)}
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
                        <CustomButton
                            type={ButtonType.Red}
                            title={'Attack'}
                            onPress={attackCreature}
                            disabled={disabled}
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
        width: '20%',
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
        left: '35.5%',
        bottom: '-7.5%',
        aspectRatio: 1,
        width: '30%',
    },
    levelTextContainer: {
        width: '100%',
        height: '100%',
    },
    levelText: {
        marginTop: 3,
        color: 'white',
        textAlign: 'center',
        fontSize: 13,
        fontFamily: values.font,
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
        marginBottom: 2,
        fontSize: 16,
        fontFamily: values.font,
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
        marginTop: 2,
    },
    row_3: {
        flexDirection: 'row',
        marginTop: 2,
    },
    healthValue: {
        color: colors.health_color,
        fontSize: 13,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    phyAtkValue: {
        flex: 1,
        color: colors.physicalAtk_color,
        fontSize: 13,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    phyResValue: {
        flex: 1,
        color: colors.physicalRes_color,
        fontSize: 13,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    magAtkValue: {
        flex: 1,
        color: colors.magicalAtk_color,
        fontSize: 13,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    magResValue: {
        flex: 1,
        color: colors.magicalRes_color,
        fontSize: 13,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    buttonContainer: {
        aspectRatio: values.button_aspect_ratio,
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
        fontFamily: values.font,
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
