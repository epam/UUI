import { createSkinComponent } from '@epam/uui-core';
import { EpamPrimaryColor } from '../types';
import * as uui from '@epam/uui';

interface IconButtonMods {
    /**
     * Defines component color.
     * @default 'gray60'
     */
    color?: EpamPrimaryColor | 'gray30' | 'gray50' | 'gray60' | uui.IconButtonProps['color'];
}

/** Represents the properties for the IconButton component. */
export type IconButtonProps = uui.IconButtonCoreProps & IconButtonMods;

export const IconButton = /* @__PURE__ */createSkinComponent<uui.IconButtonProps, IconButtonProps>(
    uui.IconButton,
    (props) => ({ color: props.color ?? 'gray60' }),
);
