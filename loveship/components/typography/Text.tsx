import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as uui from '@epam/uui';
import * as types from '../types';

export type TextMods = {
    /**
     * @default 'night700'
     */
    color?: 'sky' | 'grass' | 'sun' | 'fire' | 'white' | 'night50' | 'night300' | 'night400' | 'night500' | 'night600' | 'night700' | 'night800' | 'night900';
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
            color: props.color ?? 'night700',
        });
    },
    (props) => [props.font && `uui-font-${props.font}`],
);
