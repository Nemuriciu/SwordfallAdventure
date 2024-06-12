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
    getCombatExperience,
    getCombatRewards,
    getCombatShards,
    getCreature,
    getCreatureImg,
    getCreatureName,
} from '../../../parsers/creatureParser.tsx';
import {getResistancePercent} from '../../../parsers/attributeParser.tsx';
import {colors} from '../../../utils/colors.ts';
import ProgressBar from '../../../components/progressBar.tsx';
import {strings} from '../../../utils/strings.ts';
import {LogText} from './logText.tsx';
import {
    combatHide,
    combatSetLog,
    combatUpdate,
} from '../../../redux/slices/combatSlice.tsx';
import {rand} from '../../../parsers/itemParser.tsx';
import {Creature} from '../../../types/creature.ts';
import cloneDeep from 'lodash.clonedeep';
import {rewardsModalInit} from '../../../redux/slices/rewardsModalSlice.tsx';
import {ButtonType, CustomButton} from '../../../components/customButton.tsx';
import {huntingUpdate} from '../../../redux/slices/huntingSlice.tsx';
import {missionsSetList} from '../../../redux/slices/missionsSlice.tsx';
import {
    isMissionComplete,
    sortMissions,
} from '../../../parsers/questParser.tsx';
import {
    getSkillCooldown,
    getSkillEffectTurns,
    getSkillEffectType,
    getSkillElement,
    getSkillImg,
    getSkillName,
    getSkillPrimaryEffect,
    getSkillSecondaryEffect,
} from '../../../parsers/skillParser.tsx';
import {Skill} from '../../../types/skill.ts';
import {Effect, EffectType} from '../../../types/effect.ts';
import {Stats} from '../../../types/stats.ts';

export function Combat() {
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const attributes = useSelector((state: RootState) => state.attributes);
    const missions = useSelector((state: RootState) => state.missions);
    const hunting = useSelector((state: RootState) => state.hunting);
    const combat = useSelector((state: RootState) => state.combat);
    const skills = useSelector((state: RootState) => state.skills);
    const [combatComplete, setCombatComplete] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [cooldown_1, setCooldown_1] = useState(0);
    const [cooldown_2, setCooldown_2] = useState(0);
    const [cooldown_3, setCooldown_3] = useState(0);
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
                        }, 400);
                    } else {
                        /* Reduce cooldowns */
                        setTimeout(() => {
                            setCooldown_1(Math.max(cooldown_1 - 1, 0));
                            setCooldown_2(Math.max(cooldown_2 - 1, 0));
                            setCooldown_3(Math.max(cooldown_3 - 1, 0));
                        }, 50);
                        /* Enable all action buttons */
                        setTimeout(() => {
                            setDisabled(false);
                        }, 400);
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
                        /* Show Victory Log */
                        setTimeout(() => {
                            dispatch(combatSetLog(combatLog));
                        }, 200);
                        /* Display Rewards */
                        setTimeout(() => {
                            dispatch(
                                rewardsModalInit({
                                    rewards: getCombatRewards(
                                        (combat.creature as Creature).rarity,
                                        hunting.depth,
                                        (combat.creature as Creature).level,
                                    ),
                                    experience: getCombatExperience(
                                        (combat.creature as Creature).rarity,
                                        (combat.creature as Creature).level,
                                    ),
                                    shards: getCombatShards(
                                        (combat.creature as Creature).rarity,
                                        (combat.creature as Creature).level,
                                    ),
                                }),
                            );
                        }, 250);

                        setTimeout(() => {
                            setCombatComplete(true);
                        }, 500);

                        /* Update Missions */
                        const missionsList = cloneDeep(missions.missionsList);

                        for (let i = 0; i < missionsList.length; i++) {
                            let mission = missionsList[i];
                            if (
                                mission.isActive &&
                                !isMissionComplete(mission) &&
                                mission.type === 'hunt'
                            ) {
                                if (
                                    mission.description.includes(
                                        getCreatureName(
                                            (combat.creature as Creature).id,
                                        ),
                                    )
                                ) {
                                    mission.progress += 1;
                                }
                            }
                        }
                        sortMissions(missionsList);
                        setTimeout(() => {
                            dispatch(missionsSetList(missionsList));
                        }, 1500);

                        /* Remove Creature from list */
                        const creatureList = cloneDeep(hunting.creatureList);
                        creatureList.splice(combat.index, 1);

                        /* Roll for chance to add new creature */
                        const r = Math.random();
                        /* 10% chance to add 0 creatures */
                        if (r <= 0.2) {
                            /* 20% chance to add 2 creatures */
                            creatureList.unshift(
                                getCreature(userInfo.level, hunting.depth),
                                getCreature(userInfo.level, hunting.depth),
                            );
                        } else if (r > 0.2 && r <= 0.9) {
                            /* 70% chance to add 1 creature */
                            creatureList.unshift(
                                getCreature(userInfo.level, hunting.depth),
                            );
                        }

                        setTimeout(() => {
                            dispatch(
                                huntingUpdate({
                                    depth: hunting.depth,
                                    creatureList: creatureList,
                                    killCount: hunting.killCount + 1,
                                }),
                            );
                        }, 1000);
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

                        /* Remove Creature from list */
                        const creatureList = cloneDeep(hunting.creatureList);
                        creatureList.splice(combat.index, 1);

                        /* Roll for chance to add new creature */
                        const r = Math.random();
                        /* 10% chance to add 0 creatures */
                        if (r <= 0.2) {
                            /* 20% chance to add 2 creatures */
                            creatureList.unshift(
                                getCreature(userInfo.level, hunting.depth),
                                getCreature(userInfo.level, hunting.depth),
                            );
                        } else if (r > 0.2 && r <= 0.9) {
                            /* 70% chance to add 1 creature */
                            creatureList.unshift(
                                getCreature(userInfo.level, hunting.depth),
                            );
                        }

                        dispatch(
                            huntingUpdate({
                                depth: hunting.depth,
                                creatureList: creatureList,
                                killCount: hunting.killCount,
                            }),
                        );
                    }
                }
            }
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [combat.playerTurn]);

    function simulateAttack(
        turn: boolean,
        spell: Skill | null,
        atkType: string,
    ) {
        const statsPlayer = cloneDeep(combat.statsPlayer);
        const statsEnemy = cloneDeep(combat.statsEnemy);
        const effectsPlayer = cloneDeep(combat.effectsPlayer);
        const effectsEnemy = cloneDeep(combat.effectsEnemy);
        const combatLog = cloneDeep(combat.combatLog);
        const creature = combat.creature as Creature;

        /* Player Turn */
        if (turn) {
            setDisabled(turn);
            /* Spell Attack */
            if (spell != null) {
                /* Miss Spell */
                if (Math.random() <= statsEnemy.dodge) {
                    combatLog.push({
                        username: userInfo.username,
                        opponent: getCreatureName(creature.id),
                        turn: turn,
                        atkType: 'Spell' + atkType + 'Dodge',
                        damage: 0,
                        spellName: getSkillName(spell.id),
                    });
                } else {
                    let damage: number = getSpellDamage(
                        spell,
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
                            atkType: 'Spell' + atkType + 'Crit',
                            damage: damage,
                            spellName: getSkillName(spell.id),
                        });
                    } else {
                        combatLog.push({
                            username: userInfo.username,
                            opponent: getCreatureName(creature.id),
                            turn: turn,
                            atkType: 'Spell' + atkType,
                            damage: damage,
                            spellName: getSkillName(spell.id),
                        });
                    }

                    statsEnemy.health = Math.max(statsEnemy.health - damage, 0);
                    /* Effects */
                    if (statsEnemy.health > 0) {
                        /*/!* Decrease Player Buffs *!/
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
                        /* Apply Spell secondary effect */
                        applySpellEffect(
                            spell,
                            statsPlayer,
                            statsEnemy,
                            effectsPlayer,
                            effectsEnemy,
                            creature,
                            true,
                        );
                    }
                }
            } else {
                /* Basic Attack */
                if (Math.random() <= statsEnemy.dodge) {
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
            /* Spell Attack */
            if (spell != null) {
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
                if (Math.random() <= statsPlayer.dodge) {
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

        dispatch(
            combatUpdate([
                statsPlayer,
                statsEnemy,
                effectsPlayer,
                effectsEnemy,
                combatLog,
            ]),
        );
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
                    ? combat.statsPlayer.physicalAtk +
                      combat.statsPlayer.bonusPhysicalAtk
                    : combat.statsPlayer.magicalAtk +
                      combat.statsPlayer.bonusMagicalAtk;
            resistance =
                atkType === 'Physical'
                    ? combat.statsEnemy.physicalRes +
                      combat.statsEnemy.bonusPhysicalRes
                    : combat.statsEnemy.magicalRes +
                      combat.statsEnemy.bonusMagicalRes;
        } else {
            attack =
                atkType === 'Physical'
                    ? combat.statsEnemy.physicalAtk +
                      combat.statsEnemy.bonusPhysicalAtk
                    : combat.statsEnemy.magicalAtk +
                      combat.statsEnemy.bonusMagicalAtk;
            resistance =
                atkType === 'Physical'
                    ? combat.statsPlayer.physicalRes +
                      combat.statsPlayer.bonusPhysicalRes
                    : combat.statsPlayer.magicalRes +
                      combat.statsPlayer.bonusMagicalRes;
        }

        let damage: number = Math.round(
            attack - attack * (getResistancePercent(resistance, level) / 100),
        );

        return rand(Math.round(damage * 0.97), Math.round(damage * 1.03));
    }

    function getSpellDamage(
        spell: Skill,
        level: number,
        turn: boolean,
    ): number {
        let attack: number, resistance: number;
        const element = getSkillElement(spell.id);
        const primaryEffect = getSkillPrimaryEffect(spell.id) as number[];
        /* Set attack type */
        if (turn) {
            attack =
                element === 'Physical'
                    ? combat.statsPlayer.physicalAtk +
                      combat.statsPlayer.bonusPhysicalAtk
                    : combat.statsPlayer.magicalAtk +
                      combat.statsPlayer.bonusMagicalAtk;
            resistance =
                element === 'Physical'
                    ? combat.statsEnemy.physicalRes +
                      combat.statsEnemy.bonusPhysicalRes
                    : combat.statsEnemy.magicalRes +
                      combat.statsEnemy.bonusMagicalRes;
        } else {
            attack =
                element === 'Physical'
                    ? combat.statsEnemy.physicalAtk +
                      combat.statsEnemy.bonusPhysicalAtk
                    : combat.statsEnemy.magicalAtk +
                      combat.statsEnemy.bonusMagicalAtk;
            resistance =
                element === 'Physical'
                    ? combat.statsPlayer.physicalRes +
                      combat.statsPlayer.bonusPhysicalRes
                    : combat.statsPlayer.magicalRes +
                      combat.statsPlayer.bonusMagicalRes;
        }

        let damage: number = Math.round(
            primaryEffect[0] * attack -
                primaryEffect[0] *
                    attack *
                    (getResistancePercent(resistance, level) / 100),
        );

        return rand(Math.round(damage * 0.97), Math.round(damage * 1.03));
    }

    function applySpellEffect(
        spell: Skill,
        statsPlayer: Stats,
        statsEnemy: Stats,
        effectsPlayer: Effect[],
        effectsEnemy: Effect[],
        creature: Creature,
        turn: boolean,
    ) {
        const skillSecondary = getSkillSecondaryEffect(spell.id);
        let secondaryEffect, turns, effectType;
        if (skillSecondary !== undefined && skillSecondary.length) {
            secondaryEffect = skillSecondary[0];
            turns = getSkillEffectTurns(spell.id);
            effectType = getSkillEffectType(spell.id) as string;
        } else {
            return;
        }

        const effect: Effect = {
            id: Math.random().toString(16).slice(2),
            type: EffectType[effectType as keyof typeof EffectType],
            turns: turns !== undefined ? turns : 0,
            value: 0,
        };

        /* Handle Effect Types */
        switch (effect.type) {
            case EffectType.Bleeding:
                if (turn) {
                    effect.value =
                        secondaryEffect *
                        (combat.statsPlayer.physicalAtk +
                            combat.statsPlayer.bonusPhysicalAtk);
                    effectsEnemy.push(effect);
                } else {
                    effect.value =
                        secondaryEffect *
                        (combat.statsEnemy.physicalAtk +
                            combat.statsEnemy.bonusPhysicalAtk);
                    effectsPlayer.push(effect);
                }
                break;
            case EffectType.Poison:
                if (turn) {
                    effect.value =
                        secondaryEffect *
                        (combat.statsPlayer.physicalAtk +
                            combat.statsPlayer.bonusPhysicalAtk);
                    effectsEnemy.push(effect);
                } else {
                    effect.value =
                        secondaryEffect *
                        (combat.statsEnemy.physicalAtk +
                            combat.statsEnemy.bonusPhysicalAtk);
                    effectsPlayer.push(effect);
                }
                break;
            case EffectType.Burning:
                if (turn) {
                    effect.value =
                        secondaryEffect *
                        (combat.statsPlayer.magicalAtk +
                            combat.statsPlayer.bonusMagicalAtk);
                    effectsEnemy.push(effect);
                } else {
                    effect.value =
                        secondaryEffect *
                        (combat.statsEnemy.magicalAtk +
                            combat.statsEnemy.bonusMagicalAtk);
                    effectsPlayer.push(effect);
                }
                break;
            case EffectType.Healing:
                if (turn) {
                    statsPlayer.health = Math.min(
                        statsPlayer.health +
                            Math.round(
                                secondaryEffect * combat.statsPlayer.health,
                            ),
                        attributes.health + attributes.bonusHealth,
                    );
                    //TODO: Log healing effect.
                } else {
                    statsEnemy.health = Math.min(
                        statsEnemy.health +
                            Math.round(
                                secondaryEffect * combat.statsEnemy.health,
                            ),
                        creature.stats.health + creature.stats.bonusHealth,
                    );
                    //TODO: Log healing effect.
                }
                break;
            case EffectType.PhyAtkInc:
                if (turn) {
                    effect.value = Math.round(
                        secondaryEffect *
                            (combat.statsPlayer.physicalAtk +
                                combat.statsPlayer.bonusPhysicalAtk),
                    );
                    statsPlayer.bonusPhysicalAtk += effect.value;
                    effectsPlayer.push(effect);
                } else {
                    effect.value = Math.round(
                        secondaryEffect *
                            (combat.statsPlayer.physicalAtk +
                                combat.statsPlayer.bonusPhysicalAtk),
                    );
                    statsEnemy.bonusPhysicalAtk += effect.value;
                    effectsEnemy.push(effect);
                }
                break;
            case EffectType.PhyAtkDec:
                if (turn) {
                    effect.value = Math.round(
                        -secondaryEffect *
                            (combat.statsEnemy.physicalAtk +
                                combat.statsEnemy.bonusPhysicalAtk),
                    );
                    statsEnemy.bonusPhysicalAtk -= effect.value;
                    effectsEnemy.push(effect);
                } else {
                    effect.value = Math.round(
                        -secondaryEffect *
                            (combat.statsPlayer.physicalAtk +
                                combat.statsPlayer.bonusPhysicalAtk),
                    );
                    statsPlayer.bonusPhysicalAtk -= effect.value;
                    effectsPlayer.push(effect);
                }
                break;
            case EffectType.MagAtkInc:
                if (turn) {
                    effect.value = Math.round(
                        secondaryEffect *
                            (combat.statsPlayer.magicalAtk +
                                combat.statsPlayer.bonusMagicalAtk),
                    );
                    statsPlayer.bonusMagicalAtk += effect.value;
                    effectsPlayer.push(effect);
                } else {
                    effect.value = Math.round(
                        secondaryEffect *
                            (combat.statsPlayer.magicalAtk +
                                combat.statsPlayer.bonusMagicalAtk),
                    );
                    statsEnemy.bonusMagicalAtk += effect.value;
                    effectsEnemy.push(effect);
                }
                break;
            case EffectType.MagAtkDec:
                if (turn) {
                    effect.value = Math.round(
                        -secondaryEffect *
                            (combat.statsEnemy.magicalAtk +
                                combat.statsEnemy.bonusMagicalAtk),
                    );
                    statsEnemy.bonusMagicalAtk -= effect.value;
                    effectsEnemy.push(effect);
                } else {
                    effect.value = Math.round(
                        -secondaryEffect *
                            (combat.statsPlayer.magicalAtk +
                                combat.statsPlayer.bonusMagicalAtk),
                    );
                    statsPlayer.bonusMagicalAtk -= effect.value;
                    effectsPlayer.push(effect);
                }
                break;
            case EffectType.PhyResInc:
                if (turn) {
                    effect.value = Math.round(
                        secondaryEffect *
                            (combat.statsPlayer.physicalRes +
                                combat.statsPlayer.bonusPhysicalRes),
                    );
                    statsPlayer.bonusPhysicalRes += effect.value;
                    effectsPlayer.push(effect);
                } else {
                    effect.value = Math.round(
                        secondaryEffect *
                            (combat.statsPlayer.physicalRes +
                                combat.statsPlayer.bonusPhysicalRes),
                    );
                    statsEnemy.bonusPhysicalRes += effect.value;
                    effectsEnemy.push(effect);
                }
                break;
            case EffectType.PhyResDec:
                if (turn) {
                    effect.value = Math.round(
                        -secondaryEffect *
                            (combat.statsEnemy.physicalRes +
                                combat.statsEnemy.bonusPhysicalRes),
                    );
                    statsEnemy.bonusPhysicalRes -= effect.value;
                    effectsEnemy.push(effect);
                } else {
                    effect.value = Math.round(
                        -secondaryEffect *
                            (combat.statsPlayer.physicalRes +
                                combat.statsPlayer.bonusPhysicalRes),
                    );
                    statsPlayer.bonusPhysicalRes -= effect.value;
                    effectsPlayer.push(effect);
                }
                break;
            case EffectType.MagResInc:
                if (turn) {
                    effect.value = Math.round(
                        secondaryEffect *
                            (combat.statsPlayer.magicalRes +
                                combat.statsPlayer.bonusMagicalRes),
                    );
                    statsPlayer.bonusMagicalRes += effect.value;
                    effectsPlayer.push(effect);
                } else {
                    effect.value = Math.round(
                        secondaryEffect *
                            (combat.statsPlayer.magicalRes +
                                combat.statsPlayer.bonusMagicalRes),
                    );
                    statsEnemy.bonusMagicalRes += effect.value;
                    effectsEnemy.push(effect);
                }
                break;
            case EffectType.MagResDec:
                if (turn) {
                    effect.value = Math.round(
                        -secondaryEffect *
                            (combat.statsEnemy.magicalRes +
                                combat.statsEnemy.bonusMagicalRes),
                    );
                    statsEnemy.bonusMagicalRes -= effect.value;
                    effectsEnemy.push(effect);
                } else {
                    effect.value = Math.round(
                        -secondaryEffect *
                            (combat.statsPlayer.magicalRes +
                                combat.statsPlayer.bonusMagicalRes),
                    );
                    statsPlayer.bonusMagicalRes -= effect.value;
                    effectsPlayer.push(effect);
                }
                break;
            //TODO: CRIT/DODGE
            default:
                throw new Error(`Unknown effect: ${effect}`);
        }
    }

    function leaveCombat() {
        dispatch(combatHide());
        setDisabled(false);
        setCooldown_1(0);
        setCooldown_2(0);
        setCooldown_3(0);
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
                                            {combat.statsEnemy.physicalAtk +
                                                combat.statsEnemy
                                                    .bonusPhysicalAtk}
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
                                                combat.statsEnemy.physicalRes +
                                                    combat.statsEnemy
                                                        .bonusPhysicalRes,
                                                combat.creature.level,
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
                                                (combat.statsEnemy.critical +
                                                    combat.statsEnemy
                                                        .bonusCritical) *
                                                100
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
                                            {combat.statsEnemy.magicalAtk +
                                                combat.statsEnemy
                                                    .bonusMagicalAtk}
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
                                                combat.statsEnemy.magicalRes +
                                                    combat.statsEnemy
                                                        .bonusMagicalRes,
                                                combat.creature.level,
                                            ).toFixed(1) + '%'}
                                        </Text>
                                        <Image
                                            style={styles.statsIcon}
                                            source={getImage('icon_dodge')}
                                        />
                                        <Text
                                            style={styles.dodgeValue}
                                            numberOfLines={1}>
                                            {(
                                                (combat.statsEnemy.dodge +
                                                    combat.statsEnemy
                                                        .bonusDodge) *
                                                100
                                            ).toFixed(1) + '%'}
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
                                            data={combat.effectsEnemy}
                                            keyExtractor={(_item, index) =>
                                                index.toString()
                                            }
                                            renderItem={({item}) => (
                                                <Image
                                                    style={styles.effectIcon}
                                                    source={getImage(
                                                        'effect_icon_' +
                                                            item.type.toLowerCase(),
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
                                    <CustomButton
                                        type={ButtonType.Orange}
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
                                                    style={
                                                        styles.actionIconFrame
                                                    }
                                                    source={getImage(
                                                        'skills_frame_background',
                                                    )}
                                                    resizeMode={'stretch'}>
                                                    <Image
                                                        style={
                                                            styles.actionIcon
                                                        }
                                                        source={getImage(
                                                            'skills_icon_basic_physical',
                                                        )}
                                                        resizeMode={'stretch'}
                                                        fadeDuration={0}
                                                    />
                                                </ImageBackground>
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
                                                    style={
                                                        styles.actionIconFrame
                                                    }
                                                    source={getImage(
                                                        'skills_frame_background',
                                                    )}
                                                    resizeMode={'stretch'}>
                                                    <Image
                                                        style={
                                                            styles.actionIcon
                                                        }
                                                        source={getImage(
                                                            'skills_icon_basic_magical',
                                                        )}
                                                        resizeMode={'stretch'}
                                                        fadeDuration={0}
                                                    />
                                                </ImageBackground>
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
                                            {/* Spell Button 1 */}
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                disabled={
                                                    disabled ||
                                                    skills.spell_1 === null ||
                                                    cooldown_1 > 0
                                                }
                                                onPress={() => {
                                                    setCooldown_1(
                                                        getSkillCooldown(
                                                            (
                                                                skills.spell_1 as Skill
                                                            ).id,
                                                        ) as number,
                                                    );
                                                    simulateAttack(
                                                        true,
                                                        skills.spell_1,
                                                        getSkillElement(
                                                            (
                                                                skills.spell_1 as Skill
                                                            ).id,
                                                        ),
                                                    );
                                                }}>
                                                <ImageBackground
                                                    style={
                                                        styles.actionIconFrame
                                                    }
                                                    source={getImage(
                                                        'skills_frame_background',
                                                    )}
                                                    resizeMode={'stretch'}
                                                    fadeDuration={0}>
                                                    <ImageBackground
                                                        style={
                                                            styles.actionIcon
                                                        }
                                                        source={
                                                            skills.spell_1
                                                                ? getImage(
                                                                      getSkillImg(
                                                                          skills
                                                                              .spell_1
                                                                              .id,
                                                                      ),
                                                                  )
                                                                : getImage(
                                                                      'skills_frame_background',
                                                                  )
                                                        }
                                                        resizeMode={'stretch'}
                                                        fadeDuration={0}>
                                                        {cooldown_1 ? (
                                                            <Text
                                                                style={
                                                                    styles.cooldownText
                                                                }>
                                                                {cooldown_1}
                                                            </Text>
                                                        ) : null}
                                                    </ImageBackground>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                            {/* Spell Button 2 */}
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                disabled={
                                                    disabled ||
                                                    skills.spell_2 === null ||
                                                    cooldown_2 > 0
                                                }
                                                onPress={() => {
                                                    setCooldown_2(
                                                        getSkillCooldown(
                                                            (
                                                                skills.spell_2 as Skill
                                                            ).id,
                                                        ) as number,
                                                    );
                                                    simulateAttack(
                                                        true,
                                                        skills.spell_2,
                                                        getSkillElement(
                                                            (
                                                                skills.spell_2 as Skill
                                                            ).id,
                                                        ),
                                                    );
                                                }}>
                                                <ImageBackground
                                                    style={
                                                        styles.actionIconFrame
                                                    }
                                                    source={getImage(
                                                        'skills_frame_background',
                                                    )}
                                                    resizeMode={'stretch'}
                                                    fadeDuration={0}>
                                                    <ImageBackground
                                                        style={
                                                            styles.actionIcon
                                                        }
                                                        source={
                                                            skills.spell_2
                                                                ? getImage(
                                                                      getSkillImg(
                                                                          skills
                                                                              .spell_2
                                                                              .id,
                                                                      ),
                                                                  )
                                                                : getImage(
                                                                      'skills_frame_background',
                                                                  )
                                                        }
                                                        resizeMode={'stretch'}
                                                        fadeDuration={0}>
                                                        {cooldown_2 ? (
                                                            <Text
                                                                style={
                                                                    styles.cooldownText
                                                                }>
                                                                {cooldown_2}
                                                            </Text>
                                                        ) : null}
                                                    </ImageBackground>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                            {/* Spell Button 3 */}
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                disabled={
                                                    disabled ||
                                                    skills.spell_3 === null ||
                                                    cooldown_3 > 0
                                                }
                                                onPress={() => {
                                                    setCooldown_3(
                                                        getSkillCooldown(
                                                            (
                                                                skills.spell_3 as Skill
                                                            ).id,
                                                        ) as number,
                                                    );
                                                    simulateAttack(
                                                        true,
                                                        skills.spell_3,
                                                        getSkillElement(
                                                            (
                                                                skills.spell_3 as Skill
                                                            ).id,
                                                        ),
                                                    );
                                                }}>
                                                <ImageBackground
                                                    style={
                                                        styles.actionIconFrame
                                                    }
                                                    source={getImage(
                                                        'skills_frame_background',
                                                    )}
                                                    resizeMode={'stretch'}
                                                    fadeDuration={0}>
                                                    <ImageBackground
                                                        style={
                                                            styles.actionIcon
                                                        }
                                                        source={
                                                            skills.spell_3
                                                                ? getImage(
                                                                      getSkillImg(
                                                                          skills
                                                                              .spell_3
                                                                              .id,
                                                                      ),
                                                                  )
                                                                : getImage(
                                                                      'skills_frame_background',
                                                                  )
                                                        }
                                                        resizeMode={'stretch'}
                                                        fadeDuration={0}>
                                                        {cooldown_3 ? (
                                                            <Text
                                                                style={
                                                                    styles.cooldownText
                                                                }>
                                                                {cooldown_3}
                                                            </Text>
                                                        ) : null}
                                                    </ImageBackground>
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
                                            {combat.statsPlayer.physicalAtk +
                                                combat.statsPlayer
                                                    .bonusPhysicalAtk}
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
                                                combat.statsPlayer.physicalRes +
                                                    combat.statsPlayer
                                                        .bonusPhysicalRes,
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
                                                (combat.statsPlayer.critical +
                                                    combat.statsPlayer
                                                        .bonusCritical) *
                                                100
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
                                            {combat.statsPlayer.magicalAtk +
                                                combat.statsPlayer
                                                    .bonusMagicalAtk}
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
                                                combat.statsPlayer.magicalRes +
                                                    combat.statsPlayer
                                                        .bonusMagicalRes,
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
                                            {(
                                                (combat.statsPlayer.dodge +
                                                    combat.statsPlayer
                                                        .bonusDodge) *
                                                100
                                            ).toFixed(1) + '%'}
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
                                            data={combat.effectsPlayer}
                                            keyExtractor={(_item, index) =>
                                                index.toString()
                                            }
                                            renderItem={({item}) => (
                                                <Image
                                                    style={styles.effectIcon}
                                                    source={getImage(
                                                        'effect_icon_' +
                                                            item.type.toLowerCase(),
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
        height: Dimensions.get('screen').height / 30,
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
        width: '28%',
        aspectRatio: 1,
    },
    actionIconFrame: {
        padding: 6,
    },
    actionIcon: {
        width: '100%',
        height: '100%',
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
        backgroundColor: 'rgba(0,0,0,0.75)',
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
