import * as types from '../types';
import * as css from './LinkButton.scss';
import * as styles from '../../assets/styles/scss/loveship-color-vars.scss';
import { withMods } from '@epam/uui';
import { Button, ButtonProps } from '@epam/uui-components';
import { TextSettings, getTextClasses } from '../../helpers/textLayout';
import { getIconClass } from './helper';
import { systemIcons } from '../icons/icons';

const defaultSize = '36';

export interface LinkButtonMods extends TextSettings {
    size?: types.ControlSize | '42';
    color?: types.EpamColor;
    font?: types.FontStyle;
}

function applyLinkButtonMods(mods: LinkButtonMods & ButtonProps) {
    return [
        css.root,
        css['size-' + (mods.size || defaultSize)],
        !mods.isDisabled && styles['color-' + (mods.color || 'sky')],
        css['font-' + (mods.font || 'sans-semibold')],
        ...getIconClass(mods),
    ];
}

export const LinkButton = withMods<ButtonProps, LinkButtonMods>(Button, applyLinkButtonMods, (props) => ({
    dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
    clearIcon: systemIcons[props.size || defaultSize].clear,
    captionCX: getTextClasses({
        size: props.size || defaultSize,
        lineHeight: props.lineHeight,
        fontSize: props.fontSize,
    }, false),
}));