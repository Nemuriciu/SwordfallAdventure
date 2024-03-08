import React, {useEffect} from 'react';
import {
    Modal,
    StyleSheet,
    View,
    ImageBackground,
    Image,
    Text,
    FlatList,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {getImage} from '../../../assets/images/_index';
import {getCreatureImg} from '../../../parsers/creatureParser.tsx';
import {getResistancePercent} from '../../../parsers/attributeParser.tsx';
import {colors} from '../../../utils/colors.ts';
import ProgressBar from '../../../components/progressBar.tsx';
import {strings} from '../../../utils/strings.ts';
import {LogText} from '../../../components/logText.tsx';
import {combatHide} from '../../../redux/slices/combatSlice.tsx';

export function Combat() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const attributes = useSelector((state: RootState) => state.attributes);
    //const hunting = useSelector((state: RootState) => state.hunting);
    const combat = useSelector((state: RootState) => state.combat);
    //const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {}, []);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={combat.modalVisible}
            onRequestClose={() => dispatch(combatHide())}>
            {combat.creature && (
                <View style={styles.container}>
                    {/* Creature Info */}
                    <View>
                        <ImageBackground
                            source={getImage('background_combat_info')}
                            resizeMode={'stretch'}>
                            <View style={styles.topContainer}>
                                <View style={styles.avatarContainer}>
                                    <Image
                                        style={styles.avatar}
                                        source={getImage(
                                            getCreatureImg(combat.creature.id),
                                        )}
                                        resizeMode={'stretch'}
                                    />
                                    <Image
                                        style={styles.avatarFrame}
                                        source={getImage('avatar_frame_common')}
                                    />
                                </View>
                                <View style={styles.attributesContainer}>
                                    <View style={styles.attributesRow_1}>
                                        <Image
                                            style={styles.statsIcon}
                                            source={getImage(
                                                'icon_physical_attack',
                                            )}
                                        />
                                        <Text
                                            style={styles.phyAtkValue}
                                            numberOfLines={1}>
                                            {combat.creature.stats.physicalAtk
                                                ? combat.creature.stats
                                                      .physicalAtk +
                                                  combat.creature.stats
                                                      .bonusPhysicalAtk
                                                : ''}
                                        </Text>
                                        <Image
                                            style={styles.statsIcon}
                                            source={getImage(
                                                'icon_physical_resist',
                                            )}
                                        />
                                        <Text
                                            style={styles.phyResValue}
                                            numberOfLines={1}>
                                            {combat.creature.stats.physicalRes
                                                ? getResistancePercent(
                                                      combat.creature.stats
                                                          .physicalRes +
                                                          combat.creature.stats
                                                              .bonusPhysicalRes,
                                                      combat.creature.level,
                                                  ).toFixed(1) + '%'
                                                : ''}
                                        </Text>
                                        <Image
                                            style={styles.statsIcon}
                                            source={getImage('icon_critical')}
                                        />
                                        <Text
                                            style={styles.criticalValue}
                                            numberOfLines={1}>
                                            {combat.creature.stats.critical
                                                ? (
                                                      (combat.creature.stats
                                                          .critical +
                                                          combat.creature.stats
                                                              .bonusCritical) *
                                                      100
                                                  ).toFixed(1) + '%'
                                                : ''}
                                        </Text>
                                    </View>
                                    <View style={styles.attributesRow_2}>
                                        <Image
                                            style={styles.statsIcon}
                                            source={getImage(
                                                'icon_magical_attack',
                                            )}
                                        />
                                        <Text
                                            style={styles.magAtkValue}
                                            numberOfLines={1}>
                                            {combat.creature.stats.magicalAtk
                                                ? combat.creature.stats
                                                      .magicalAtk +
                                                  combat.creature.stats
                                                      .bonusMagicalAtk
                                                : ''}
                                        </Text>
                                        <Image
                                            style={styles.statsIcon}
                                            source={getImage(
                                                'icon_magical_resist',
                                            )}
                                        />
                                        <Text
                                            style={styles.magResValue}
                                            numberOfLines={1}>
                                            {combat.creature.stats.magicalRes
                                                ? getResistancePercent(
                                                      combat.creature.stats
                                                          .magicalRes +
                                                          combat.creature.stats
                                                              .bonusMagicalRes,
                                                      combat.creature.level,
                                                  ).toFixed(1) + '%'
                                                : ''}
                                        </Text>
                                        <Image
                                            style={styles.statsIcon}
                                            source={getImage('icon_dodge')}
                                        />
                                        <Text
                                            style={styles.dodgeValue}
                                            numberOfLines={1}>
                                            {combat.creature.stats.dodge
                                                ? (
                                                      (combat.creature.stats
                                                          .dodge +
                                                          combat.creature.stats
                                                              .bonusDodge) *
                                                      100
                                                  ).toFixed(1) + '%'
                                                : ''}
                                        </Text>
                                    </View>
                                    <View style={styles.healthContainer}>
                                        <Image
                                            style={styles.healthIcon}
                                            source={getImage('icon_health')}
                                        />
                                        <View
                                            style={
                                                styles.healthProgressContainer
                                            }>
                                            <ProgressBar
                                                progress={1}
                                                image={'progress_bar_health'}
                                            />
                                            <Text style={styles.healthText}>
                                                {combat.creature.stats.health +
                                                    ' / ' +
                                                    combat.creature.stats
                                                        .health}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.effectsContainer}>
                                        {/* eslint-disable-next-line react-native/no-inline-styles */}
                                        <View style={{width: '10%'}} />
                                        <FlatList
                                            horizontal
                                            scrollEnabled={false}
                                            data={[]}
                                            keyExtractor={(_item, index) =>
                                                index.toString()
                                            }
                                            renderItem={() => (
                                                <Image
                                                    style={styles.effectIcon}
                                                    source={getImage(
                                                        'icon_slot',
                                                    )}
                                                    resizeMode={'stretch'}
                                                />
                                            )}
                                            overScrollMode={'never'}
                                        />
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                    {/* Combat Log */}
                    <ImageBackground
                        style={styles.logBackground}
                        source={getImage('background_log')}
                        resizeMode={'stretch'}>
                        <View style={styles.logContainer}>
                            <FlatList
                                style={styles.logList}
                                data={[
                                    'log1',
                                    'log2',
                                    'log3',
                                    'log1',
                                    'log2',
                                    'log3',
                                    'log1',
                                    'log2',
                                    'log3',
                                    'log1',
                                    'log2',
                                    'log3',
                                    'log1',
                                    'log2',
                                    'log3',
                                    'log1',
                                    'log2',
                                    'log3',
                                ]}
                                keyExtractor={(_item, index) =>
                                    index.toString()
                                }
                                renderItem={({item}) => <LogText text={item} />}
                                overScrollMode={'never'}
                            />
                        </View>
                    </ImageBackground>
                    {/* Actionbar */}
                    <View>
                        <ImageBackground
                            style={styles.actionbarBackground}
                            source={getImage('background_actionbar')}
                            resizeMode={'stretch'}>
                            <View style={styles.actionbarContainer}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.labelText}>
                                        {strings.basic_attack}
                                    </Text>
                                    <View style={styles.actionIconContainer}>
                                        <TouchableOpacity
                                            style={styles.actionButton}>
                                            <ImageBackground
                                                style={styles.actionIcon}
                                                source={getImage(
                                                    'skills_icon_basic_physical',
                                                )}
                                                resizeMode={'stretch'}>
                                                <Text
                                                    style={styles.cooldownText}>
                                                    1
                                                </Text>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.actionButton}>
                                            <ImageBackground
                                                style={styles.actionIcon}
                                                source={getImage(
                                                    'skills_icon_basic_magical',
                                                )}
                                                resizeMode={'stretch'}>
                                                <Text
                                                    style={styles.cooldownText}>
                                                    1
                                                </Text>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.labelText}>
                                        {strings.spells}
                                    </Text>
                                    <View style={styles.actionIconContainer}>
                                        <TouchableOpacity
                                            style={styles.actionButton}>
                                            <ImageBackground
                                                style={styles.actionIcon}
                                                source={getImage(
                                                    'skills_icon_frame',
                                                )}
                                                resizeMode={'stretch'}>
                                                <Text
                                                    style={styles.cooldownText}>
                                                    1
                                                </Text>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.actionButton}>
                                            <ImageBackground
                                                style={styles.actionIcon}
                                                source={getImage(
                                                    'skills_icon_frame',
                                                )}
                                                resizeMode={'stretch'}>
                                                <Text
                                                    style={styles.cooldownText}>
                                                    1
                                                </Text>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.actionButton}>
                                            <ImageBackground
                                                style={styles.actionIcon}
                                                source={getImage(
                                                    'skills_icon_frame',
                                                )}
                                                resizeMode={'stretch'}>
                                                <Text
                                                    style={styles.cooldownText}>
                                                    1
                                                </Text>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                    {/* Player Info */}
                    <View>
                        <ImageBackground
                            source={getImage('background_combat_info')}
                            resizeMode={'stretch'}>
                            <View style={styles.bottomContainer}>
                                <View style={styles.avatarContainer}>
                                    <Image
                                        style={styles.avatar}
                                        source={getImage('user_avatar')}
                                        resizeMode={'stretch'}
                                    />
                                    <Image
                                        style={styles.avatarFrame}
                                        source={getImage('avatar_frame_common')}
                                    />
                                </View>
                                <View style={styles.attributesContainer}>
                                    <View style={styles.attributesRow_1}>
                                        <Image
                                            style={styles.statsIcon}
                                            source={getImage(
                                                'icon_physical_attack',
                                            )}
                                        />
                                        <Text
                                            style={styles.phyAtkValue}
                                            numberOfLines={1}>
                                            {attributes.physicalAtk}
                                        </Text>
                                        <Image
                                            style={styles.statsIcon}
                                            source={getImage(
                                                'icon_physical_resist',
                                            )}
                                        />
                                        <Text
                                            style={styles.phyResValue}
                                            numberOfLines={1}>
                                            {getResistancePercent(
                                                attributes.physicalRes,
                                                userInfo.level,
                                            ).toFixed(1) + '%'}
                                        </Text>
                                        <Image
                                            style={styles.statsIcon}
                                            source={getImage('icon_critical')}
                                        />
                                        <Text
                                            style={styles.criticalValue}
                                            numberOfLines={1}>
                                            {(
                                                attributes.critical * 100
                                            ).toFixed(1) + '%'}
                                        </Text>
                                    </View>
                                    <View style={styles.attributesRow_2}>
                                        <Image
                                            style={styles.statsIcon}
                                            source={getImage(
                                                'icon_magical_attack',
                                            )}
                                        />
                                        <Text
                                            style={styles.magAtkValue}
                                            numberOfLines={1}>
                                            {attributes.magicalAtk}
                                        </Text>
                                        <Image
                                            style={styles.statsIcon}
                                            source={getImage(
                                                'icon_magical_resist',
                                            )}
                                        />
                                        <Text
                                            style={styles.magResValue}
                                            numberOfLines={1}>
                                            {getResistancePercent(
                                                attributes.magicalRes,
                                                userInfo.level,
                                            ).toFixed(1) + '%'}
                                        </Text>
                                        <Image
                                            style={styles.statsIcon}
                                            source={getImage('icon_dodge')}
                                        />
                                        <Text
                                            style={styles.dodgeValue}
                                            numberOfLines={1}>
                                            {(attributes.dodge * 100).toFixed(
                                                1,
                                            ) + '%'}
                                        </Text>
                                    </View>
                                    <View style={styles.healthContainer}>
                                        <Image
                                            style={styles.healthIcon}
                                            source={getImage('icon_health')}
                                        />
                                        <View
                                            style={
                                                styles.healthProgressContainer
                                            }>
                                            <ProgressBar
                                                progress={1}
                                                image={'progress_bar_health'}
                                            />
                                            <Text style={styles.healthText}>
                                                {attributes.health +
                                                    ' / ' +
                                                    attributes.health}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.effectsContainer}>
                                        {/* eslint-disable-next-line react-native/no-inline-styles */}
                                        <View style={{width: '10%'}} />
                                        <FlatList
                                            horizontal
                                            scrollEnabled={false}
                                            data={[]}
                                            keyExtractor={(_item, index) =>
                                                index.toString()
                                            }
                                            renderItem={() => (
                                                <Image
                                                    style={styles.effectIcon}
                                                    source={getImage(
                                                        'icon_slot',
                                                    )}
                                                    resizeMode={'stretch'}
                                                />
                                            )}
                                            overScrollMode={'never'}
                                        />
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            )}
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    topContainer: {
        flexDirection: 'row',
        margin: 12,
    },
    logBackground: {
        flex: 1,
        width: '100%',
    },
    logContainer: {
        flexDirection: 'row',
    },
    actionbarBackground: {
        width: '100%',
    },
    actionbarContainer: {
        flexDirection: 'row',
        marginTop: 14,
        marginBottom: 16,
        marginStart: 8,
        marginEnd: 8,
    },
    bottomContainer: {
        flexDirection: 'row',
        margin: 12,
    },
    avatarContainer: {
        aspectRatio: 1,
        width: '33%',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    avatarFrame: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    attributesContainer: {
        flex: 1,
        marginTop: 4,
        marginStart: 4,
        marginEnd: 4,
    },
    attributesRow_1: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    attributesRow_2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statsIcon: {
        aspectRatio: 1,
        width: '10%',
        marginStart: 4,
        marginEnd: 4,
    },
    phyAtkValue: {
        flex: 1,
        color: colors.physicalAtk_color,
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
    phyResValue: {
        flex: 1,
        color: colors.physicalRes_color,
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
    criticalValue: {
        flex: 1,
        color: colors.critical_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    dodgeValue: {
        flex: 1,
        color: colors.dodge_color,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    healthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginStart: 0,
        marginEnd: 0,
    },
    healthIcon: {
        width: '10%',
        aspectRatio: 1,
        marginStart: 4,
        marginEnd: 4,
    },
    healthProgressContainer: {
        flex: 1,
        height: 28,
    },
    healthText: {
        position: 'absolute',
        top: 1,
        alignSelf: 'center',
        color: 'white',
        fontSize: 16,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 3,
    },
    effectsContainer: {
        flexDirection: 'row',
        marginTop: 4,
        marginStart: 12,
        marginEnd: 4,
    },
    effectIcon: {
        aspectRatio: 1,
        height: Dimensions.get('screen').height / 26,
        width: undefined,
        marginStart: 1,
        marginEnd: 1,
    },
    logList: {
        margin: 20,
    },
    actionContainer: {
        flex: 1,
    },
    actionIconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 4,
    },
    actionButton: {
        width: '25%',
    },
    actionIcon: {
        aspectRatio: 1,
    },
    labelText: {
        color: colors.primary,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    cooldownText: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 18,
        fontFamily: 'Myriad',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
});
