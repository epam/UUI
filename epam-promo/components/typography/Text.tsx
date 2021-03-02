import * as React from 'react';
import * as css from './Text.scss';
import * as types from '../types';
import { Text as uuiText, TextProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import { getTextClasses, TextSettings } from '../../helpers/textLayout';

export interface TextMods extends TextSettings {
    size?: types.TextSize | '42';
    font?: types.FontStyle;
    color?: 'gray5' | 'gray60' | 'gray80' | 'gray90';
}

function applyTextMods(mods: TextMods) {
    const textClasses = getTextClasses({
        size: mods.size || '36',
        lineHeight: mods.lineHeight,
        fontSize: mods.fontSize,
    }, false);

    return [
        css.root,
        css['font-' + (mods.font || 'sans')],
        css['text-color-' + (mods.color || 'gray80')],
    ].concat(textClasses);
}

export const Text = withMods<TextProps, TextMods>(uuiText, applyTextMods);