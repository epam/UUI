import { IconContainer as uuiIconContainer, ControlIconProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import { ColorMod } from "../types";
import * as css from './IconContainer.scss';
import * as styles from '../../assets/styles/scss/loveship-color-vars.scss';

export interface IconContainerMods extends ColorMod {
}

export function applyIconContainerMods(mods: IconContainerMods) {
    return [
        css.root,
        styles['color-' + (mods.color || 'night600')],
    ];
}

export const IconContainer = withMods<ControlIconProps, IconContainerMods>(
    uuiIconContainer,
    applyIconContainerMods,
);