import { ScrollBars as uuiScrollBars, ScrollbarProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './ScrollBars.module.scss';

function applyScrollBarsMods() {
    return [
        css.root, 'uui-scroll-bars', 'uui-shadow-top', 'uui-shadow-bottom',
    ];
}

export const ScrollBars = /* @__PURE__ */withMods<ScrollbarProps>(uuiScrollBars, applyScrollBarsMods);
