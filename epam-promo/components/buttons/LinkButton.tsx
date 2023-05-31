import { devLogger, withMods } from '@epam/uui-core';
import { LinkButton as UuiLinkButton, LinkButtonProps as UuiLinkButtonProps } from '@epam/uui';

export type LinkButtonColorType = 'blue' | 'green' | 'amber' | 'red' | 'gray60' | 'gray10';
export const allLinkButtonColors: LinkButtonColorType[] = ['blue', 'green', 'amber', 'red', 'gray60', 'gray10'];

export interface LinkButtonMods {
    color?: LinkButtonColorType;
}

export type LinkButtonProps = Omit<UuiLinkButtonProps, 'color'> & LinkButtonMods;

export const LinkButton = withMods<Omit<UuiLinkButtonProps, 'color'>, LinkButtonMods>(
    UuiLinkButton,
    () => [],
    (props) => {
        devLogger.warnAboutDeprecatedPropValue<LinkButtonProps, 'color'>({
            component: 'LinkButton',
            propName: 'color',
            propValue: props.color,
            condition: () => ['green', 'amber', 'red'].indexOf(props.color) !== -1,
        });
        return {
            color: props.color ?? 'blue',
        } as LinkButtonProps;
    },
);
