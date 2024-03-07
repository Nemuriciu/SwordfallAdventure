import React, {useEffect} from 'react';
import {Image, Text, StyleSheet, View, ImageBackground} from 'react-native';
import {getImage} from '../assets/images/_index';
import {colors} from '../utils/colors.ts';
import {OrangeButton} from './orangeButton.tsx';
import {Creature} from '../types/creature.ts';
import {getCreatureImg, getCreatureName} from '../parsers/creatureParser.tsx';
import {getItemColor} from '../parsers/itemParser.tsx';
import {getResistancePercent} from '../parsers/attributeParser.tsx';

interface props {
    creature: Creature;
    index: number;
}

export function CreatureCard({creature, index}: props) {
    //const userInfo = useSelector((state: RootState) => state.userInfo);
    //const hunting = useSelector((state: RootState) => state.hunting);
    //const dispatch = useDispatch();

    useEffect(() => {}, []);

    return (
        <ImageBackground
            style={styles.container}
            source={getImage('background_node')}>
            <Image
                style={styles.image}
                source={getImage(getCreatureImg(creature.id))}
                resizeMode={'stretch'}
            />
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
                                    ? creature.stats.health
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
                                    ? creature.stats.physicalAtk
                                    : ''}
                            </Text>
                            <Image
                                style={styles.statsIcon}
                                source={getImage('icon_physical_resist')}
                            />
                            <Text style={styles.phyResValue} numberOfLines={1}>
                                {creature.stats.physicalRes
                                    ? getResistancePercent(
                                          creature.stats.physicalRes,
                                          creature.level,
                                      ).toFixed(creature.level) + '%'
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
                                    ? creature.stats.magicalAtk
                                    : ''}
                            </Text>
                            <Image
                                style={styles.statsIcon}
                                source={getImage('icon_magical_resist')}
                            />
                            <Text style={styles.magResValue} numberOfLines={1}>
                                {creature.stats.magicalRes
                                    ? getResistancePercent(
                                          creature.stats.magicalRes,
                                          creature.level,
                                      ).toFixed(creature.level) + '%'
                                    : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <OrangeButton
                            title={'Attack'}
                            onPress={() => {
                                console.log(index);
                            }}
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
    image: {
        aspectRatio: 1,
        width: '22%',
        marginTop: 12,
        marginBottom: 12,
        marginStart: 20,
    },
    innerContainer: {
        flex: 1,
        marginTop: 12,
        marginStart: 12,
        marginEnd: 12,
    },
    name: {
        marginBottom: 6,
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
