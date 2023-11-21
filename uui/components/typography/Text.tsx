import * as types from '../types';
import { withMods } from '@epam/uui-core';
import { getTextClasses, TextSettings } from '../../helpers';
import { Text as uuiText, TextProps as UuiTextProps } from '@epam/uui-components';
import css from './Text.module.scss';

export type TextColor = 'info' | 'warning' | 'error' | 'success' | 'brand' | 'primary' | 'secondary' | 'disabled' | 'white';
export const allTextColors: TextColor[] = ['info', 'warning', 'error', 'success', 'brand', 'primary', 'secondary', 'disabled', 'white'];

export interface TextMods extends TextSettings {
    color?: TextColor;
    fontWeight?: types.FontWeight;
    fontStyle?: types.FontStyle;
    size?: types.TextSize | '42';
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
        `uui-color-${mods.color || 'primary'}`,
        `uui-font-weight-${mods.fontWeight || '400'}`,
        `uui-font-style-${mods.fontStyle || 'normal'}`,
        'uui-typography',
    ].concat(textClasses);
}

export const Text = withMods<UuiTextProps, TextMods>(uuiText, applyTextMods);
