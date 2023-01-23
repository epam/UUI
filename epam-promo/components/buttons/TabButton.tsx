import { TabButton as UuiTabButton, TabButtonProps, TabButtonMods as UuiTabButtonMods } from '@epam/uui';
import { withMods } from '@epam/uui-core';

export interface TabButtonMods extends UuiTabButtonMods {}

function applyTabButtonMods(mods: TabButtonProps) {
    return [
        'uui-theme-promo',
    ];
}

export const TabButton = withMods<TabButtonProps, TabButtonMods>(UuiTabButton, applyTabButtonMods);
