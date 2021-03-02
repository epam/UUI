import * as types from '../types';
import * as css from './LinkButton.scss';
import * as styles from '../../assets/styles/colorvars/buttons/linkButton-colorvars.scss';
import { withMods } from '@epam/uui';
import { Button, ButtonProps } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';
import { getIconClass } from './helper';

const defaultSize = '36';

export interface LinkButtonMods {
    size?: types.ControlSize | '42';
    color?: types.EpamPrimaryColor;
}

function applyLinkButtonMods(mods: LinkButtonMods & ButtonProps) {
    return [
        css.root,
        css['size-' + (mods.size || defaultSize)],
        styles['linkButton-color-' + (mods.color || 'blue')],
        ...getIconClass(mods),
    ];
}

export const LinkButton = withMods<ButtonProps, LinkButtonMods>(Button, applyLinkButtonMods, (props) => ({
    dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
    clearIcon: systemIcons[props.size || defaultSize].clear,
}));