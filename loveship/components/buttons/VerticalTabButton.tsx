import { withMods } from '@epam/uui-core';
import { VerticalTabButtonProps } from '@epam/uui';
import { TabButton, TabButtonMods } from './TabButton';
import css from './VerticalTabButton.module.scss';

function applyVerticalTabButtonMods() {
    return [css.root];
}

export const VerticalTabButton = withMods<VerticalTabButtonProps, TabButtonMods>(TabButton, applyVerticalTabButtonMods);
