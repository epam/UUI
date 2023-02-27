import { IconContainer as uuiIconContainer } from '@epam/uui';
import { ControlIconProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { EpamPrimaryColor } from '../types';

export interface IconContainerMods {
    color?: EpamPrimaryColor | 'night400' | 'night500' | 'night600';
}

export function applyIconContainerMods(mods: IconContainerMods) {}

export const IconContainer = withMods<ControlIconProps, IconContainerMods>(
    uuiIconContainer,
    applyIconContainerMods,
);
