import { IconButton as uuiIconButton, IconButtonProps as UuiIconButtonProps } from '@epam/uui';
import { withMods } from '@epam/uui-core';
import { commonControlColors } from "../types";


export type IconColor = typeof commonControlColors[number];
export const allIconColors: IconColor[] = commonControlColors;

export interface IconButtonMods {
    color?: IconColor;
}

export type IconButtonProps = Omit<UuiIconButtonProps, 'color'> & IconButtonMods;

export const IconButton = withMods<Omit<UuiIconButtonProps, 'color'>, IconButtonMods>(
    uuiIconButton,
    () => [],
    (props) => ({
        color: props.color ?? 'night600',
    }) as IconButtonProps,
);
