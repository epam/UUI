import css from './TabButton.module.scss';
import * as uui from '@epam/uui';
import { withMods } from '@epam/uui-core';

export interface TabButtonMods extends uui.TabButtonProps {
    theme?: 'light' | 'dark';
}

function applyTabButtonMods(mods: TabButtonMods & uui.TabButtonProps) {
    return [mods.theme === 'dark' && css.themeDark];
}

export interface TabButtonProps extends uui.TabButtonProps, TabButtonMods {}

export const TabButton = withMods<uui.TabButtonProps, TabButtonMods>(uui.TabButton, applyTabButtonMods);
