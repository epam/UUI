import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

type LinkButtonMods = {
    /**
     * Defines component color.
     * @default 'blue'
     */
    color?: 'blue' | 'green' | 'red' | 'gray60' | 'gray10' | uui.LinkButtonProps['color'];
};

/** Represents the properties for the LinkButton component. */
export type LinkButtonProps = uui.LinkButtonCoreProps & LinkButtonMods;

export const LinkButton = createSkinComponent<uui.LinkButtonProps, LinkButtonProps>(
    uui.LinkButton,
    (props) => {
        return {
            color: props.color ?? 'blue',
        };
    },
);
