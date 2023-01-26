import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '../buttons';
import css from './PageButton.scss';

const defaultSize = '30';

export interface PageButtonMods {
    size?: '24' | '30';
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
