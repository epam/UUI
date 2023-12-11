import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as uui from '@epam/uui';
import * as types from '../types';

export type TextMods = {
    /**
     * @default 'gray80'
     */
    color?: 'blue' | 'green' | 'amber' | 'red' | 'white' | 'gray5' | 'gray50' | 'gray60' | 'gray80' | 'gray90';
    /**
     * @default 'sans'
     */
    font?: types.FontStyle;
};

export type TextProps = uui.TextCoreProps & TextMods;

export const Text = createSkinComponent<uui.TextProps, TextProps>(
    uui.Text,
    (props) => {
        if (__DEV__) {
            if (props.font) {
                devLogger.warn('(Text) Property font is deprecated and will be removed in the future release. Please use fontWeight and/or fontStyle props instead.');
            }
        }
        return ({
            color: props.color ?? 'gray80',
        });
    },
    (props) => [props.font && `uui-font-${props.font}`],
);
