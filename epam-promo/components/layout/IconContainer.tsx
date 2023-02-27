import { IconContainer as uuiIconContainer } from '@epam/uui';
import { ControlIconProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { IconColor } from '../buttons';

export interface IconContainerMods {
    color?: IconColor;
}

export function applyIconContainerMods(mods: IconContainerMods) {}

export const IconContainer = withMods<ControlIconProps, IconContainerMods>(
    uuiIconContainer,
    applyIconContainerMods,
);
