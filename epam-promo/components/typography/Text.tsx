import { withMods } from '@epam/uui-core';
import { Text as UuiText, TextProps as UuiTextProps } from '@epam/uui';
import * as types from '../types';

export interface TextMods {
    color?: 'blue' | 'green' | 'amber' | 'red' | 'white' | 'gray5' | 'gray50' | 'gray60' | 'gray80' | 'gray90';
    font?: types.FontStyle;
}

export type TextProps = Omit<UuiTextProps, 'color' | 'font'> & TextMods;

export const Text = withMods<Omit<UuiTextProps, 'color' | 'font'>, TextMods>(
    UuiText,
    () => [],
    (props) =>
        ({
            color: props.color ?? 'gray80',
            font: props.font ?? 'sans',
        } as TextProps),
);
