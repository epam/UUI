import { IconContainer as uuiIconContainer } from '@epam/uui';
import { ControlIconProps } from '@epam/uui-components';
import { devLogger, withMods } from '@epam/uui-core';
import css from './IconContainer.module.scss';

export type IconContainerColors = 'blue' | 'green' | 'amber' | 'red' | 'cyan' | 'orange' | 'purple' | 'violet' | 'white' | 'gray5' | 'gray10' | 'gray20' | 'gray30' | 'gray40' | 'gray50' | 'gray60' | 'gray70' | 'gray80' | 'gray90';
export const allIconContainerColors: IconContainerColors[] = ['blue', 'green', 'amber', 'red', 'cyan', 'orange', 'purple', 'violet', 'white', 'gray5', 'gray10', 'gray20', 'gray30', 'gray40', 'gray50', 'gray60', 'gray70', 'gray80', 'gray90'];

export interface IconContainerMods {
    /** IconContainer color.
     *  @deprecated Property color is deprecated and will be removed in future release. Please make icon color configuration by yourself, e.g. via cx or style prop.
     * */
    color?: IconContainerColors;
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
        if (props.color && __DEV__) {
            devLogger.warn('IconContainer: Property color is deprecated and will be removed in the future release. Please make icon color configuration by yourself, e.g. via cx or style prop.');
        }
        return null;
    },
);
