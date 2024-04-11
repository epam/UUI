import * as uui from '@epam/uui';
import { ControlIconProps } from '@epam/uui-components';
import { createSkinComponent, devLogger } from '@epam/uui-core';
import css from './IconContainer.module.scss';

type IconContainerColors = 'sky' | 'grass' | 'sun' | 'fire' | 'carbon' | 'cobalt' | 'violet' | 'fuchsia' | 'white' | 'night50' | 'night100' | 'night200' | 'night300' | 'night400' | 'night500' | 'night600' | 'night700' | 'night800' | 'night900';

interface IconContainerMods {
    /**
     * Defines component color.
     * @deprecated Property color is deprecated and will be removed in future release. Please make icon color configuration by yourself, e.g. via cx or style prop.
     * @default 'night600'
     */
    color?: IconContainerColors;
}

function applyIconContainerMods(mods: IconContainerMods) {
    return [
        css.root,
        css[`icon-container-${mods.color || 'night600'}`],
    ];
}

/** Represents the properties of the IconContainer component. */
export interface IconContainerProps extends ControlIconProps, IconContainerMods {}

export const IconContainer = /* @__PURE__ */createSkinComponent<ControlIconProps, IconContainerProps>(
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
