import { devLogger, withMods } from '@epam/uui-core';
import { LinkButton as UuiLinkButton, LinkButtonProps as UuiLinkButtonProps } from '@epam/uui';

export type LinkButtonColorType = 'sky' | 'grass' | 'sun' | 'fire' | 'cobalt' | 'lavanda' | 'fuchsia' | 'white' | 'night50' | 'night100' | 'night200' | 'night300' | 'night400' | 'night500' | 'night600' | 'night700' | 'night800' | 'night900';
export const allLinkButtonColors: LinkButtonColorType[] = ['sky', 'grass', 'sun', 'fire', 'cobalt', 'lavanda', 'fuchsia', 'white', 'night50', 'night100', 'night200', 'night300', 'night400', 'night500', 'night600', 'night700', 'night800', 'night900'];

export interface LinkButtonMods {
    color?: LinkButtonColorType;
}

export type LinkButtonProps = Omit<UuiLinkButtonProps, 'color'> & LinkButtonMods;

export const LinkButton = withMods<Omit<UuiLinkButtonProps, 'color'>, LinkButtonMods>(
    UuiLinkButton,
    () => [],
    (props) => {
        const isWarn = ['grass', 'sun', 'fire', 'cobalt', 'lavanda', 'fuchsia', 'white', 'night50', 'night200', 'night300', 'night400', 'night500', 'night700', 'night800', 'night900'].includes(props.color);
        isWarn && devLogger.warn('LinkButton: color properties \'grass\', \'sun\', \'fire\', \'cobalt\', \'lavanda\', \'fuchsia\', \'white\', \'night50\', \'night200\', \'night300\', \'night400\', \'night500\', \'night700\', \'night800\', \'night900\' are deprecated and will be removed in future release. Please use "sky", "night100" or "night600", instead.');
        return {
            color: props.color ?? 'sky',
        } as LinkButtonProps;
    },
);
