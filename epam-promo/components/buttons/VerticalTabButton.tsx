import { withMods } from '@epam/uui-core';
import { VerticalTabButton as UuiVerticalTabButton, VerticalTabButtonProps } from "@epam/uui";

function applyVerticalTabButtonMods() {
    return [
        'uui-theme-promo',
    ];
}

export const VerticalTabButton = withMods<VerticalTabButtonProps>(UuiVerticalTabButton, applyVerticalTabButtonMods);
