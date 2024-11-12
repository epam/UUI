import { Overwrite, withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { settings } from '../../settings';
import css from './Text.module.scss';

type TextColor = 'info' | 'warning' | 'critical' | 'success' | 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'white';
type TextSize = 'none' | '18' | '24' | '30' | '36' | '42' | '48';
type TextFontStyle = 'normal' | 'italic';
type TextFontWeight = '200' | '300' | '400' | '600' | '700' | '900';

interface TextMods {
    /**
     * Defines text color.
     * @default 'primary'
     */
    color?: TextColor;
    /**
     * Defines text size
     * @default '36'
     */
    size?: TextSize;
}

export interface TextModsOverride {}

export interface TextCoreProps extends uuiComponents.TextProps {
    /** Defines text line-height */
    lineHeight?: '12' | '18' | '24' | '30';
    /** Defines text font-size */
    fontSize?: '10' | '12' | '14' | '16' | '18' | '24';
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
}

export interface TextProps extends TextCoreProps, Overwrite<TextMods, TextModsOverride> {}

function applyTextMods(mods: TextProps) {
    console.log(css);
    return [
        css.root,
        'uui-text',
        `uui-size-${mods.size || settings.sizes.defaults.text}`,
        (mods.size !== 'none' || mods.lineHeight) && css.lineHeight,
        (mods.size !== 'none' || mods.fontSize) && css.fontSize,
        `uui-color-${mods.color || 'primary'}`,
        `uui-font-weight-${mods.fontWeight || '400'}`,
        `uui-font-style-${mods.fontStyle || 'normal'}`,
        'uui-typography',
    ];
}

export const Text = withMods<uuiComponents.TextProps, TextProps>(
    uuiComponents.Text,
    applyTextMods,
    (props) => {
        const style: any = props?.rawProps?.style || {};

        props.fontSize && (style['--uui-text-font-size'] = `${props.fontSize}px`);
        props.lineHeight && (style['--uui-text-line-height'] = `${props.lineHeight}px`);

        return {
            rawProps: {
                ...props?.rawProps,
                style: style,
            },
        };
    },
);
