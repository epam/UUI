import { ScrollBars as uuiScrollBars, ScrollbarProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import './ScrollBars.scss';
import '../../assets/styles/variables/layout/scrollBars.scss';

function applyScrollBarsMods() {
    return [
        'scroll-bars-vars',
    ];
}

export const ScrollBars = withMods<ScrollbarProps>(uuiScrollBars, applyScrollBarsMods);