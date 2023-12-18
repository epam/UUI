import { devLogger, withMods } from '@epam/uui-core';
import * as uui from '@epam/uui';
import * as types from '../types';

interface TextMods {
    /**
     * @default 'gray80'
     */
    color?: 'blue' | 'green' | 'amber' | 'red' | 'white' | 'gray5' | 'gray50' | 'gray60' | 'gray80' | 'gray90' | uui.TextProps['color'];
    /**
     * @default 'sans'
     */
    font?: types.FontStyle;
}

export type TextProps = Omit<uui.TextProps, 'color' | 'font'> & TextMods;

export const Text = withMods<Omit<uui.TextProps, 'color' | 'font'>, TextMods>(
    uui.Text,
    (props) => [props.font && `uui-font-${props.font}`],
    (props) => {
        if (__DEV__) {
            if (props.font) {
                devLogger.warn('(Text) Property font is deprecated and will be removed in the future release. Please use fontWeight and/or fontStyle props instead.');
            }
        }
        return ({
            color: props.color ?? 'gray80',
        } as TextProps);
    },
);
