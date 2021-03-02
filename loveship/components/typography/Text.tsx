import * as css from './Text.scss';
import * as styles from '../../assets/styles/scss/loveship-color-vars.scss';
import * as types from '../types';
import { Text as uuiText, TextProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import { getTextClasses, TextSettings } from '../../helpers/textLayout';

export interface TextMods extends TextSettings {
    size?: types.TextSize | '42';
    font?: types.FontStyle;
    color?: types.EpamColor;
}

function applyTextMods(mods: TextMods) {
    const textClasses = getTextClasses({
        size: mods.size || '36',
        lineHeight: mods.lineHeight,
        fontSize: mods.fontSize,
    }, false);

    return [
        css.text,
        css['font-' + (mods.font || 'sans')],
        styles['color-' + (mods.color || 'night700')],
    ].concat(textClasses);
}

export const Text = withMods<TextProps, TextMods>(uuiText, applyTextMods);
