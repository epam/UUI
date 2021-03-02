import { ScrollBars as uuiScrollBars, ScrollbarProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import * as css from './ScrollBars.scss';

export interface ScrollBarsMods {
    theme?: 'light' | 'dark';
}

function applyScrollBarsMods(mods: ScrollBarsMods) {
    return [
        css.root,
        css['theme-' + (mods.theme || 'light')],
    ];
}

export const ScrollBars = withMods<ScrollbarProps, ScrollBarsMods>(uuiScrollBars, applyScrollBarsMods);
