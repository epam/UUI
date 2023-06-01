import { IconButton as uuiIconButton, IconButtonProps as UuiIconButtonProps } from '@epam/uui';
import { devLogger, withMods } from '@epam/uui-core';
import { commonControlColors } from '../types';

export type IconColor = (typeof commonControlColors)[number];
export const allIconColors: IconColor[] = commonControlColors;
export const deprecatedIconButtonColors = ['night200', 'night300', 'night400'];

export interface IconButtonMods {
    color?: IconColor;
}

export type IconButtonProps = Omit<UuiIconButtonProps, 'color'> & IconButtonMods;

export const IconButton = withMods<Omit<UuiIconButtonProps, 'color'>, IconButtonMods>(
    uuiIconButton,
    () => [],
    (props) => {
        devLogger.warnAboutDeprecatedPropValue<IconButtonProps, 'color'>({
            component: 'IconButton',
            propName: 'color',
            propValue: props.color,
            condition: () => deprecatedIconButtonColors.indexOf(props.color) !== -1,
        });
        return {
            color: props.color ?? 'night600',
        } as IconButtonProps;
    },
);
