import css from './TabButton.module.scss';
import * as uui from '@epam/uui';
import { withMods } from '@epam/uui-core';

export type TabButtonMods = uui.TabButtonProps & {
    theme?: 'light' | 'dark';
};

function applyTabButtonMods(mods: TabButtonMods & uui.TabButtonProps) {
    return [mods.theme === 'dark' && css.themeDark];
}

export type TabButtonProps = uui.TabButtonProps & TabButtonMods;

export const TabButton = withMods<uui.TabButtonProps, TabButtonMods>(uui.TabButton, applyTabButtonMods);
