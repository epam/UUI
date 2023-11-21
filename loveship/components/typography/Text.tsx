import { withMods } from '@epam/uui-core';
import { Text as UuiText, TextProps as UuiTextProps } from '@epam/uui';
import * as types from '../types';

export interface TextMods {
    /**
     * @default 'night700'
     */
    color?: 'sky' | 'grass' | 'sun' | 'fire' | 'white' | 'night50' | 'night300' | 'night400' | 'night500' | 'night600' | 'night700' | 'night800' | 'night900';
    /**
     * @default 'sans'
     */
    font?: types.FontStyle;
}

export type TextProps = Omit<UuiTextProps, 'color' | 'font'> & TextMods;

export const Text = withMods<Omit<UuiTextProps, 'color' | 'font'>, TextMods>(
    UuiText,
    () => [],
    (props) =>
        ({
            color: props.color ?? 'night700',
            font: props.font ?? 'sans',
        } as TextProps),
);
