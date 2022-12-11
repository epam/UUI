import { IconContainer as uuiIconContainer, ControlIconProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { IconColor } from '../buttons';
import css from './IconContainer.scss';
import '../../assets/styles/variables/layout/iconContainer.scss';

export interface IconContainerMods {
    color?: IconColor;
}

export function applyIconContainerMods(mods: IconContainerMods) {
    return [
        `icon-container-color-${mods.color || 'default'}`,
        css.root,
    ];
}

export const IconContainer = withMods<ControlIconProps, IconContainerMods>(
    uuiIconContainer,
    applyIconContainerMods,
    () => ({ tabIndex: 0 }),
);
