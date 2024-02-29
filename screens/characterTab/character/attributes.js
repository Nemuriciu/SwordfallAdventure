import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {getImage} from '../../../assets/images/_index';

export function Attributes() {
    return (
        <View style={styles.container}>
            <View style={styles.row_1}>
                <Image style={styles.icon} source={getImage('icon_health')} />
                <Text style={styles.healthLabel} numberOfLines={1}>
                    Health
                </Text>
                <Text style={styles.healthValue} numberOfLines={1}>
                    100
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
                    Physical ATK
                </Text>
                <Text style={styles.phyAtkValue} numberOfLines={1}>
                    1999
                </Text>
                <Image
                    style={styles.icon}
                    source={getImage('icon_physical_resist')}
                />
                <Text style={styles.phyResLabel} numberOfLines={1}>
                    Physical RES
                </Text>
                <Text style={styles.phyResValue} numberOfLines={1}>
                    19.5%
                </Text>
            </View>
            <View style={styles.row_3}>
                <Image
                    style={styles.icon}
                    source={getImage('icon_magical_attack')}
                />
                <Text style={styles.magAtkLabel} numberOfLines={1}>
                    Magical ATK
                </Text>
                <Text style={styles.magAtkValue} numberOfLines={1}>
                    100
                </Text>
                <Image
                    style={styles.icon}
                    source={getImage('icon_magical_resist')}
                />
                <Text style={styles.magResLabel} numberOfLines={1}>
                    Magical RES
                </Text>
                <Text style={styles.magResValue} numberOfLines={1}>
                    100
                </Text>
            </View>
            <View style={styles.row_4}>
                <Image style={styles.icon} source={getImage('icon_critical')} />
                <Text style={styles.criticalLabel} numberOfLines={1}>
                    Magical ATK
                </Text>
                <Text style={styles.criticalValue} numberOfLines={1}>
                    100
                </Text>
                <Image style={styles.icon} source={getImage('icon_dodge')} />
                <Text style={styles.dodgeLabel} numberOfLines={1}>
                    Magical RES
                </Text>
                <Text style={styles.dodgeValue} numberOfLines={1}>
                    100
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
        width: '7.5%',
        height: undefined,
        alignSelf: 'center',
        marginStart: 20,
        marginEnd: 4,
    },
    row_1: {
        flexDirection: 'row',
        alignItems: 'center',
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
    healthLabel: {
        width: '22.5%',
        color: 'red',
        //fontFamily: 'Lato_400Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    healthValue: {
        flex: 1,
        color: 'red',
        //fontFamily: 'Lato_400Regular',
        textAlign: 'right',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    phyAtkLabel: {
        width: '23%',
        color: 'orange',
        //fontFamily: 'Lato_400Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    phyAtkValue: {
        flex: 1,
        color: 'orange',
        //fontFamily: 'Lato_400Regular',
        textAlign: 'right',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    phyResLabel: {
        width: '23%',
        color: 'orange',
        //fontFamily: 'Lato_400Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    phyResValue: {
        flex: 1,
        color: 'orange',
        //fontFamily: 'Lato_400Regular',
        textAlign: 'right',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    magAtkLabel: {
        width: '23%',
        color: 'cyan',
        //fontFamily: 'Lato_400Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    magAtkValue: {
        flex: 1,
        color: 'cyan',
        //fontFamily: 'Lato_400Regular',
        textAlign: 'right',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    magResLabel: {
        width: '23%',
        color: 'cyan',
        //fontFamily: 'Lato_400Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    magResValue: {
        flex: 1,
        color: 'cyan',
        //fontFamily: 'Lato_400Regular',
        textAlign: 'right',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    criticalLabel: {
        width: '23%',
        color: 'purple',
        //fontFamily: 'Lato_400Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    criticalValue: {
        flex: 1,
        color: 'purple',
        //fontFamily: 'Lato_400Regular',
        textAlign: 'right',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    dodgeLabel: {
        width: '23%',
        color: 'green',
        //fontFamily: 'Lato_400Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
    dodgeValue: {
        flex: 1,
        color: 'green',
        //fontFamily: 'Lato_400Regular',
        textAlign: 'right',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
    },
});
