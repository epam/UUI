import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as uui from '@epam/uui';
import * as types from '../types';

type TextColors = 'sky' | 'grass' | 'sun' | 'fire' | 'white' | 'night50' | 'night300' | 'night400' | 'night500' | 'night600' | 'night700' | 'night800' | 'night900' | uui.TextProps['color'];

interface TextMods {
    /**
     * Defines component color.
     * @default 'night700'
     */
    color?: TextColors;
    /**
     * Defines component font.
     * @default 'sans'
     */
    font?: types.FontStyle;
}

/** Represents the properties of the Text component. */
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
            color: props.color ?? 'night700',
        });
    },
    (props) => [props.font && `uui-font-${props.font}`],
);
