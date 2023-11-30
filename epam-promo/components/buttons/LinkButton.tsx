import { createSkinComponent, devLogger } from '@epam/uui-core';
import { LinkButtonCoreProps, LinkButton as UuiLinkButton, LinkButtonProps as UuiLinkButtonProps } from '@epam/uui';

export interface LinkButtonMods {
    /**
     * @default 'blue'
     */
    color?: 'blue' | 'green' | 'amber' | 'red' | 'gray60' | 'gray10';
}

export type LinkButtonProps = LinkButtonCoreProps & LinkButtonMods;

export const LinkButton = createSkinComponent<UuiLinkButtonProps, LinkButtonProps>(
    UuiLinkButton,
    (props) => {
        if (__DEV__) {
            devLogger.warnAboutDeprecatedPropValue<LinkButtonProps, 'color'>({
                component: 'LinkButton',
                propName: 'color',
                propValue: props.color,
                condition: () => ['green', 'amber', 'red'].indexOf(props.color) !== -1,
            });
        }
        return {
            color: props.color ?? 'blue',
        } as LinkButtonProps;
    },
    () => [],
);
