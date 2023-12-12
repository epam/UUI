import { createSkinComponent } from '@epam/uui-core';
import { EpamPrimaryColor } from '../types';
import * as uui from '@epam/uui';

/** Represents a color for an icon. */
export type IconColor = EpamPrimaryColor | 'gray30' | 'gray50' | 'gray60';

export interface IconButtonMods {
    /**
     * Optional parameter representing the color of an icon.
     * @default 'gray60'
     */
    color?: IconColor;
}

/**
 * Represents the properties for the IconButton component.
 */
export type IconButtonProps = uui.IconButtonCoreProps & IconButtonMods;

export const IconButton = createSkinComponent<uui.IconButtonProps, IconButtonProps>(
    uui.IconButton,
    (props) => ({ color: props.color ?? 'gray60' }),
);
