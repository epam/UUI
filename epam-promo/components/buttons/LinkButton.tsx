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
        const isWarn = ['green', 'amber', 'red'].includes(props.color);
        isWarn && devLogger.warn('LinkButton: color properties "green", "amber" and "red" are deprecated and will be removed in future release. Please use "blue", "gray60" or "gray10", instead.');
        return {
            color: props.color ?? 'blue',
        } as LinkButtonProps;
    },
);
