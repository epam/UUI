import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as uui from '@epam/uui';

type LinkButtonColor = 'sky' | 'grass' | 'sun' | 'fire' | 'cobalt' | 'violet' | 'fuchsia' | 'white' | 'night50'
| 'night100' | 'night200' | 'night300' | 'night400' | 'night500' | 'night600' | 'night700' | 'night800' | 'night900'
| uui.LinkButtonProps['color'];

type LinkButtonMods = {
    /**
     * Defines component color.
     * @default 'sky'
     */
    color?: LinkButtonColor;
};

/** Represents the properties of a LinkButton component. */
export type LinkButtonProps = uui.LinkButtonCoreProps & LinkButtonMods;

export const LinkButton = createSkinComponent<uui.LinkButtonProps, LinkButtonProps>(
    uui.LinkButton,
    (props) => {
        if (__DEV__) {
            devLogger.warnAboutDeprecatedPropValue<LinkButtonProps, 'color'>({
                component: 'LinkButton',
                propName: 'color',
                propValue: props.color,
                condition: () => ['grass', 'sun', 'fire', 'cobalt', 'violet', 'fuchsia', 'white', 'night50', 'night200', 'night300', 'night400', 'night500', 'night700', 'night800', 'night900'].indexOf(props.color) !== -1,
            });
        }
        return {
            color: props.color ?? 'sky',
        };
    },
    () => [],
);
