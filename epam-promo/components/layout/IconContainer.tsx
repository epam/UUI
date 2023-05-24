import { IconContainer as uuiIconContainer } from '@epam/uui';
import { ControlIconProps } from '@epam/uui-components';
import { devLogger, withMods } from '@epam/uui-core';
import { IconColor } from '../buttons';
import css from './IconContainer.module.scss';

export interface IconContainerMods {
    color?: IconColor;
}

export function applyIconContainerMods(mods: IconContainerMods) {
    return [
        css.root,
        css[`icon-container-${mods.color || 'gray60'}`],
    ];
}

export const IconContainer = withMods<ControlIconProps, IconContainerMods>(
    uuiIconContainer,
    applyIconContainerMods,
    (props) => {
        if (props.color) {
            devLogger.warn('IconContainer: Property color is deprecated and will be removed in the future release. Please make icon color configuration by yourself, e.g. via cx or style prop.');
        }
        return null;
    },
);
