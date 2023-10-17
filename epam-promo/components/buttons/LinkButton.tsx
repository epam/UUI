import { createSkinComponent, devLogger } from '@epam/uui-core';
import { LinkButtonPropsType, LinkButton as UuiLinkButton } from '@epam/uui';

export interface LinkButtonMods {
    color?: 'blue' | 'green' | 'amber' | 'red' | 'gray60' | 'gray10';
}

export type LinkButtonProps = LinkButtonPropsType & LinkButtonMods;

export const LinkButton = createSkinComponent<LinkButtonPropsType, LinkButtonProps>(
    UuiLinkButton,
    () => [],
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
        };
    },
);
