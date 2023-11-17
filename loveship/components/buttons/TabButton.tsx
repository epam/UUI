import css from './TabButton.module.scss';
import { TabButton as UuiTabButton, TabButtonProps as UuiTabButtonProps } from '@epam/uui';
import { withMods } from '@epam/uui-core';

export type TabButtonMods = UuiTabButtonProps & {
    theme?: 'light' | 'dark';
};
function applyTabButtonMods(mods: TabButtonMods & UuiTabButtonProps) {
    return [mods.theme === 'dark' && css.themeDark];
}

export const TabButton = withMods<UuiTabButtonProps, TabButtonMods>(UuiTabButton, applyTabButtonMods);
