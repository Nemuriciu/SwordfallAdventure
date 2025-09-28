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
import Tooltip from 'react-native-walkthrough-tooltip';
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
import {rand} from '../../../parsers/itemParser.tsx';
import {Creature} from '../../../types/creature.ts';
import cloneDeep from 'lodash.clonedeep';
import {
    ButtonType,
    CustomButton,
} from '../../../components/buttons/customButton.tsx';
import {isQuestComplete, sortQuests} from '../../../parsers/questParser.tsx';
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
import {Effect, EffectType, isBuff, isDOT} from '../../../types/effect.ts';
import {Stats} from '../../../types/stats.ts';
import {EffectTooltip} from './effectTooltip.tsx';
import {rewardsStore} from '../../../store_zustand/rewardsStore.tsx';
import {userInfoStore} from '../../../store_zustand/userInfoStore.tsx';
import {huntingStore} from '../../../store_zustand/huntingStore.tsx';
import {combatStore} from '../../../store_zustand/combatStore.tsx';
import {questsStore} from '../../../store_zustand/questsStore.tsx';
import {attributesStore} from '../../../store_zustand/attributesStore.tsx';
import {skillsStore} from '../../../store_zustand/skillsStore.tsx';
import {SafeAreaView} from 'react-native-safe-area-context';
import {values} from '../../../utils/values.ts';

export function Combat() {
    const rewardsInit = rewardsStore(state => state.rewardsInit);

    const username = userInfoStore(state => state.username);
    const level = userInfoStore(state => state.level);

    const health = attributesStore(state => state.health);
    const bonusHealth = attributesStore(state => state.bonusHealth);

    const depth = huntingStore(state => state.depth);
    const killCount = huntingStore(state => state.killCount);
    const creatureList = huntingStore(state => state.creatureList);
    const creatureLevel = huntingStore(state => state.creatureLevel);
    const huntingUpdate = huntingStore(state => state.huntingUpdate);
    const huntingUpdateCreatureList = huntingStore(
        state => state.huntingUpdateCreatureList,
    );

    const modalVisible = combatStore(state => state.modalVisible);
    const creature = combatStore(state => state.creature);
    const index = combatStore(state => state.index);
    const statsPlayer = combatStore(state => state.statsPlayer);
    const statsEnemy = combatStore(state => state.statsEnemy);
    const effectsPlayer = combatStore(state => state.effectsPlayer);
    const effectsEnemy = combatStore(state => state.effectsEnemy);
    const combatLog = combatStore(state => state.combatLog);
    const playerTurn = combatStore(state => state.playerTurn);
    const combatUpdate = combatStore(state => state.combatUpdate);
    const combatSetLog = combatStore(state => state.combatSetLog);
    const combatHide = combatStore(state => state.combatHide);

    const spell_1 = skillsStore(state => state.spell_1);
    const spell_2 = skillsStore(state => state.spell_2);
    const spell_3 = skillsStore(state => state.spell_3);

    const questsList = questsStore(state => state.questsList);
    const questsSetList = questsStore(state => state.questsSetList);

    const [combatComplete, setCombatComplete] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [showTooltip, setShowTooltip] = useState('');
    const [cooldown_1, setCooldown_1] = useState(0);
    const [cooldown_2, setCooldown_2] = useState(0);
    const [cooldown_3, setCooldown_3] = useState(0);
    const didMount = useRef(1);

    useEffect(() => {
        if (modalVisible) {
            /* Remove Creature from Hunting List */
            const _creatureList = cloneDeep(creatureList);
            _creatureList.splice(index, 1);
            setTimeout(() => {
                huntingUpdateCreatureList(_creatureList);
            }, 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalVisible]);

    useEffect(() => {
        if (!didMount.current) {
            if (creature) {
                /* Continue Combat */
                if (statsPlayer.health > 0 && statsEnemy.health > 0) {
                    if (!playerTurn) {
                        /* Enemy Attack */
                        setTimeout(() => {
                            simulateAttack(playerTurn, null, 'Physical'); //TODO:
                        }, 300);
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
                        }, 300);
                    }
                    /* End Combat */
                } else {
                    const _combatLog = cloneDeep(combatLog);
                    if (statsEnemy.health <= 0) {
                        /* Player Win */
                        _combatLog.push({
                            username: username,
                            opponent: getCreatureName(
                                (creature as Creature).id,
                            ),
                            turn: false,
                            atkType: 'Win',
                            damage: 0,
                        });
                        /* Show Victory Log */
                        combatSetLog(_combatLog);
                        /* Combat Complete & Display Rewards */
                        setTimeout(() => {
                            /* Combat Complete */
                            setCombatComplete(true);
                            /* Display Rewards */
                            rewardsInit(
                                getCombatRewards(
                                    (creature as Creature).rarity,
                                    (creature as Creature).level,
                                ),
                                getCombatExperience(
                                    (creature as Creature).rarity,
                                    (creature as Creature).level,
                                ),
                                getCombatShards(
                                    (creature as Creature).rarity,
                                    depth,
                                ),
                            );
                        }, 250);

                        /* Update Quests */
                        const _questsList = cloneDeep(questsList);

                        for (let i = 0; i < _questsList.length; i++) {
                            let quest = _questsList[i];
                            if (
                                quest.isActive &&
                                !isQuestComplete(quest) &&
                                quest.type === 'hunting'
                            ) {
                                if (
                                    quest.description.includes(
                                        getCreatureName(
                                            (creature as Creature).id,
                                        ),
                                    )
                                ) {
                                    quest.progress += 1;
                                }
                            }
                        }
                        sortQuests(_questsList);
                        questsSetList(_questsList);

                        const _creatureList = cloneDeep(creatureList);
                        /* Roll for chance to add new creature */
                        const r = Math.random();
                        /* 10% chance to add 0 creatures (does not apply if list is empty) */
                        if (r <= 0.2) {
                            /* 20% chance to add 2 creatures */
                            _creatureList.unshift(
                                getCreature(creatureLevel, depth),
                                getCreature(creatureLevel, depth),
                            );
                        } else if (
                            (r > 0.2 && r <= 0.9) ||
                            !_creatureList.length
                        ) {
                            /* 70% chance to add 1 creature */
                            _creatureList.unshift(
                                getCreature(creatureLevel, depth),
                            );
                        }

                        huntingUpdate(depth, killCount + 1, _creatureList);
                    } else if (statsPlayer.health <= 0) {
                        /* Enemy Win */
                        _combatLog.push({
                            username: getCreatureName(
                                (creature as Creature).id,
                            ),
                            opponent: username,
                            turn: true,
                            atkType: 'Win',
                            damage: 0,
                        });
                        /* Show Defeated Log */
                        combatSetLog(_combatLog);
                        /* Combat Complete */
                        setTimeout(() => {
                            setCombatComplete(true);
                        }, 250);

                        const _creatureList = cloneDeep(creatureList);
                        /* Roll for chance to add new creature */
                        const r = Math.random();
                        /* 25% chance to add 0 creatures (does not apply if list is empty) */
                        /* 75% chance to add 1 creature */
                        if (r <= 0.75 || !_creatureList.length) {
                            _creatureList.unshift(
                                getCreature(creatureLevel, depth),
                            );
                        }

                        huntingUpdateCreatureList(_creatureList);
                    }
                }
            }
        } else {
            didMount.current -= 1;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerTurn]);

    function simulateAttack(
        turn: boolean,
        spell: Skill | null,
        atkType: string,
    ) {
        const _statsPlayer = cloneDeep(statsPlayer);
        const _statsEnemy = cloneDeep(statsEnemy);
        const _combatLog = cloneDeep(combatLog);
        const _creature = creature as Creature;
        let _effectsPlayer = cloneDeep(effectsPlayer);
        let _effectsEnemy = cloneDeep(effectsEnemy);

        /* Player Turn */
        if (turn) {
            setDisabled(turn);
            /* Spell Attack */
            if (spell != null) {
                /* Miss Spell */
                if (Math.random() <= _statsEnemy.dodge) {
                    _combatLog.push({
                        username: username,
                        opponent: getCreatureName(_creature.id),
                        turn: turn,
                        atkType: 'Spell' + atkType + 'Dodge',
                        damage: 0,
                        spellName: getSkillName(spell.id),
                    });
                } else {
                    let damage: number = getSpellDamage(
                        spell,
                        _creature.level,
                        turn,
                    );
                    /* Check if critical hit */
                    if (Math.random() <= _statsPlayer.critical) {
                        damage = Math.round(damage * 1.5);
                        _combatLog.push({
                            username: username,
                            opponent: getCreatureName(_creature.id),
                            turn: turn,
                            atkType: 'Spell' + atkType + 'Crit',
                            damage: damage,
                            spellName: getSkillName(spell.id),
                        });
                    } else {
                        _combatLog.push({
                            username: username,
                            opponent: getCreatureName(_creature.id),
                            turn: turn,
                            atkType: 'Spell' + atkType,
                            damage: damage,
                            spellName: getSkillName(spell.id),
                        });
                    }

                    _statsEnemy.health = Math.max(
                        _statsEnemy.health - damage,
                        0,
                    );
                    /* Effects */
                    if (_statsEnemy.health > 0) {
                        /* Decrease/Remove Player Buffs */
                        for (let i = 0; i < _effectsPlayer.length; i++) {
                            const effect = _effectsPlayer[i];

                            if (isBuff(effect)) {
                                if (effect.turns === 1) {
                                    removeEffect(effect, _statsPlayer);
                                }
                                effect.turns -= 1;
                            }
                        }
                        _effectsPlayer = _effectsPlayer.filter(
                            effect => effect.turns,
                        );
                        /* Decrease/Remove Enemy Debuffs */
                        for (let i = 0; i < _effectsEnemy.length; i++) {
                            const effect = _effectsEnemy[i];

                            if (!isBuff(effect) && !isDOT(effect)) {
                                if (effect.turns === 1) {
                                    removeEffect(effect, _statsEnemy);
                                }
                                effect.turns -= 1;
                            }
                        }
                        _effectsEnemy = _effectsEnemy.filter(
                            effect => effect.turns,
                        );
                        /* Apply Spell secondary effect */
                        applySpellEffect(
                            spell,
                            _statsPlayer,
                            _statsEnemy,
                            _effectsPlayer,
                            _effectsEnemy,
                            _creature,
                            turn,
                        );
                    }
                }
            } else {
                /* Basic Attack */
                if (Math.random() <= _statsEnemy.dodge) {
                    _combatLog.push({
                        username: username,
                        opponent: getCreatureName(_creature.id),
                        turn: turn,
                        atkType: 'Dodge',
                        damage: 0,
                    });
                } else {
                    let damage: number = getBasicDamage(
                        atkType,
                        _creature.level,
                        turn,
                    );
                    /* Check if critical hit */
                    if (Math.random() <= _statsPlayer.critical) {
                        damage = Math.round(damage * 1.5);
                        _combatLog.push({
                            username: username,
                            opponent: getCreatureName(_creature.id),
                            turn: turn,
                            atkType: atkType + 'Crit',
                            damage: damage,
                        });
                    } else {
                        _combatLog.push({
                            username: username,
                            opponent: getCreatureName(_creature.id),
                            turn: turn,
                            atkType: atkType,
                            damage: damage,
                        });
                    }

                    _statsEnemy.health = Math.max(
                        _statsEnemy.health - damage,
                        0,
                    );
                    /* Effects */
                    if (_statsEnemy.health > 0) {
                        /* Decrease/Remove Player Buffs */
                        for (let i = 0; i < _effectsPlayer.length; i++) {
                            const effect = _effectsPlayer[i];

                            if (isBuff(effect)) {
                                if (effect.turns === 1) {
                                    removeEffect(effect, _statsPlayer);
                                }
                                effect.turns -= 1;
                            }
                        }
                        _effectsPlayer = _effectsPlayer.filter(
                            effect => effect.turns,
                        );
                        /* Decrease/Remove Enemy Debuffs */
                        for (let i = 0; i < _effectsEnemy.length; i++) {
                            const effect = _effectsEnemy[i];

                            if (!isBuff(effect) && !isDOT(effect)) {
                                if (effect.turns === 1) {
                                    removeEffect(effect, _statsEnemy);
                                }
                                effect.turns -= 1;
                            }
                        }
                        _effectsEnemy = _effectsEnemy.filter(
                            effect => effect.turns,
                        );
                    }
                }
            }
            /* Apply DOT damage on Player */
            if (_statsEnemy.health > 0) {
                for (let i = 0; i < _effectsPlayer.length; i++) {
                    const effect = _effectsPlayer[i];

                    if (isDOT(effect)) {
                        const damage = getDOTDamage(
                            effect.value,
                            effect.type,
                            level,
                            turn,
                        );
                        _statsPlayer.health = Math.max(
                            _statsPlayer.health - damage,
                            0,
                        );
                        _combatLog.push({
                            username: username,
                            opponent: getCreatureName(_creature.id),
                            turn: turn,
                            atkType: effect.type,
                            damage: damage,
                        });
                        effect.turns -= 1;
                    }
                }
            }
            _effectsPlayer = _effectsPlayer.filter(effect => effect.turns);
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
                if (Math.random() <= _statsPlayer.dodge) {
                    _combatLog.push({
                        username: getCreatureName(_creature.id),
                        opponent: username,
                        turn: turn,
                        atkType: 'Dodge',
                        damage: 0,
                    });
                } else {
                    let damage: number = getBasicDamage(atkType, level, turn);
                    /* Check if critical hit */
                    if (Math.random() <= _statsPlayer.critical) {
                        damage = Math.round(damage * 1.5);
                        _combatLog.push({
                            username: getCreatureName(_creature.id),
                            opponent: username,
                            turn: turn,
                            atkType: atkType + 'Crit',
                            damage: damage,
                        });
                    } else {
                        _combatLog.push({
                            username: getCreatureName(_creature.id),
                            opponent: username,
                            turn: turn,
                            atkType: atkType,
                            damage: damage,
                        });
                    }

                    _statsPlayer.health = Math.max(
                        _statsPlayer.health - damage,
                        0,
                    );
                    /* Effects */
                    if (_statsPlayer.health > 0) {
                        /* Decrease/Remove Enemy Buffs */
                        for (let i = 0; i < _effectsEnemy.length; i++) {
                            const effect = _effectsEnemy[i];

                            if (isBuff(effect)) {
                                if (effect.turns === 1) {
                                    removeEffect(effect, _statsEnemy);
                                }
                                effect.turns -= 1;
                            }
                        }
                        _effectsEnemy = _effectsEnemy.filter(
                            effect => effect.turns,
                        );
                        /* Decrease/Remove Player Debuffs */
                        for (let i = 0; i < _effectsPlayer.length; i++) {
                            const effect = _effectsPlayer[i];

                            if (!isBuff(effect) && !isDOT(effect)) {
                                if (effect.turns === 1) {
                                    removeEffect(effect, _statsPlayer);
                                }
                                effect.turns -= 1;
                            }
                        }
                        _effectsPlayer = _effectsPlayer.filter(
                            effect => effect.turns,
                        );
                    }
                }
            }
            /* Apply DOT damage on Enemy */
            if (_statsPlayer.health > 0) {
                for (let i = 0; i < _effectsEnemy.length; i++) {
                    const effect = _effectsEnemy[i];

                    if (isDOT(effect)) {
                        const damage = getDOTDamage(
                            effect.value,
                            effect.type,
                            (creature as Creature).level,
                            turn,
                        );
                        _statsEnemy.health = Math.max(
                            _statsEnemy.health - damage,
                            0,
                        );
                        _combatLog.push({
                            username: getCreatureName(_creature.id),
                            opponent: username,
                            turn: turn,
                            atkType: effect.type,
                            damage: damage,
                        });
                        effect.turns -= 1;

                        if (_statsEnemy.health <= 0) {
                            break;
                        }
                    }
                }
            }
            _effectsEnemy = _effectsEnemy.filter(effect => effect.turns);
        }

        combatUpdate(
            _statsPlayer,
            _statsEnemy,
            _effectsPlayer,
            _effectsEnemy,
            _combatLog,
        );
    }

    function getBasicDamage(
        atkType: string,
        lvl: number,
        turn: boolean,
    ): number {
        let attack: number, resistance: number;
        /* Set attack type */
        if (turn) {
            attack =
                atkType === 'Physical'
                    ? statsPlayer.physicalAtk + statsPlayer.bonusPhysicalAtk
                    : statsPlayer.magicalAtk + statsPlayer.bonusMagicalAtk;
            resistance =
                atkType === 'Physical'
                    ? statsEnemy.physicalRes + statsEnemy.bonusPhysicalRes
                    : statsEnemy.magicalRes + statsEnemy.bonusMagicalRes;
        } else {
            attack =
                atkType === 'Physical'
                    ? statsEnemy.physicalAtk + statsEnemy.bonusPhysicalAtk
                    : statsEnemy.magicalAtk + statsEnemy.bonusMagicalAtk;
            resistance =
                atkType === 'Physical'
                    ? statsPlayer.physicalRes + statsPlayer.bonusPhysicalRes
                    : statsPlayer.magicalRes + statsPlayer.bonusMagicalRes;
        }

        let damage: number = Math.round(
            attack - attack * (getResistancePercent(resistance, lvl) / 100),
        );

        return rand(Math.round(damage * 0.97), Math.round(damage * 1.03));
    }

    function getDOTDamage(
        value: number,
        effectType: EffectType,
        lvl: number,
        turn: boolean,
    ): number {
        let resistance: number;
        /* Set attack type */
        if (turn) {
            resistance =
                effectType === EffectType.Bleeding ||
                effectType === EffectType.Poison
                    ? statsPlayer.physicalRes + statsPlayer.bonusPhysicalRes
                    : statsPlayer.magicalRes + statsPlayer.bonusMagicalRes;
        } else {
            resistance =
                effectType === EffectType.Bleeding ||
                effectType === EffectType.Poison
                    ? statsEnemy.physicalRes + statsEnemy.bonusPhysicalRes
                    : statsEnemy.magicalRes + statsEnemy.bonusMagicalRes;
        }

        return Math.round(
            value - value * (getResistancePercent(resistance, lvl) / 100),
        );
    }

    function getSpellDamage(spell: Skill, lvl: number, turn: boolean): number {
        let attack: number, resistance: number;
        const element = getSkillElement(spell.id);
        const primaryEffect = getSkillPrimaryEffect(spell.id) as number[];
        /* Set attack type */
        if (turn) {
            attack =
                element === 'Physical'
                    ? statsPlayer.physicalAtk + statsPlayer.bonusPhysicalAtk
                    : statsPlayer.magicalAtk + statsPlayer.bonusMagicalAtk;
            resistance =
                element === 'Physical'
                    ? statsEnemy.physicalRes + statsEnemy.bonusPhysicalRes
                    : statsEnemy.magicalRes + statsEnemy.bonusMagicalRes;
        } else {
            attack =
                element === 'Physical'
                    ? statsEnemy.physicalAtk + statsEnemy.bonusPhysicalAtk
                    : statsEnemy.magicalAtk + statsEnemy.bonusMagicalAtk;
            resistance =
                element === 'Physical'
                    ? statsPlayer.physicalRes + statsPlayer.bonusPhysicalRes
                    : statsPlayer.magicalRes + statsPlayer.bonusMagicalRes;
        }

        let damage: number = Math.round(
            primaryEffect[0] * attack -
                primaryEffect[0] *
                    attack *
                    (getResistancePercent(resistance, lvl) / 100),
        );

        return rand(Math.round(damage * 0.97), Math.round(damage * 1.03));
    }

    function applySpellEffect(
        spell: Skill,
        _statsPlayer: Stats,
        _statsEnemy: Stats,
        _effectsPlayer: Effect[],
        _effectsEnemy: Effect[],
        _creature: Creature,
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
            value: 0,
            percent: secondaryEffect,
            turns: turns !== undefined ? turns : 0,
        };

        /* Handle Effect Types */
        switch (effect.type) {
            case EffectType.Bleeding:
                if (turn) {
                    effect.value =
                        secondaryEffect *
                        (_statsPlayer.physicalAtk +
                            _statsPlayer.bonusPhysicalAtk);
                    _effectsEnemy.push(effect);
                } else {
                    effect.value =
                        secondaryEffect *
                        (_statsEnemy.physicalAtk +
                            _statsEnemy.bonusPhysicalAtk);
                    _effectsPlayer.push(effect);
                }
                break;
            case EffectType.Poison:
                if (turn) {
                    effect.value =
                        secondaryEffect *
                        (_statsPlayer.physicalAtk +
                            _statsPlayer.bonusPhysicalAtk);
                    _effectsEnemy.push(effect);
                } else {
                    effect.value =
                        secondaryEffect *
                        (_statsEnemy.physicalAtk +
                            _statsEnemy.bonusPhysicalAtk);
                    _effectsPlayer.push(effect);
                }
                break;
            case EffectType.Burning:
                if (turn) {
                    effect.value =
                        secondaryEffect *
                        (_statsPlayer.magicalAtk +
                            _statsPlayer.bonusMagicalAtk);
                    _effectsEnemy.push(effect);
                } else {
                    effect.value =
                        secondaryEffect *
                        (_statsEnemy.magicalAtk + _statsEnemy.bonusMagicalAtk);
                    _effectsPlayer.push(effect);
                }
                break;
            case EffectType.Healing:
                if (turn) {
                    _statsPlayer.health = Math.min(
                        _statsPlayer.health +
                            Math.round(secondaryEffect * _statsPlayer.health),
                        health + bonusHealth,
                    );
                    //TODO: Log healing effect.
                } else {
                    _statsEnemy.health = Math.min(
                        _statsEnemy.health +
                            Math.round(secondaryEffect * _statsEnemy.health),
                        _creature.stats.health + _creature.stats.bonusHealth,
                    );
                    //TODO: Log healing effect.
                }
                break;
            case EffectType.PhyAtkInc:
                if (turn) {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsPlayer.physicalAtk +
                                _statsPlayer.bonusPhysicalAtk),
                    );
                    _statsPlayer.bonusPhysicalAtk += effect.value;
                    _effectsPlayer.push(effect);
                } else {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsPlayer.physicalAtk +
                                _statsPlayer.bonusPhysicalAtk),
                    );
                    _statsEnemy.bonusPhysicalAtk += effect.value;
                    _effectsEnemy.push(effect);
                }
                break;
            case EffectType.PhyAtkDec:
                if (turn) {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsEnemy.physicalAtk +
                                _statsEnemy.bonusPhysicalAtk),
                    );
                    _statsEnemy.bonusPhysicalAtk -= effect.value;
                    _effectsEnemy.push(effect);
                } else {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsPlayer.physicalAtk +
                                _statsPlayer.bonusPhysicalAtk),
                    );
                    _statsPlayer.bonusPhysicalAtk -= effect.value;
                    _effectsPlayer.push(effect);
                }
                break;
            case EffectType.MagAtkInc:
                if (turn) {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsPlayer.magicalAtk +
                                _statsPlayer.bonusMagicalAtk),
                    );
                    _statsPlayer.bonusMagicalAtk += effect.value;
                    _effectsPlayer.push(effect);
                } else {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsPlayer.magicalAtk +
                                _statsPlayer.bonusMagicalAtk),
                    );
                    _statsEnemy.bonusMagicalAtk += effect.value;
                    _effectsEnemy.push(effect);
                }
                break;
            case EffectType.MagAtkDec:
                if (turn) {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsEnemy.magicalAtk +
                                _statsEnemy.bonusMagicalAtk),
                    );
                    _statsEnemy.bonusMagicalAtk -= effect.value;
                    _effectsEnemy.push(effect);
                } else {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsPlayer.magicalAtk +
                                _statsPlayer.bonusMagicalAtk),
                    );
                    _statsPlayer.bonusMagicalAtk -= effect.value;
                    _effectsPlayer.push(effect);
                }
                break;
            case EffectType.PhyResInc:
                if (turn) {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsPlayer.physicalRes +
                                _statsPlayer.bonusPhysicalRes),
                    );
                    _statsPlayer.bonusPhysicalRes += effect.value;
                    _effectsPlayer.push(effect);
                } else {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsPlayer.physicalRes +
                                _statsPlayer.bonusPhysicalRes),
                    );
                    _statsEnemy.bonusPhysicalRes += effect.value;
                    _effectsEnemy.push(effect);
                }
                break;
            case EffectType.PhyResDec:
                if (turn) {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsEnemy.physicalRes +
                                _statsEnemy.bonusPhysicalRes),
                    );
                    _statsEnemy.bonusPhysicalRes -= effect.value;
                    _effectsEnemy.push(effect);
                } else {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsPlayer.physicalRes +
                                _statsPlayer.bonusPhysicalRes),
                    );
                    _statsPlayer.bonusPhysicalRes -= effect.value;
                    _effectsPlayer.push(effect);
                }
                break;
            case EffectType.MagResInc:
                if (turn) {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsPlayer.magicalRes +
                                _statsPlayer.bonusMagicalRes),
                    );
                    _statsPlayer.bonusMagicalRes += effect.value;
                    _effectsPlayer.push(effect);
                } else {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsPlayer.magicalRes +
                                _statsPlayer.bonusMagicalRes),
                    );
                    _statsEnemy.bonusMagicalRes += effect.value;
                    _effectsEnemy.push(effect);
                }
                break;
            case EffectType.MagResDec:
                if (turn) {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsEnemy.magicalRes +
                                _statsEnemy.bonusMagicalRes),
                    );
                    _statsEnemy.bonusMagicalRes -= effect.value;
                    _effectsEnemy.push(effect);
                } else {
                    effect.value = Math.round(
                        secondaryEffect *
                            (_statsPlayer.magicalRes +
                                _statsPlayer.bonusMagicalRes),
                    );
                    _statsPlayer.bonusMagicalRes -= effect.value;
                    _effectsPlayer.push(effect);
                }
                break;
            //TODO: CRIT/DODGE
            default:
                throw new Error(`Unknown effect: ${effect}`);
        }
    }

    function removeEffect(effect: Effect, stats: Stats) {
        /* Handle Effect Types */
        switch (effect.type) {
            case EffectType.PhyAtkInc:
                stats.bonusPhysicalAtk -= effect.value;
                break;
            case EffectType.PhyAtkDec:
                stats.bonusPhysicalAtk += effect.value;
                break;
            case EffectType.MagAtkInc:
                stats.bonusMagicalAtk -= effect.value;
                break;
            case EffectType.MagAtkDec:
                stats.bonusMagicalAtk += effect.value;
                break;
            case EffectType.PhyResInc:
                stats.bonusPhysicalRes -= effect.value;
                break;
            case EffectType.PhyResDec:
                stats.bonusPhysicalRes += effect.value;
                break;
            case EffectType.MagResInc:
                stats.bonusMagicalRes -= effect.value;
                break;
            case EffectType.MagResDec:
                stats.bonusMagicalRes += effect.value;
                break;
            //TODO: CRIT/DODGE
            default:
                throw new Error(`Unknown effect: ${effect}`);
        }
    }

    function leaveCombat() {
        combatHide();
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
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            // animationInTiming={100}
            backdropTransitionInTiming={1}
            backdropTransitionOutTiming={1}
            isVisible={modalVisible}
            useNativeDriver={true}
            hasBackdrop={false}
            // TODO: Remove DEBUG
            onBackButtonPress={() => {
                combatHide();
                setDisabled(false);
                setCombatComplete(false);
            }}>
            <SafeAreaView style={styles.container}>
                {/* Creature Info */}
                {creature && (
                    <View>
                        <ImageBackground
                            source={getImage('background_combat_info')}
                            resizeMode={'stretch'}>
                            <View style={styles.topContainer}>
                                <View style={styles.avatarContainer}>
                                    <Image
                                        style={styles.avatar}
                                        source={getImage(
                                            getCreatureImg(creature.id),
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
                                            {statsEnemy.physicalAtk +
                                                statsEnemy.bonusPhysicalAtk}
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
                                                statsEnemy.physicalRes +
                                                    statsEnemy.bonusPhysicalRes,
                                                creature.level,
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
                                                (statsEnemy.critical +
                                                    statsEnemy.bonusCritical) *
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
                                            {statsEnemy.magicalAtk +
                                                statsEnemy.bonusMagicalAtk}
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
                                                statsEnemy.magicalRes +
                                                    statsEnemy.bonusMagicalRes,
                                                creature.level,
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
                                                (statsEnemy.dodge +
                                                    statsEnemy.bonusDodge) *
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
                                                    statsEnemy.health /
                                                    (creature.stats.health +
                                                        creature.stats
                                                            .bonusHealth)
                                                }
                                                image={'progress_bar_health'}
                                            />
                                            <Text style={styles.healthText}>
                                                {statsEnemy.health +
                                                    ' / ' +
                                                    (creature.stats.health +
                                                        creature.stats
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
                                            data={effectsEnemy}
                                            keyExtractor={(_item, _index) =>
                                                _index.toString()
                                            }
                                            renderItem={({item}) => (
                                                <Tooltip
                                                    isVisible={
                                                        showTooltip === item.id
                                                    }
                                                    contentStyle={
                                                        styles.tooltipContainer
                                                    }
                                                    childContentSpacing={1}
                                                    content={
                                                        //@ts-ignore
                                                        <EffectTooltip
                                                            type={item.type}
                                                            percent={
                                                                item.percent
                                                            }
                                                        />
                                                    }
                                                    onClose={() =>
                                                        setShowTooltip('')
                                                    }
                                                    backgroundColor={
                                                        'rgba(0,0,0,0)'
                                                    }>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            setShowTooltip(
                                                                item.id,
                                                            )
                                                        }
                                                        activeOpacity={1}>
                                                        <ImageBackground
                                                            style={
                                                                styles.effectIcon
                                                            }
                                                            source={getImage(
                                                                'effect_icon_' +
                                                                    item.type.toLowerCase(),
                                                            )}
                                                            resizeMode={
                                                                'stretch'
                                                            }
                                                            fadeDuration={0}>
                                                            <Text
                                                                style={
                                                                    styles.effectTurns
                                                                }>
                                                                {item.turns}
                                                            </Text>
                                                        </ImageBackground>
                                                    </TouchableOpacity>
                                                </Tooltip>
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
                {creature && (
                    <ImageBackground
                        style={styles.logBackground}
                        source={getImage('background_log')}
                        resizeMode={'stretch'}>
                        <View style={styles.logContainer}>
                            <FlatList
                                style={styles.logList}
                                data={combatLog}
                                keyExtractor={(_item, _index) =>
                                    _index.toString()
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
                {creature && (
                    <View>
                        <ImageBackground
                            style={styles.actionbarBackground}
                            source={getImage('background_actionbar')}
                            resizeMode={'stretch'}>
                            <View style={styles.actionbarContainer}>
                                {/* Leave Combat */}
                                {combatComplete && (
                                    <CustomButton
                                        type={ButtonType.Red}
                                        style={styles.leaveButton}
                                        title={'Leave Combat'}
                                        onPress={() => leaveCombat()}
                                    />
                                )}
                                {/* Basic Attack */}
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
                                                activeOpacity={1}
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
                                                    <ImageBackground
                                                        style={
                                                            styles.actionIcon
                                                        }
                                                        source={getImage(
                                                            'skills_icon_basic_physical',
                                                        )}
                                                        resizeMode={'stretch'}
                                                        fadeDuration={0}>
                                                        {disabled ? (
                                                            <View
                                                                style={
                                                                    styles.actionIconDisabled
                                                                }
                                                            />
                                                        ) : null}
                                                    </ImageBackground>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                disabled={disabled}
                                                activeOpacity={1}
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
                                                    <ImageBackground
                                                        style={
                                                            styles.actionIcon
                                                        }
                                                        source={getImage(
                                                            'skills_icon_basic_magical',
                                                        )}
                                                        resizeMode={'stretch'}
                                                        fadeDuration={0}>
                                                        {disabled ? (
                                                            <View
                                                                style={
                                                                    styles.actionIconDisabled
                                                                }
                                                            />
                                                        ) : null}
                                                    </ImageBackground>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                                {/* Spells */}
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
                                                activeOpacity={1}
                                                disabled={
                                                    disabled ||
                                                    spell_1 === null ||
                                                    cooldown_1 > 0
                                                }
                                                onPress={() => {
                                                    setCooldown_1(
                                                        getSkillCooldown(
                                                            (spell_1 as Skill)
                                                                .id,
                                                        ) as number,
                                                    );
                                                    simulateAttack(
                                                        true,
                                                        spell_1,
                                                        getSkillElement(
                                                            (spell_1 as Skill)
                                                                .id,
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
                                                            spell_1
                                                                ? getImage(
                                                                      getSkillImg(
                                                                          spell_1.id,
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
                                                        ) : disabled ? (
                                                            <View
                                                                style={
                                                                    styles.actionIconDisabled
                                                                }
                                                            />
                                                        ) : null}
                                                    </ImageBackground>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                            {/* Spell Button 2 */}
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                activeOpacity={1}
                                                disabled={
                                                    disabled ||
                                                    spell_2 === null ||
                                                    cooldown_2 > 0
                                                }
                                                onPress={() => {
                                                    setCooldown_2(
                                                        getSkillCooldown(
                                                            (spell_2 as Skill)
                                                                .id,
                                                        ) as number,
                                                    );
                                                    simulateAttack(
                                                        true,
                                                        spell_2,
                                                        getSkillElement(
                                                            (spell_2 as Skill)
                                                                .id,
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
                                                            spell_2
                                                                ? getImage(
                                                                      getSkillImg(
                                                                          spell_2.id,
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
                                                        ) : disabled ? (
                                                            <View
                                                                style={
                                                                    styles.actionIconDisabled
                                                                }
                                                            />
                                                        ) : null}
                                                    </ImageBackground>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                            {/* Spell Button 3 */}
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                activeOpacity={1}
                                                disabled={
                                                    disabled ||
                                                    spell_3 === null ||
                                                    cooldown_3 > 0
                                                }
                                                onPress={() => {
                                                    setCooldown_3(
                                                        getSkillCooldown(
                                                            (spell_3 as Skill)
                                                                .id,
                                                        ) as number,
                                                    );
                                                    simulateAttack(
                                                        true,
                                                        spell_3,
                                                        getSkillElement(
                                                            (spell_3 as Skill)
                                                                .id,
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
                                                            spell_3
                                                                ? getImage(
                                                                      getSkillImg(
                                                                          spell_3.id,
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
                                                        ) : disabled ? (
                                                            <View
                                                                style={
                                                                    styles.actionIconDisabled
                                                                }
                                                            />
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
                {creature && (
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
                                            {statsPlayer.physicalAtk +
                                                statsPlayer.bonusPhysicalAtk}
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
                                                statsPlayer.physicalRes +
                                                    statsPlayer.bonusPhysicalRes,
                                                level,
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
                                                (statsPlayer.critical +
                                                    statsPlayer.bonusCritical) *
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
                                            {statsPlayer.magicalAtk +
                                                statsPlayer.bonusMagicalAtk}
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
                                                statsPlayer.magicalRes +
                                                    statsPlayer.bonusMagicalRes,
                                                level,
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
                                                (statsPlayer.dodge +
                                                    statsPlayer.bonusDodge) *
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
                                                    statsPlayer.health / health
                                                }
                                                image={'progress_bar_health'}
                                            />
                                            <Text style={styles.healthText}>
                                                {statsPlayer.health +
                                                    ' / ' +
                                                    health}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.effectsContainer}>
                                        {/* eslint-disable-next-line react-native/no-inline-styles */}
                                        <View style={{width: '10%'}} />
                                        <FlatList
                                            horizontal
                                            scrollEnabled={false}
                                            data={effectsPlayer}
                                            keyExtractor={(_item, _index) =>
                                                _index.toString()
                                            }
                                            renderItem={({item}) => (
                                                <Tooltip
                                                    isVisible={
                                                        showTooltip === item.id
                                                    }
                                                    contentStyle={
                                                        styles.tooltipContainer
                                                    }
                                                    childContentSpacing={1}
                                                    content={
                                                        //@ts-ignore
                                                        <EffectTooltip
                                                            type={item.type}
                                                            percent={
                                                                item.percent
                                                            }
                                                        />
                                                    }
                                                    onClose={() =>
                                                        setShowTooltip('')
                                                    }
                                                    backgroundColor={
                                                        'rgba(0,0,0,0)'
                                                    }>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            setShowTooltip(
                                                                item.id,
                                                            )
                                                        }
                                                        activeOpacity={1}>
                                                        <ImageBackground
                                                            style={
                                                                styles.effectIcon
                                                            }
                                                            source={getImage(
                                                                'effect_icon_' +
                                                                    item.type.toLowerCase(),
                                                            )}
                                                            resizeMode={
                                                                'stretch'
                                                            }
                                                            fadeDuration={0}>
                                                            <Text
                                                                style={
                                                                    styles.effectTurns
                                                                }>
                                                                {item.turns}
                                                            </Text>
                                                        </ImageBackground>
                                                    </TouchableOpacity>
                                                </Tooltip>
                                            )}
                                            overScrollMode={'never'}
                                        />
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                )}
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    magAtkValue: {
        flex: 1,
        color: colors.magicalAtk_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    phyResValue: {
        flex: 1,
        color: colors.physicalRes_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    magResValue: {
        flex: 1,
        color: colors.magicalRes_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    criticalValue: {
        flex: 1,
        color: colors.critical_color,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    dodgeValue: {
        flex: 1,
        color: colors.dodge_color,
        fontFamily: values.font,
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
        fontFamily: values.font,
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
        height: Dimensions.get('screen').height / 28,
        width: undefined,
        marginStart: 1,
        marginEnd: 1,
    },
    effectTurns: {
        position: 'absolute',
        bottom: 0,
        right: 2,
        color: 'white',
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    tooltipContainer: {
        backgroundColor: '#2a2a2a',
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
    actionIconDisabled: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    labelText: {
        color: colors.primary,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    cooldownText: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 18,
        fontFamily: values.font,
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
