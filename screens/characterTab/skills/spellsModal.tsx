import React, {useEffect, useState} from 'react';
import {
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Modal from 'react-native-modal';
import {getImage} from '../../../assets/images/_index';
import {colors} from '../../../utils/colors.ts';
import {strings} from '../../../utils/strings.ts';
import {Skill} from '../../../types/skill.ts';
import {
    getSkillElement,
    getSkillImg,
    getSkillName,
    getSkillType,
} from '../../../parsers/skillParser.tsx';
import {skillsStore} from '../../../store_zustand/skillsStore.tsx';
import {values} from '../../../utils/values.ts';

interface props {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    slot: number;
}

export function SpellsModal({visible, setVisible, slot}: props) {
    const skillsList = skillsStore(state => state.skillsList);
    const skillsSetSpell = skillsStore(state => state.skillsSetSpell);

    const [spellsList, setSpellsList] = useState<Skill[]>([]);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (visible) {
            const _spellsList = [];
            /* Fetch Learnt Spells */
            for (const key in skillsList) {
                const skill = skillsList[key];

                if (getSkillType(skill.id) === 'Spell' && skill.points) {
                    _spellsList.push(skill);
                }
            }
            setSpellsList(_spellsList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    function selectSpell(spell: Skill) {
        if (!disabled) {
            setDisabled(true);

            skillsSetSpell(slot, spell);
            setVisible(false);

            setTimeout(() => {
                setDisabled(false);
            }, 500);
        }
    }

    // @ts-ignore
    const renderItem = ({item}) => (
        <TouchableOpacity
            onPress={() => selectSpell(item)}
            disabled={disabled}
            activeOpacity={1}>
            <ImageBackground
                style={styles.spellSlot}
                source={getImage('background_node')}
                fadeDuration={0}>
                <View>
                    <View style={styles.spellSlotContainer}>
                        <View style={styles.spellImageContainer}>
                            <ImageBackground
                                style={styles.spellImageFrame}
                                source={getImage('skills_frame_background')}
                                resizeMode={'stretch'}
                                fadeDuration={0}>
                                <Image
                                    style={styles.spellImage}
                                    source={getImage(getSkillImg(item.id))}
                                    resizeMode={'stretch'}
                                    fadeDuration={0}
                                />
                            </ImageBackground>
                        </View>
                        <View style={styles.spellInfoContainer}>
                            <Text style={styles.spellName}>
                                {getSkillName(item.id)}
                            </Text>
                            <Text
                                style={[
                                    styles.spellElement,
                                    {
                                        color:
                                            getSkillElement(item.id) ===
                                            'Physical'
                                                ? colors.physicalAtk_color
                                                : colors.magicalAtk_color,
                                    },
                                ]}>
                                {getSkillElement(item.id)}
                            </Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );

    // noinspection RequiredAttributes
    return (
        <Modal
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            isVisible={visible}
            backdropTransitionInTiming={1}
            backdropTransitionOutTiming={1}
            useNativeDriver={true}
            onBackdropPress={() => {
                setVisible(false);
            }}>
            <View style={styles.modalAlpha}>
                <View style={styles.container}>
                    <ImageBackground
                        style={styles.background}
                        source={getImage('item_background_default')}
                        resizeMode={'stretch'}
                        fadeDuration={0}>
                        <View style={styles.outerContainer}>
                            <Text style={styles.title}>
                                {strings.learnt + ' ' + strings.spells}
                            </Text>
                            {spellsList.length ? (
                                <View style={styles.innerContainer}>
                                    <FlatList
                                        style={styles.spellsListContainer}
                                        data={spellsList}
                                        keyExtractor={skill => skill.id}
                                        renderItem={renderItem}
                                        overScrollMode={'never'}
                                    />
                                </View>
                            ) : null}
                            {spellsList.length === 0 ? (
                                <Text style={styles.noSpellsText}>
                                    {strings.no_spells_learnt}
                                </Text>
                            ) : null}
                        </View>
                    </ImageBackground>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalAlpha: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        height: '50%',
    },
    background: {
        width: '100%',
        height: '100%',
    },
    outerContainer: {
        flex: 1,
        marginTop: 24,
        marginBottom: 24,
        marginStart: 6,
        marginEnd: 6,
    },
    title: {
        alignSelf: 'center',
        color: colors.primary,
        fontSize: 18,
        fontFamily: values.fontBold,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    innerContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        marginTop: 12,
    },
    spellsListContainer: {},
    spellSlot: {
        width: '100%',
        marginBottom: 2,
    },
    spellSlotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spellImageContainer: {
        width: '16.5%',
        aspectRatio: 1,
        marginStart: 18,
        marginTop: 4,
        marginBottom: 4,
    },
    spellImageFrame: {
        padding: 6,
    },
    spellImage: {
        width: '100%',
        height: '100%',
    },
    spellInfoContainer: {
        flex: 1,
        marginStart: 12,
    },
    spellName: {
        color: 'white',
        fontFamily: values.font,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    spellElement: {
        fontSize: 13,
        fontFamily: values.fontRegular,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    noSpellsText: {
        flex: 1,
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 18,
        fontFamily: values.fontRegular,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
});
