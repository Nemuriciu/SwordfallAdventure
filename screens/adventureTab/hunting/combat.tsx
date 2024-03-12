import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    Image,
    FlatList,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store.tsx';
import {getImage} from '../../../assets/images/_index';
import {
    getCombatRewards,
    getCreatureImg,
    getCreatureName,
} from '../../../parsers/creatureParser.tsx';
import {getResistancePercent} from '../../../parsers/attributeParser.tsx';
import {colors} from '../../../utils/colors.ts';
import ProgressBar from '../../../components/progressBar.tsx';
import {strings} from '../../../utils/strings.ts';
import {LogText} from '../../../components/logText.tsx';
import {
    combatHide,
    combatSetLog,
    combatUpdate,
} from '../../../redux/slices/combatSlice.tsx';
import {rand} from '../../../parsers/itemParser.tsx';
import {Creature} from '../../../types/creature.ts';
import cloneDeep from 'lodash.clonedeep';
import {rewardsModalInit} from '../../../redux/slices/rewardsModalSlice.tsx';
import {OrangeButton} from '../../../components/orangeButton.tsx';
import {huntingUpdate} from '../../../redux/slices/huntingSlice.tsx';

export function Combat() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const attributes = useSelector((state: RootState) => state.attributes);
    const hunting = useSelector((state: RootState) => state.hunting);
    const combat = useSelector((state: RootState) => state.combat);
    const [combatComplete, setCombatComplete] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();
    const didMount = useRef(1);

    useEffect(() => {
        if (!didMount.current) {
            if (combat.creature) {
                /* Continue Combat */
                if (
                    combat.statsPlayer.health > 0 &&
                    combat.statsEnemy.health > 0
                ) {
                    if (!combat.playerTurn) {
                        /* Enemy Attack */
                        setTimeout(() => {
                            simulateAttack(combat.playerTurn, null, 'Physical'); //TODO:
                        }, 500);
                    } else {
                        setTimeout(() => {
                            setDisabled(false);
                        }, 500);
                    }
                    /* End Combat */
                } else {
                    const combatLog = cloneDeep(combat.combatLog);
                    if (!combat.playerTurn) {
                        /* Player Win */
                        combatLog.push({
                            username: userInfo.username,
                            opponent: getCreatureName(
                                (combat.creature as Creature).id,
                            ),
                            turn: combat.playerTurn,
                            atkType: 'Win',
                            damage: 0,
                        });
                        /* Show Defeated Log */
                        setTimeout(() => {
                            dispatch(combatSetLog(combatLog));
                        }, 100);

                        setTimeout(() => {
                            dispatch(
                                rewardsModalInit(
                                    getCombatRewards(
                                        (combat.creature as Creature).rarity,
                                        hunting.depth,
                                        (combat.creature as Creature).level,
                                    ),
                                ),
                            );
                        }, 500);

                        setTimeout(() => {
                            setCombatComplete(true);
                        }, 500);

                        const creatureList = cloneDeep(hunting.creatureList);
                        creatureList.splice(combat.index, 1);
                        dispatch(
                            huntingUpdate({
                                depth: hunting.depth,
                                creatureList: creatureList,
                                killCount: hunting.killCount + 1,
                            }),
                        );
                    } else {
                        /* Enemy Win */
                        combatLog.push({
                            username: getCreatureName(
                                (combat.creature as Creature).id,
                            ),
                            opponent: userInfo.username,
                            turn: combat.playerTurn,
                            atkType: 'Win',
                            damage: 0,
                        });
                        /* Show Defeated Log */
                        setTimeout(() => {
                            dispatch(combatSetLog(combatLog));
                        }, 100);

                        setTimeout(() => {
                            setCombatComplete(true);
                        }, 250);
                    }
                }
            }
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [combat.playerTurn]);

    function simulateAttack(turn: boolean, skill: null, atkType: string) {
        const statsPlayer = cloneDeep(combat.statsPlayer);
        const statsEnemy = cloneDeep(combat.statsEnemy);
        const combatLog = cloneDeep(combat.combatLog);
        const creature = combat.creature as Creature;
        const r = Math.random();

        /* Player Turn */
        if (turn) {
            setDisabled(turn);
            /* Skill Attack */
            if (skill != null) {
                /* Spell */
                /*if (skill.type === SkillType.Spell) {
                        /!* Miss Spell *!/
                        if (rand <= this.dodgeEnemy) {
                            log = this.addColoredSpan(
                                this.pName,
                                ` cast ${skill.name} and missed.`,
                                'Dodge',
                                true,
                            );
                            this.combatLog.push(log);
                        } else {
                            let damage: number = this.getSpellDamage(
                                skill,
                                this.levelEnemy,
                                true,
                            );
                            /!* Check if critical hit *!/
                            if (Math.random() <= this.critPlayer) {
                                damage = Math.round(damage * 1.5);
                                log = this.addColoredSpan(
                                    this.pName,
                                    ` cast ${skill.name} dealing ${damage}`,
                                    skill.element === 'Physical'
                                        ? 'PhysicalCrit'
                                        : 'MagicalCrit',
                                    true,
                                );
                                this.combatLog.push(log);
                            } else {
                                log = this.addColoredSpan(
                                    this.pName,
                                    ` cast ${skill.name} dealing ${damage}`,
                                    skill.element,
                                    true,
                                );
                                this.combatLog.push(log);
                            }

                            this.currentHealthEnemy = Math.max(
                                this.currentHealthEnemy - damage,
                                0,
                            );

                            if (this.currentHealthEnemy > 0) {
                                /!* Decrease Player Buffs *!/
                                this.effectsPlayer = this.effectsPlayer.map(effect => {
                                    if (effect.isBuff) {
                                        if (effect.turns === 1)
                                            this.removeEffect(
                                                effect,
                                                this.levelPlayer,
                                                true,
                                            );
                                        effect.turns -= 1;
                                    }
                                    return effect;
                                });
                                /!* Decrease Enemy Debuffs *!/
                                this.effectsEnemy = this.effectsEnemy.map(effect => {
                                    if (!effect.isBuff && !effect.isDot) {
                                        if (effect.turns === 1)
                                            this.removeEffect(
                                                effect,
                                                this.levelEnemy,
                                                true,
                                            );
                                        effect.turns -= 1;
                                    }
                                    return effect;
                                });
                                /!* Clear finished effects *!/
                                this.effectsEnemy = this.effectsEnemy.filter(
                                    effect => effect.turns > 0,
                                );
                                this.effectsPlayer = this.effectsPlayer.filter(
                                    effect => effect.turns > 0,
                                );
                                /!* Apply Spell secondary effect *!/
                                this.applySpellSecondary(skill, true);
                            }
                        }
                    }*/
            } else {
                /* Basic Attack */
                if (r <= statsEnemy.dodge) {
                    combatLog.push({
                        username: userInfo.username,
                        opponent: getCreatureName(creature.id),
                        turn: turn,
                        atkType: 'Dodge',
                        damage: 0,
                    });
                } else {
                    let damage: number = getBasicDamage(
                        atkType,
                        creature.level,
                        turn,
                    );
                    /* Check if critical hit */
                    if (Math.random() <= statsPlayer.critical) {
                        damage = Math.round(damage * 1.5);
                        combatLog.push({
                            username: userInfo.username,
                            opponent: getCreatureName(creature.id),
                            turn: turn,
                            atkType: atkType + 'Crit',
                            damage: damage,
                        });
                    } else {
                        combatLog.push({
                            username: userInfo.username,
                            opponent: getCreatureName(creature.id),
                            turn: turn,
                            atkType: atkType,
                            damage: damage,
                        });
                    }

                    statsEnemy.health = Math.max(statsEnemy.health - damage, 0);
                    /* Effects */
                    if (statsEnemy.health > 0) {
                        /* Decrease Player Buffs */
                        /*this.effectsPlayer = this.effectsPlayer.map(effect => {
                            if (effect.isBuff) {
                                if (effect.turns === 1)
                                    this.removeEffect(
                                        effect,
                                        this.levelPlayer,
                                        true,
                                    );
                                effect.turns -= 1;
                            }
                            return effect;
                        });*/
                        /* Decrease Enemy Debuffs */
                        /*this.effectsEnemy = this.effectsEnemy.map(effect => {
                            if (!effect.isBuff && !effect.isDot) {
                                if (effect.turns === 1)
                                    this.removeEffect(
                                        effect,
                                        this.levelEnemy,
                                        true,
                                    );
                                effect.turns -= 1;
                            }
                            return effect;
                        });*/
                        /* Clear finished effects */
                        /*this.effectsEnemy = this.effectsEnemy.filter(
                            effect => effect.turns > 0,
                        );*/
                        /*this.effectsPlayer = this.effectsPlayer.filter(
                            effect => effect.turns > 0,
                        );*/
                    }
                }
            }
            /* Apply DoT + Update Adapters */
            /*if (this.currentHealthEnemy > 0) {
                for (const effect of this.effectsPlayer) {
                    /!* Apply DoTs *!/
                    if (effect.isDot) {
                        let damage: number = this.getDebuffDamage(
                            effect,
                            this.levelEnemy,
                            true,
                        );
                        this.currentHealthPlayer = Math.max(
                            this.currentHealthPlayer - damage,
                            0,
                        );

                        combatLog = this.addColoredSpan(
                            this.pName,
                            ` took ${damage}`,
                            effect.effectType.name(),
                            false,
                        );
                        this.combatLog.push(combatLog);
                        effect.turns -= 1;

                        if (this.currentHealthPlayer <= 0)
                            return new SimulationResult(
                                100,
                                100,
                                this.currentHealthPlayer,
                                this.currentHealthEnemy,
                                this.combatLog,
                            );
                    }
                }*/
            /* Clear finished effects */
            /*this.effectsPlayer = this.effectsPlayer.filter(
                    effect => effect.turns > 0,
                );*/
            /* Update Effects List */
            //this.effectsPlayerAdapter.notifyDataSetChanged();
            //this.effectsEnemyAdapter.notifyDataSetChanged();
        } else {
            /* Skill Attack */
            if (skill != null) {
                /* Spell */
                /*if (skill.type === SkillType.Spell) {
                        /!* Miss Spell *!/
                        if (rand <= this.dodgeEnemy) {
                            log = this.addColoredSpan(
                                this.pName,
                                ` cast ${skill.name} and missed.`,
                                'Dodge',
                                true,
                            );
                            this.combatLog.push(log);
                        } else {
                            let damage: number = this.getSpellDamage(
                                skill,
                                this.levelEnemy,
                                true,
                            );
                            /!* Check if critical hit *!/
                            if (Math.random() <= this.critPlayer) {
                                damage = Math.round(damage * 1.5);
                                log = this.addColoredSpan(
                                    this.pName,
                                    ` cast ${skill.name} dealing ${damage}`,
                                    skill.element === 'Physical'
                                        ? 'PhysicalCrit'
                                        : 'MagicalCrit',
                                    true,
                                );
                                this.combatLog.push(log);
                            } else {
                                log = this.addColoredSpan(
                                    this.pName,
                                    ` cast ${skill.name} dealing ${damage}`,
                                    skill.element,
                                    true,
                                );
                                this.combatLog.push(log);
                            }

                            this.currentHealthEnemy = Math.max(
                                this.currentHealthEnemy - damage,
                                0,
                            );

                            if (this.currentHealthEnemy > 0) {
                                /!* Decrease Player Buffs *!/
                                this.effectsPlayer = this.effectsPlayer.map(effect => {
                                    if (effect.isBuff) {
                                        if (effect.turns === 1)
                                            this.removeEffect(
                                                effect,
                                                this.levelPlayer,
                                                true,
                                            );
                                        effect.turns -= 1;
                                    }
                                    return effect;
                                });
                                /!* Decrease Enemy Debuffs *!/
                                this.effectsEnemy = this.effectsEnemy.map(effect => {
                                    if (!effect.isBuff && !effect.isDot) {
                                        if (effect.turns === 1)
                                            this.removeEffect(
                                                effect,
                                                this.levelEnemy,
                                                true,
                                            );
                                        effect.turns -= 1;
                                    }
                                    return effect;
                                });
                                /!* Clear finished effects *!/
                                this.effectsEnemy = this.effectsEnemy.filter(
                                    effect => effect.turns > 0,
                                );
                                this.effectsPlayer = this.effectsPlayer.filter(
                                    effect => effect.turns > 0,
                                );
                                /!* Apply Spell secondary effect *!/
                                this.applySpellSecondary(skill, true);
                            }
                        }
                    }*/
            } else {
                /* Basic Attack */
                if (r <= statsPlayer.dodge) {
                    combatLog.push({
                        username: getCreatureName(creature.id),
                        opponent: userInfo.username,
                        turn: turn,
                        atkType: 'Dodge',
                        damage: 0,
                    });
                } else {
                    let damage: number = getBasicDamage(
                        atkType,
                        userInfo.level,
                        turn,
                    );
                    /* Check if critical hit */
                    if (Math.random() <= statsPlayer.critical) {
                        damage = Math.round(damage * 1.5);
                        combatLog.push({
                            username: getCreatureName(creature.id),
                            opponent: userInfo.username,
                            turn: turn,
                            atkType: atkType + 'Crit',
                            damage: damage,
                        });
                    } else {
                        combatLog.push({
                            username: getCreatureName(creature.id),
                            opponent: userInfo.username,
                            turn: turn,
                            atkType: atkType,
                            damage: damage,
                        });
                    }

                    statsPlayer.health = Math.max(
                        statsPlayer.health - damage,
                        0,
                    );
                    /* Effects */
                    if (statsPlayer.health > 0) {
                        /* Decrease Player Buffs */
                        /*this.effectsPlayer = this.effectsPlayer.map(effect => {
                            if (effect.isBuff) {
                                if (effect.turns === 1)
                                    this.removeEffect(
                                        effect,
                                        this.levelPlayer,
                                        true,
                                    );
                                effect.turns -= 1;
                            }
                            return effect;
                        });*/
                        /* Decrease Enemy Debuffs */
                        /*this.effectsEnemy = this.effectsEnemy.map(effect => {
                            if (!effect.isBuff && !effect.isDot) {
                                if (effect.turns === 1)
                                    this.removeEffect(
                                        effect,
                                        this.levelEnemy,
                                        true,
                                    );
                                effect.turns -= 1;
                            }
                            return effect;
                        });*/
                        /* Clear finished effects */
                        /*this.effectsEnemy = this.effectsEnemy.filter(
                            effect => effect.turns > 0,
                        );*/
                        /*this.effectsPlayer = this.effectsPlayer.filter(
                            effect => effect.turns > 0,
                        );*/
                    }
                }
            }
            /* Apply DoT + Update Adapters */
            /*if (this.currentHealthEnemy > 0) {
                for (const effect of this.effectsPlayer) {
                    /!* Apply DoTs *!/
                    if (effect.isDot) {
                        let damage: number = this.getDebuffDamage(
                            effect,
                            this.levelEnemy,
                            true,
                        );
                        this.currentHealthPlayer = Math.max(
                            this.currentHealthPlayer - damage,
                            0,
                        );

                        combatLog = this.addColoredSpan(
                            this.pName,
                            ` took ${damage}`,
                            effect.effectType.name(),
                            false,
                        );
                        this.combatLog.push(combatLog);
                        effect.turns -= 1;

                        if (this.currentHealthPlayer <= 0)
                            return new SimulationResult(
                                100,
                                100,
                                this.currentHealthPlayer,
                                this.currentHealthEnemy,
                                this.combatLog,
                            );
                    }
                }*/
            /* Clear finished effects */
            /*this.effectsPlayer = this.effectsPlayer.filter(
                    effect => effect.turns > 0,
                );*/
            /* Update Effects List */
            //this.effectsPlayerAdapter.notifyDataSetChanged();
            //this.effectsEnemyAdapter.notifyDataSetChanged();
        }

        dispatch(combatUpdate([statsPlayer, statsEnemy, [], [], combatLog]));
    }

    function getBasicDamage(
        atkType: string,
        level: number,
        turn: boolean,
    ): number {
        let attack: number, resistance: number;
        /* Set attack type */
        if (turn) {
            attack =
                atkType === 'Physical'
                    ? combat.statsPlayer.physicalAtk
                    : combat.statsPlayer.magicalAtk;
            resistance =
                atkType === 'Physical'
                    ? combat.statsEnemy.physicalRes
                    : combat.statsEnemy.magicalRes;
        } else {
            attack =
                atkType === 'Physical'
                    ? combat.statsEnemy.physicalAtk
                    : combat.statsEnemy.magicalAtk;
            resistance =
                atkType === 'Physical'
                    ? combat.statsPlayer.physicalRes
                    : combat.statsPlayer.magicalRes;
        }

        let damage: number = Math.round(
            attack - attack * (getResistancePercent(resistance, level) / 100),
        );

        return rand(Math.round(damage * 0.97), Math.round(damage * 1.03));
    }

    function leaveCombat() {
        dispatch(combatHide());
        setDisabled(false);
        setTimeout(() => {
            setCombatComplete(false);
        }, 500);
    }

    // noinspection RequiredAttributes
    return (
        <Modal
            /* eslint-disable-next-line react-native/no-inline-styles */
            style={{margin: 0}}
            animationIn={'zoomIn'}
            animationOut={'fadeOut'}
            animationInTiming={500}
            isVisible={combat.modalVisible}
            hideModalContentWhileAnimating={true}
            useNativeDriver={true}
            hasBackdrop={false}
            onBackButtonPress={() => {
                dispatch(combatHide());
                setDisabled(false);
                setCombatComplete(false);
            }}>
            <View style={styles.container}>
                {/* Creature Info */}
                {combat.creature && (
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
                                                progress={
                                                    combat.statsEnemy.health /
                                                    (combat.creature.stats
                                                        .health +
                                                        combat.creature.stats
                                                            .bonusHealth)
                                                }
                                                image={'progress_bar_health'}
                                            />
                                            <Text style={styles.healthText}>
                                                {combat.statsEnemy.health +
                                                    ' / ' +
                                                    (combat.creature.stats
                                                        .health +
                                                        combat.creature.stats
                                                            .bonusHealth)}
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
                )}
                {/* Combat Log */}
                {combat.creature && (
                    <ImageBackground
                        style={styles.logBackground}
                        source={getImage('background_log')}
                        resizeMode={'stretch'}>
                        <View style={styles.logContainer}>
                            <FlatList
                                style={styles.logList}
                                data={combat.combatLog}
                                keyExtractor={(_item, index) =>
                                    index.toString()
                                }
                                renderItem={({item}) => (
                                    //@ts-ignore
                                    <LogText log={item} />
                                )}
                                overScrollMode={'never'}
                                inverted={true}
                                /* eslint-disable-next-line react-native/no-inline-styles */
                                contentContainerStyle={{
                                    flexDirection: 'column-reverse',
                                }}
                            />
                        </View>
                    </ImageBackground>
                )}
                {/* Actionbar */}
                {combat.creature && (
                    <View>
                        <ImageBackground
                            style={styles.actionbarBackground}
                            source={getImage('background_actionbar')}
                            resizeMode={'stretch'}>
                            <View style={styles.actionbarContainer}>
                                {combatComplete && (
                                    <OrangeButton
                                        style={styles.leaveButton}
                                        title={'Leave Combat'}
                                        onPress={() => leaveCombat()}
                                    />
                                )}
                                {!combatComplete && (
                                    <View style={styles.actionContainer}>
                                        <Text style={styles.labelText}>
                                            {strings.basic_attack}
                                        </Text>
                                        <View
                                            style={styles.actionIconContainer}>
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                disabled={disabled}
                                                activeOpacity={0.1}
                                                onPress={() =>
                                                    simulateAttack(
                                                        true,
                                                        null,
                                                        'Physical',
                                                    )
                                                }>
                                                <ImageBackground
                                                    style={styles.actionIcon}
                                                    source={getImage(
                                                        'skills_icon_basic_physical',
                                                    )}
                                                    resizeMode={'stretch'}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                disabled={disabled}
                                                onPress={() =>
                                                    simulateAttack(
                                                        true,
                                                        null,
                                                        'Magical',
                                                    )
                                                }>
                                                <ImageBackground
                                                    style={styles.actionIcon}
                                                    source={getImage(
                                                        'skills_icon_basic_magical',
                                                    )}
                                                    resizeMode={'stretch'}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                                {!combatComplete && (
                                    <View style={styles.actionContainer}>
                                        <Text style={styles.labelText}>
                                            {strings.spells}
                                        </Text>
                                        <View
                                            style={styles.actionIconContainer}>
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                disabled={disabled}>
                                                <ImageBackground
                                                    style={styles.actionIcon}
                                                    source={getImage(
                                                        'skills_icon_frame',
                                                    )}
                                                    resizeMode={'stretch'}>
                                                    <Text
                                                        style={
                                                            styles.cooldownText
                                                        }>
                                                        1
                                                    </Text>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                disabled={disabled}>
                                                <ImageBackground
                                                    style={styles.actionIcon}
                                                    source={getImage(
                                                        'skills_icon_frame',
                                                    )}
                                                    resizeMode={'stretch'}>
                                                    <Text
                                                        style={
                                                            styles.cooldownText
                                                        }>
                                                        1
                                                    </Text>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                disabled={disabled}>
                                                <ImageBackground
                                                    style={styles.actionIcon}
                                                    source={getImage(
                                                        'skills_icon_frame',
                                                    )}
                                                    resizeMode={'stretch'}>
                                                    <Text
                                                        style={
                                                            styles.cooldownText
                                                        }>
                                                        1
                                                    </Text>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </ImageBackground>
                    </View>
                )}
                {/* Player Info */}
                {combat.creature && (
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
                                                progress={
                                                    combat.statsPlayer.health /
                                                    attributes.health
                                                }
                                                image={'progress_bar_health'}
                                            />
                                            <Text style={styles.healthText}>
                                                {combat.statsPlayer.health +
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
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
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
        justifyContent: 'center',
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
    leaveButton: {
        aspectRatio: 3.5,
        width: '40%',
        margin: 12,
    },
});
