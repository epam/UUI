import { withMods } from '@epam/uui-core';
import { getTextClasses, TextSettings } from '../../helpers';
import * as uuiComponents from '@epam/uui-components';
import css from './Text.module.scss';

type TextColor = 'info' | 'warning' | 'critical' | 'success' | 'brand' | 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'white';
type TextSize = 'none' | '18' | '24' | '30' | '36' | '42' | '48';
type TextFontStyle = 'normal' | 'italic';
type TextFontWeight = '200' | '300' | '400' | '600' | '700' | '900';

interface TextMods {
    /**
     * Defines text color.
     * @default 'primary'
     */
    color?: TextColor;
}

export interface TextCoreProps extends uuiComponents.TextProps, TextSettings {
    /**
     * Defines text font weight value
     * @default '400'
     */
    fontWeight?: TextFontWeight;
    /**
     * Determines the style of the text font.
     * @default 'normal'
     */
    fontStyle?: TextFontStyle;
    /**
     * Defines text size
     * @default '36'
     */
    size?: TextSize;
}

export interface TextProps extends TextCoreProps, TextMods {}

function applyTextMods(mods: TextProps) {
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

export const Text = /* @__PURE__ */withMods<uuiComponents.TextProps, TextProps>(uuiComponents.Text, applyTextMods);
