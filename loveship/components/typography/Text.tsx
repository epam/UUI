import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

type TextColors = 'sky' | 'grass' | 'sun' | 'fire' | 'white' | 'night50' | 'night300' | 'night400' | 'night500' | 'night600' | 'night700' | 'night800' | 'night900' | uui.TextProps['color'];

interface TextMods extends Pick<uui.TextProps, 'fontStyle' | 'fontWeight' | 'size' | 'lineHeight' | 'fontSize'> {
    /**
     * Defines component color.
     * @default 'night700'
     */
    color?: TextColors;
}

/** Represents the properties of the Text component. */
export interface TextProps extends uui.TextCoreProps, TextMods {}

export const Text = createSkinComponent<uui.TextProps, TextProps>(
    uui.Text,
    (props) => {
        return ({
            color: props.color ?? 'night700',
        });
    },
);
