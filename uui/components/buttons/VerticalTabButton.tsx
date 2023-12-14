import css from './VerticalTabButton.module.scss';
import { withMods } from '@epam/uui-core';
import { ButtonProps } from '@epam/uui-components';
import { TabButton, TabButtonMods } from './TabButton';

function applyVerticalTabButtonMods() {
    return [css.root];
}

/** Represents the properties of a VerticalTabButton component. */
export type VerticalTabButtonProps = ButtonProps & TabButtonMods;

export const VerticalTabButton = withMods<VerticalTabButtonProps>(TabButton, applyVerticalTabButtonMods);
