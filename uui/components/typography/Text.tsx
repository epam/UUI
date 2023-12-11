import { withMods } from '@epam/uui-core';
import { getTextClasses, TextSettings } from '../../helpers';
import * as UuiComponents from '@epam/uui-components';
import css from './Text.module.scss';

export type TextColor = 'info' | 'warning' | 'error' | 'success' | 'brand' | 'primary' | 'secondary' | 'disabled' | 'white';
export type TextSize = 'none' | '18' | '24' | '30' | '36' | '42' | '48';
export type TextFontStyle = 'normal' | 'italic';
export type TextFontWeight = '200' | '300' | '400' | '600' | '700' | '900';

export type TextMods = TextSettings & {
    /** @default primary */
    color?: TextColor;
};

export type TextCoreProps = UuiComponents.TextProps & TextSettings & {
    /** @default 400 */
    fontWeight?: TextFontWeight;
    /** @default normal */
    fontStyle?: TextFontStyle;
    /** @default 36 */
    size?: TextSize;
};

export type TextProps = TextCoreProps & TextMods;

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

export const Text = withMods<UuiComponents.TextProps, TextProps>(UuiComponents.Text, applyTextMods);
