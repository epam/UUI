import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import css from './VerticalTabButton.module.scss';

function applyVerticalTabButtonMods() {
    return [css.root];
}

export const VerticalTabButton = createSkinComponent<uui.VerticalTabButtonProps, uui.TabButtonProps>(
    uui.TabButton,
    () => null,
    applyVerticalTabButtonMods,
);
