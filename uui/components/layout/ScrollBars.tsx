import { ScrollBars as uuiScrollBars, ScrollbarProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './ScrollBars.module.scss';

function applyScrollBarsMods() {
    return [
        css.root, 'uui-scroll-bars',
    ];
}

export const ScrollBars = withMods<ScrollbarProps, ScrollbarProps>(uuiScrollBars, applyScrollBarsMods);
