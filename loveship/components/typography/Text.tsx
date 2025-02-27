import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

type TextColors = 'sky' | 'grass' | 'sun' | 'fire' | 'white' | 'night50' | 'night300' | 'night400' | 'night500' | 'night600' | 'night700' | 'night800' | 'night900' | uui.TextProps['color'];
type TextSize = 'none' | '18' | '24' | '30' | '36' | '42' | '48';

interface TextMods {
    /**
     * Defines component color.
     * @default 'night700'
     */
    color?: TextColors;
    /**
     * Defines text size
     * @default '36'
     */
    size?: TextSize;
    /** Defines text line-height */
    lineHeight?: '12' | '18' | '24' | '30';
    /** Defines text font-size */
    fontSize?: '10' | '12' | '14' | '16' | '18' | '24';
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
