import * as types from '../types';
import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import css from './LinkButton.scss';
import { systemIcons } from '../../icons/icons';
import { getIconClass } from './helper';

const defaultSize = '36';

export interface LinkButtonMods {
    size?: types.ControlSize | '42';
}

export type LinkButtonProps = LinkButtonMods & ButtonProps;

function applyLinkButtonMods(mods: LinkButtonProps) {
    return [
        css.root,
        css['size-' + (mods.size || defaultSize)],
        ...getIconClass(mods),
    ];
}

export const LinkButton = withMods<ButtonProps, LinkButtonMods>(Button, applyLinkButtonMods, (props) => ({
    dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
    clearIcon: systemIcons[props.size || defaultSize].clear,
}));
