import { withMods } from '@epam/uui-core';
import { TabButton, TabButtonProps } from './TabButton';
import css from './VerticalTabButton.module.scss';

function applyVerticalTabButtonMods() {
    return [css.root, 'uui-vertical-tab-button'];
}

/** Represents the properties of a VerticalTabButton component. */
export type VerticalTabButtonProps = TabButtonProps;

export const VerticalTabButton = withMods<VerticalTabButtonProps, VerticalTabButtonProps>(TabButton, applyVerticalTabButtonMods);
