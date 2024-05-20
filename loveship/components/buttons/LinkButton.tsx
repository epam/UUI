import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

type LinkButtonColor = 'sky' | 'grass' | 'fire' | 'night100' | 'night600' | uui.LinkButtonProps['color'];

type LinkButtonMods = {
    /**
     * Defines component color.
     * @default 'sky'
     */
    color?: LinkButtonColor;
};
// TODO: leave 3 colors white, blue, gray - more specific colors will be determined later.
/** Represents the properties of a LinkButton component. */
export type LinkButtonProps = uui.LinkButtonCoreProps & LinkButtonMods;

export const LinkButton = createSkinComponent<uui.LinkButtonProps, LinkButtonProps>(
    uui.LinkButton,
    (props) => {
        return {
            color: props.color ?? 'sky',
        };
    },
    () => [],
);
