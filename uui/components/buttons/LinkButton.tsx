import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { getIcon, icons } from '../../icons';
import { getIconClass } from './helper';
import * as css from './LinkButton.scss';
import '../../assets/styles/variables/buttons/linkButton.scss';
import { uuiComponentClass } from '../constant';

const defaultSize = '36';

export interface LinkButtonMods {
    size?: string;
}

function applyLinkButtonMods(mods: LinkButtonMods & ButtonProps) {
    return [
        uuiComponentClass.linkButton,
        'link-button-vars',
        css.root,
        css['size-' + (mods.size || defaultSize)],
        ...getIconClass(mods),
    ];
}

export const LinkButton = withMods<ButtonProps, LinkButtonMods>(Button, applyLinkButtonMods, (props) => ({
    dropdownIcon: getIcon('foldingArrow'),
    clearIcon: getIcon('clear'),
}));