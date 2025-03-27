import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

interface TextMods extends Pick<uui.TextProps, 'fontStyle' | 'fontWeight' | 'size' | 'lineHeight' | 'fontSize'> {
    /**
     * Defines component color.
     * @default 'gray80'
     */
    color?: 'blue' | 'green' | 'amber' | 'red' | 'white' | 'gray5' | 'gray50' | 'gray60' | 'gray80' | 'gray90' | uui.TextProps['color'];
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
