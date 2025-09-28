import {StyleSheet, Text} from 'react-native';
import SpannableBuilder from '@mj-studio/react-native-spannable-string';
import {colors} from '../../../utils/colors.ts';
import {EffectType} from '../../../types/effect.ts';
import {values} from '../../../utils/values.ts';

interface props {
    type: EffectType;
    percent: number | undefined;
}

export function EffectTooltip({type, percent}: props) {
    SpannableBuilder.getInstanceWithComponent(Text);
    percent = percent ?? 0;

    switch (type) {
        case EffectType.Bleeding:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Bleeding', colors.bleeding_color)
                .build();
        case EffectType.Burning:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Burning', colors.burning_color)
                .build();
        case EffectType.Poison:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Poisoned', colors.poison_color)
                .build();
        case EffectType.PhyAtkInc:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Physical ATK', colors.physicalAtk_color)
                .append(' increased by ')
                .append(percent * 100 + '%')
                .build();
        case EffectType.PhyAtkDec:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Physical ATK', colors.physicalAtk_color)
                .append(' decreased by ')
                .append(percent * 100 + '%')
                .build();
        case EffectType.MagAtkInc:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Magical ATK', colors.magicalAtk_color)
                .append(' increased by ')
                .append(percent * 100 + '%')
                .build();
        case EffectType.MagAtkDec:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Magical ATK', colors.magicalAtk_color)
                .append(' decreased by ')
                .append(percent * 100 + '%')
                .build();
        case EffectType.PhyResInc:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Physical RES', colors.physicalRes_color)
                .append(' increased by ')
                .append(percent * 100 + '%')
                .build();
        case EffectType.PhyResDec:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Physical RES', colors.physicalRes_color)
                .append(' decreased by ')
                .append(percent * 100 + '%')
                .build();
        case EffectType.MagResInc:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Magical RES', colors.magicalRes_color)
                .append(' increased by ')
                .append(percent * 100 + '%')
                .build();
        case EffectType.MagResDec:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Magical RES', colors.magicalRes_color)
                .append(' decreased by ')
                .append(percent * 100 + '%')
                .build();
        case EffectType.CritInc:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Critical', colors.critical_color)
                .append(' chance increased by ')
                .append(percent * 100 + '%')
                .build();
        case EffectType.CritDec:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Critical', colors.critical_color)
                .append(' chance decreased by ')
                .append(percent * 100 + '%')
                .build();
        case EffectType.DodgeInc:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Dodge', colors.dodge_color)
                .append(' chance increased by ')
                .append(percent * 100 + '%')
                .build();
        case EffectType.DodgeDec:
            return SpannableBuilder.getInstance(styles.text)
                .appendColored('Dodge', colors.dodge_color)
                .append(' chance decreased by ')
                .append(percent * 100 + '%')
                .build();
    }
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontFamily: values.font,
        fontSize: 13,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
});
