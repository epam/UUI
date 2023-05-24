import { IconContainer as uuiIconContainer } from '@epam/uui';
import { ControlIconProps } from '@epam/uui-components';
import { devLogger, withMods } from '@epam/uui-core';
import { EpamPrimaryColor } from '../types';
import css from './IconContainer.module.scss';

export interface IconContainerMods {
    color?: EpamPrimaryColor | 'night400' | 'night500' | 'night600';
}

export function applyIconContainerMods(mods: IconContainerMods) {
    return [
        css.root,
        css[`icon-container-${mods.color || 'night600'}`],
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
