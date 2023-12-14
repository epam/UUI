import * as types from '../types';
import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import css from './LinkButton.module.scss';
import { systemIcons } from '../../icons/icons';
import { getIconClass } from './helper';

const DEFAULT_SIZE = '36';

interface LinkButtonMods {
    /**
     * Defines component size.
     * @default '36'
     */
    size?: types.ControlSize | '42';
    /**
     * Defines component color.
     * @default 'primary'
     */
    color?: 'primary' | 'secondary' | 'contrast';
}

/** Represents the Core properties of the LinkButton component. */
export type LinkButtonCoreProps = ButtonProps & {
    size?: types.ControlSize | '42';
};

/** Represents the properties of the LinkButton component. */
export type LinkButtonProps = LinkButtonCoreProps & LinkButtonMods;

function applyLinkButtonMods(mods: LinkButtonProps) {
    return [
        'uui-link_button',
        css.root,
        `uui-size-${mods.size || DEFAULT_SIZE}`,
        ...getIconClass(mods),
        `uui-color-${mods.color || 'primary'}`,
    ];
}

export const LinkButton = withMods<LinkButtonCoreProps, LinkButtonMods>(
    Button,
    applyLinkButtonMods,
    (props) => ({
        dropdownIcon: systemIcons[props.size || DEFAULT_SIZE].foldingArrow,
        clearIcon: systemIcons[props.size || DEFAULT_SIZE].clear,
    }),
);
