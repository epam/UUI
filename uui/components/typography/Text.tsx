import * as types from '../types';
import { withMods } from '@epam/uui-core';
import { getTextClasses, TextSettings } from '../../helpers';
import { Text as uuiText, TextProps as UuiTextProps } from '@epam/uui-components';
import css from './Text.module.scss';

export type TextColor = 'info' | 'warning' | 'critical' | 'success' | 'brand' | 'primary' | 'secondary' | 'disabled' | 'contrast' | 'white';
export const allTextColors: TextColor[] = ['info', 'warning', 'critical', 'success', 'brand', 'primary', 'secondary', 'disabled', 'contrast', 'white'];

export interface TextMods extends TextSettings {
    size?: types.TextSize | '42';
    font?: types.FontStyle;
    color?: TextColor;
}

export type TextProps = UuiTextProps & TextMods;

function applyTextMods(mods: TextMods) {
    const textClasses = getTextClasses(
        {
            size: mods.size || '36',
            lineHeight: mods.lineHeight,
            fontSize: mods.fontSize,
        },
        false,
    );

    return [
        css.root,
        'uui-text',
        `uui-font-${mods.font || 'regular'}`,
        `uui-color-${mods.color || 'primary'}`,
    ].concat(textClasses);
}

export const Text = withMods<UuiTextProps, TextMods>(uuiText, applyTextMods);
