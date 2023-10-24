import { createSkinComponent } from '@epam/uui-core';
import { allEpamPrimaryColors, EpamPrimaryColor } from '../types';
import { IconButtonCoreProps, IconButton as uuiIconButton } from '@epam/uui';

export type IconColor = EpamPrimaryColor | 'gray30' | 'gray50' | 'gray60';
export const allIconColors: IconColor[] = [
    ...allEpamPrimaryColors, 'gray30', 'gray50', 'gray60',
];

export interface IconButtonMods {
    color?: IconColor;
}

export type IconButtonProps = IconButtonCoreProps & IconButtonMods;

export const IconButton = createSkinComponent<IconButtonCoreProps, IconButtonProps>(
    uuiIconButton,
    (props) =>
        ({
            color: props.color ?? 'gray60',
        }),
    () => [],
);
