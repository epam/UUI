import { createSkinComponent } from '@epam/uui-core';
import { EpamPrimaryColor } from '../types';
import * as uui from '@epam/uui';

export type IconColor = EpamPrimaryColor | 'gray30' | 'gray50' | 'gray60';

export interface IconButtonMods {
    /**
     * @default 'gray60'
     */
    color?: IconColor;
}

export type IconButtonProps = uui.IconButtonCoreProps & IconButtonMods;

export const IconButton = createSkinComponent<uui.IconButtonProps, IconButtonProps>(
    uui.IconButton,
    (props) => ({ color: props.color ?? 'gray60' }),
);
