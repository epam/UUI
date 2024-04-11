import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as uui from '@epam/uui';

type LinkButtonMods = {
    /**
     * Defines component color.
     * @default 'blue'
     */
    color?: 'blue' | 'green' | 'amber' | 'red' | 'gray60' | 'gray10' | uui.LinkButtonProps['color'];
};

/** Represents the properties for the LinkButton component. */
export type LinkButtonProps = uui.LinkButtonCoreProps & LinkButtonMods;

export const LinkButton = /* @__PURE__ */createSkinComponent<uui.LinkButtonProps, LinkButtonProps>(
    uui.LinkButton,
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
