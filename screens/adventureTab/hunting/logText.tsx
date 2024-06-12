import {StyleSheet, Text} from 'react-native';
import SpannableBuilder from '@mj-studio/react-native-spannable-string';
import {colors} from '../../../utils/colors.ts';
import {Log} from '../../../types/log.ts';

interface props {
    log: Log;
}

export function LogText({log}: props) {
    SpannableBuilder.getInstanceWithComponent(Text);

    switch (log.atkType) {
        case 'Win':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' has defeated ' + log.opponent,
                    log.turn ? colors.enemy_color : colors.player_color,
                )
                .build();
        case 'Dodge':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' ',
                    log.turn ? colors.player_color : colors.enemy_color,
                )
                .append('missed the attack. ')
                .appendColored(' (Dodge)', colors.dodge_color)
                .build();
        case 'Physical':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' ',
                    log.turn ? colors.player_color : colors.enemy_color,
                )
                .append('deals ' + log.damage)
                .appendColored(' physical ', colors.physicalAtk_color)
                .append('damage.')
                .build();
        case 'Magical':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' ',
                    log.turn ? colors.player_color : colors.enemy_color,
                )
                .append('deals ' + log.damage)
                .appendColored(' magical ', colors.magicalAtk_color)
                .append('damage.')
                .build();
        case 'PhysicalCrit':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' ',
                    log.turn ? colors.player_color : colors.enemy_color,
                )
                .append('deals ' + log.damage)
                .appendColored(' physical ', colors.physicalAtk_color)
                .append('damage. ')
                .appendColored('(Critical)', colors.critical_color)
                .build();
        case 'MagicalCrit':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' ',
                    log.turn ? colors.player_color : colors.enemy_color,
                )
                .append('deals ' + log.damage)
                .appendColored(' magical ', colors.magicalAtk_color)
                .append('damage. ')
                .appendColored('(Critical)', colors.critical_color)
                .build();
        case 'SpellPhysicalDodge':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' ',
                    log.turn ? colors.player_color : colors.enemy_color,
                )
                .append('cast ')
                .appendColored(
                    log.spellName as string,
                    colors.physicalAtk_color,
                )
                .append(' and missed.')
                .appendColored(' (Dodge)', colors.dodge_color)
                .build();
        case 'SpellMagicalDodge':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' ',
                    log.turn ? colors.player_color : colors.enemy_color,
                )
                .append('cast ')
                .appendColored(log.spellName as string, colors.magicalAtk_color)
                .append(' and missed.')
                .appendColored(' (Dodge)', colors.dodge_color)
                .build();
        case 'SpellPhysical':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' ',
                    log.turn ? colors.player_color : colors.enemy_color,
                )
                .append('cast ')
                .appendColored(
                    log.spellName as string,
                    colors.physicalAtk_color,
                )
                .append(' dealing ' + log.damage)
                .appendColored(' physical ', colors.physicalAtk_color)
                .append('damage.')
                .build();
        case 'SpellMagical':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' ',
                    log.turn ? colors.player_color : colors.enemy_color,
                )
                .append('cast ')
                .appendColored(log.spellName as string, colors.magicalAtk_color)
                .append(' dealing ' + log.damage)
                .appendColored(' magical ', colors.magicalAtk_color)
                .append('damage.')
                .build();
        case 'SpellPhysicalCrit':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' ',
                    log.turn ? colors.player_color : colors.enemy_color,
                )
                .append('cast ')
                .appendColored(
                    log.spellName as string,
                    colors.physicalAtk_color,
                )
                .append(' dealing ' + log.damage)
                .appendColored(' physical ', colors.physicalAtk_color)
                .append('damage. ')
                .appendColored('(Critical)', colors.critical_color)
                .build();
        case 'SpellMagicalCrit':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' ',
                    log.turn ? colors.player_color : colors.enemy_color,
                )
                .append('cast ')
                .appendColored(log.spellName as string, colors.magicalAtk_color)
                .append(' dealing ' + log.damage)
                .appendColored(' magical ', colors.magicalAtk_color)
                .append('damage. ')
                .appendColored('(Critical)', colors.critical_color)
                .build();
        case 'Bleeding':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' ',
                    log.turn ? colors.player_color : colors.enemy_color,
                )
                .append('took ' + log.damage)
                .appendColored(' physical ', colors.physicalAtk_color)
                .append('damage.')
                .appendColored(' (Bleeding)', colors.bleeding_color)
                .build();
        case 'Poison':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' ',
                    log.turn ? colors.player_color : colors.enemy_color,
                )
                .append('took ' + log.damage)
                .appendColored(' physical ', colors.physicalAtk_color)
                .append('damage.')
                .appendColored(' (Poison)', colors.poison_color)
                .build();
        case 'Burning':
            return SpannableBuilder.getInstance(styles.text)
                .appendColored(
                    log.username + ' ',
                    log.turn ? colors.player_color : colors.enemy_color,
                )
                .append('took ' + log.damage)
                .appendColored(' magical ', colors.magicalAtk_color)
                .append('damage.')
                .appendColored(' (Burning)', colors.burning_color)
                .build();
    }
}

const styles = StyleSheet.create({
    text: {
        marginBottom: 8,
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontFamily: 'Myriad_Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
});
