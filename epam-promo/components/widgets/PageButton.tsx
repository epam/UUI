import { Button, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ButtonColor } from '../buttons';
import * as types from '../types';
// import buttonCss from '../buttons/Button.scss';
import css from './PageButton.scss';
// import styles from '../../assets/styles/colorvars/buttons/button-colorvars.scss';

const defaultSize = '30';

export interface PageButtonMods {
    size?: '24' | '30';
    fill?: types.FillStyle;
    color?: ButtonColor;
}

export function applyPageButtonMods(mods: PageButtonMods & ButtonProps) {
    return [
        // styles['button-color-' + (mods.color || 'blue')],
        // buttonCss.root,
        // buttonCss['size-' + (mods.size || defaultSize)],
        // buttonCss['fill-' + (mods.fill || 'white')],
        css['fill-' + (mods.fill || 'white')],
        css['size-' + (mods.size || defaultSize)],
    ];
}

export const PageButton = withMods<ButtonProps, PageButtonMods>(
    Button,
    applyPageButtonMods,
);
