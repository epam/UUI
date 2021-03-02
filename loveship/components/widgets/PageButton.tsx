import * as types from '../types';
import * as css from './PageButton.scss';
import { withMods } from '@epam/uui';
import { Button } from '../buttons';
import { ButtonProps } from '@epam/uui-components';

const defaultSize = '30';

export interface PageButtonMods extends types.ColorMod {
    size?: '24' | '30';
    fill?: types.FillStyle;
}

export function applyPageButtonMods(mods: PageButtonMods & ButtonProps) {
    return [
        css['fill-' + (mods.fill || 'white')],
        css['size-' + (mods.size || defaultSize)],
    ];
}

export const PageButton = withMods<ButtonProps, PageButtonMods>(
    Button,
    applyPageButtonMods,
);
