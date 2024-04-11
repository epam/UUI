import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as uui from '@epam/uui';
import * as types from '../types';

interface TextMods {
    /**
     * Defines component color.
     * @default 'gray80'
     */
    color?: 'blue' | 'green' | 'amber' | 'red' | 'white' | 'gray5' | 'gray50' | 'gray60' | 'gray80' | 'gray90' | uui.TextProps['color'];
    /**
     * Defines component font.
     * @default 'sans'
     */
    font?: types.FontStyle;
}

/** Represents the properties of a Text component. */
export interface TextProps extends uui.TextCoreProps, TextMods {}

export const Text = /* @__PURE__ */createSkinComponent<uui.TextProps, TextProps>(
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
