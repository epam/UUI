import { ScrollBars as uuiScrollBars, ScrollbarProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import './ScrollBars.module.scss';

function applyScrollBarsMods() {
    return [
        'uui-scroll-bars', 'uui-shadow-top', 'uui-shadow-bottom',
    ];
}

export const ScrollBars = withMods<ScrollbarProps>(uuiScrollBars, applyScrollBarsMods);
