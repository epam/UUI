import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

type TextSize = 'none' | '18' | '24' | '30' | '36' | '42' | '48';

interface TextMods {
    /**
     * Defines component color.
     * @default 'gray80'
     */
    color?: 'blue' | 'green' | 'amber' | 'red' | 'white' | 'gray5' | 'gray50' | 'gray60' | 'gray80' | 'gray90' | uui.TextProps['color'];
    /**
     * Defines text size
     * @default '36'
     */
    size?: TextSize;
}

/** Represents the properties of a Text component. */
export interface TextProps extends uui.TextCoreProps, TextMods {}

export const Text = createSkinComponent<uui.TextProps, TextProps>(
    uui.Text,
    (props) => {
        return ({
            color: props.color ?? 'gray80',
        });
    },
);
