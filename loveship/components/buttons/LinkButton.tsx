import { devLogger, withMods } from '@epam/uui-core';
import { LinkButton as UuiLinkButton, LinkButtonProps as UuiLinkButtonProps } from '@epam/uui';

export interface LinkButtonMods {
    color?: 'sky' | 'grass' | 'sun' | 'fire' | 'cobalt' | 'lavanda' | 'fuchsia' | 'white' | 'night50' | 'night100' | 'night200' | 'night300' | 'night400' | 'night500' | 'night600' | 'night700' | 'night800' | 'night900';
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
            condition: () => ['grass', 'sun', 'fire', 'cobalt', 'lavanda', 'fuchsia', 'white', 'night50', 'night200', 'night300', 'night400', 'night500', 'night700', 'night800', 'night900'].indexOf(props.color) !== -1,
        });
        return {
            color: props.color ?? 'sky',
        } as LinkButtonProps;
    },
);
