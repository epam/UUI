import { IconButtonProps as uuiIconButtonProps, IconButton as uuiIconButton, IconButtonCoreProps } from '@epam/uui';
import { devLogger, createSkinComponent } from '@epam/uui-core';
import { EpamAdditionalColor, EpamPrimaryColor } from '../types';

export interface IconButtonMods {
    color?: EpamPrimaryColor | EpamAdditionalColor | 'white' | 'night200' | 'night300' | 'night400' | 'night500' | 'night600';
}

export type IconButtonProps = IconButtonCoreProps & IconButtonMods;

export const IconButton = createSkinComponent<uuiIconButtonProps, IconButtonProps>(
    uuiIconButton,
    () => [],
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
        } as IconButtonProps;
    },
);
