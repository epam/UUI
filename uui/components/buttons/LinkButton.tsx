import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';
import { getIconClass } from './helper';
import * as types from '../types';
import css from './LinkButton.scss';
import '../../assets/styles/variables/buttons/linkButton.scss';

const defaultSize = '36';

export interface LinkButtonMods {
    size?: types.ControlSize | '42';
}

function applyLinkButtonMods(mods: LinkButtonMods & ButtonProps) {
    return [
        'link-button-vars',
        css.root,
        css['size-' + (mods.size || defaultSize)],
        ...getIconClass(mods),
    ];
}

export const LinkButton = withMods<ButtonProps, LinkButtonMods>(Button, applyLinkButtonMods, (props) => ({
    dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
    clearIcon: systemIcons[props.size || defaultSize].clear,
}));
