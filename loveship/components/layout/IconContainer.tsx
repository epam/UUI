import { IconContainer as uuiIconContainer } from '@epam/uui';
import { ControlIconProps } from '@epam/uui-components';
import { devLogger, withMods } from '@epam/uui-core';
import css from './IconContainer.module.scss';

export interface IconContainerMods {
    /** IconContainer color.
     *  @deprecated Property color is deprecated and will be removed in future release. Please make icon color configuration by yourself, e.g. via cx or style prop.
     * */
    color?: 'sky' | 'grass' | 'sun' | 'fire' | 'carbon' | 'cobalt' | 'lavanda' | 'fuchsia' | 'white' | 'night50' | 'night100' | 'night200' | 'night300' | 'night400' | 'night500' | 'night600' | 'night700' | 'night800' | 'night900';
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
