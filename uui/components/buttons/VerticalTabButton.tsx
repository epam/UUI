import { withMods } from '@epam/uui-core';
import { TabButton, TabButtonProps } from './TabButton';
import css from './VerticalTabButton.module.scss';

function applyVerticalTabButtonMods() {
    return [css.root];
}

export type VerticalTabButtonProps = TabButtonProps;

export const VerticalTabButton = withMods<VerticalTabButtonProps>(TabButton, applyVerticalTabButtonMods);
