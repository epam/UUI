import { withMods } from '@epam/uui-core';
import { allEpamPrimaryColors, EpamPrimaryColor } from '../types';
import { IconButton as uuiIconButton, IconButtonProps as UuiIconButtonProps } from '@epam/uui';

export type IconColor = EpamPrimaryColor | 'gray30' | 'gray50' | 'gray60';
export const allIconColors: IconColor[] = [
    ...allEpamPrimaryColors, 'gray30', 'gray50', 'gray60',
];

export interface IconButtonMods {
    color?: IconColor;
}

export type IconButtonProps = Omit<UuiIconButtonProps, 'color'> & IconButtonMods;

export const IconButton = withMods<Omit<UuiIconButtonProps, 'color'>, IconButtonMods>(
    uuiIconButton,
    () => [],
    (props): IconButtonProps =>
        ({
            color: props.color ?? 'gray60',
        }),
);
