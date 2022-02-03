import { ScrollBars as uuiScrollBars, ScrollbarProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import * as css from './ScrollBars.scss';
import '../../assets/styles/variables/layout/scrollBars.scss';

function applyScrollBarsMods() {
    return [
        'scroll-bars-vars',
        css.root,
    ];
}

export const ScrollBars = withMods<ScrollbarProps>(uuiScrollBars, applyScrollBarsMods);