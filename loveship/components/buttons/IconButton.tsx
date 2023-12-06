import * as uui from '@epam/uui';
import { createSkinComponent, devLogger } from '@epam/uui-core';
import { EpamAdditionalColor, EpamPrimaryColor } from '../types';

export interface IconButtonMods {
    /**
     * @default 'night600'
     */
    color?: EpamPrimaryColor | EpamAdditionalColor | 'white' | 'night200' | 'night300' | 'night400' | 'night500' | 'night600';
}

export type IconButtonProps = uui.IconButtonCoreProps & IconButtonMods;

export const IconButton = createSkinComponent<uui.IconButtonProps, IconButtonProps>(
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
