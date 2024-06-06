import * as uui from '@epam/uui';
import { createSkinComponent } from '@epam/uui-core';
import { EpamAdditionalColor, EpamPrimaryColor } from '../types';

type IconButtonColor = EpamPrimaryColor | EpamAdditionalColor | 'white' | 'night500' | 'night600' | uui.IconButtonProps['color'];

type IconButtonMods = {
    /**
     * Defines component color.
     * @default 'night600'
     */
    color?: IconButtonColor;
};

/** Represents the properties of a IconButton component. */
export type IconButtonProps = uui.IconButtonCoreProps & IconButtonMods;

export const IconButton = createSkinComponent<uui.IconButtonProps, IconButtonProps>(
    uui.IconButton,
    (props) => {
        return {
            color: props.color ?? 'night600',
        };
    },
);
