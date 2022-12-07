import * as React from 'react';
import css from './Text.scss';
import * as types from '../types';
import { Text as uuiText, TextProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { getTextClasses, TextSettings } from '../../helpers/textLayout';
import '../../assets/styles/variables/typography/text.scss';
import '../../assets/styles/fonts-variables.scss';

export interface TextMods extends TextSettings {
    size?: types.TextSize | '42';
    font?: types.FontStyle;
    color?: 'brand' | 'primary' | 'secondary' | 'disabled' | 'contrast';
}

function applyTextMods(mods: TextMods) {
    const textClasses = getTextClasses({
        size: mods.size || '36',
        lineHeight: mods.lineHeight,
        fontSize: mods.fontSize,
    }, false);

    return [
        `font-${mods.font || 'regular'}`,
        `text-color-${mods.color || 'primary'}`,
        css.root,
    ].concat(textClasses);
}

export const Text = withMods<TextProps, TextMods>(uuiText, applyTextMods);
