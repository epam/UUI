import * as types from '../types';
import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import css from './LinkButton.module.scss';
import { systemIcons } from '../../icons/icons';
import { getIconClass } from './helper';

const defaultSize = '36';
export type LinkButtonColorType = 'primary' | 'secondary' | 'contrast';
export const allLinkButtonColors: LinkButtonColorType[] = ['primary', 'secondary', 'contrast'];

export interface LinkButtonMods {
    size?: types.ControlSize | '42';
    color?: LinkButtonColorType;
}

export type LinkButtonProps = LinkButtonMods & ButtonProps;

function applyLinkButtonMods(mods: LinkButtonProps) {
    return [
        'uui-link_button',
        css.root,
        css['size-' + (mods.size || defaultSize)],
        ...getIconClass(mods),
        `color-${mods.color || 'primary'}`,
    ];
}

export const LinkButton = withMods<ButtonProps, LinkButtonMods>(Button, applyLinkButtonMods, (props) => ({
    dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
    clearIcon: systemIcons[props.size || defaultSize].clear,
}));
