import * as uui from '@epam/uui';
import { createSkinComponent, devLogger } from '@epam/uui-core';
import { EpamAdditionalColor, EpamPrimaryColor } from '../types';

type IconButtonColor = EpamPrimaryColor | EpamAdditionalColor | 'white' | 'night200' | 'night300' | 'night400'
| 'night500' | 'night600' | uui.IconButtonProps['color'];

type IconButtonMods = {
    /**
     * Defines component color.
     * @default 'night600'
     */
    color?: IconButtonColor;
};

/** Represents the properties of a IconButton component. */
export type IconButtonProps = uui.IconButtonCoreProps & IconButtonMods;

export const IconButton = /* @__PURE__ */createSkinComponent<uui.IconButtonProps, IconButtonProps>(
    uui.IconButton,
    (props) => {
        if (__DEV__) {
            devLogger.warnAboutDeprecatedPropValue<IconButtonProps, 'color'>({
                component: 'IconButton',
                propName: 'color',
                propValue: props.color,
                condition: () => ['night200', 'night300', 'night400'].indexOf(props.color) !== -1,
            });
        }
        return {
            color: props.color ?? 'night600',
        };
    },
);
