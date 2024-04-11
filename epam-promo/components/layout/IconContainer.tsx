import * as uui from '@epam/uui';
import * as uuiComponents from '@epam/uui-components';
import { devLogger, createSkinComponent } from '@epam/uui-core';
import css from './IconContainer.module.scss';

type IconContainerColors = 'blue' | 'green' | 'amber' | 'red' | 'cyan' | 'orange' | 'purple' | 'violet' | 'white' | 'gray5' | 'gray10' | 'gray20' | 'gray30' | 'gray40' | 'gray50' | 'gray60' | 'gray70' | 'gray80' | 'gray90';

interface IconContainerMods {
    /**
     *  Defines component color.
     *  @deprecated Property color is deprecated and will be removed in future release. Please make icon color configuration by yourself, e.g. via cx or style prop.
     *  @default 'gray60'
     */
    color?: IconContainerColors;
}

function applyIconContainerMods(mods: IconContainerMods) {
    return [
        css.root,
        css[`icon-container-${mods.color || 'gray60'}`],
    ];
}

/** Represents the properties of a IconContainer component. */
export interface IconContainerProps extends uuiComponents.ControlIconProps, IconContainerMods {}

export const IconContainer = /* @__PURE__ */createSkinComponent<uuiComponents.ControlIconProps, IconContainerProps>(
    uui.IconContainer,
    (props) => {
        if (__DEV__) {
            if (props.color) {
                devLogger.warn('IconContainer: Property color is deprecated and will be removed in the future release. Please make icon color configuration by yourself, e.g. via cx or style prop.');
            }
        }
        return null;
    },
    applyIconContainerMods,
);
