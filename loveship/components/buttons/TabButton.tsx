import * as css from './TabButton.scss';
import { Button, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import { systemIcons } from '../icons/icons';
import { getIconClass } from './helper';

export interface TabButtonMods {
    size?: '36' | '48' | '60';
    theme?: 'light' | 'dark';
    withNotify?: boolean;
}

function applyTabButtonMods(mods: TabButtonMods & ButtonProps) {
    return [
        css.root,
        css['size-' + (mods.size || '48')],
        mods.withNotify && css.uuiNotification,
        css['theme-' + (mods.theme || 'light')],
        ...getIconClass(mods),
    ];
}

export const TabButton = withMods<ButtonProps, TabButtonMods>(Button, applyTabButtonMods, () => ({
    dropdownIcon: systemIcons['36'].foldingArrow,
    clearIcon: systemIcons['36'].clear,
    countPosition: 'right',
}));