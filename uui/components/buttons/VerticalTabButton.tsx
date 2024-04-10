import { withMods } from '@epam/uui-core';
import { TabButton, TabButtonProps } from './TabButton';
import css from './VerticalTabButton.module.scss';

function applyVerticalTabButtonMods() {
    return [css.root];
}

/** Represents the properties of a VerticalTabButton component. */
export type VerticalTabButtonProps = TabButtonProps;

export const VerticalTabButton = /* @__PURE__ */withMods<VerticalTabButtonProps>(TabButton, applyVerticalTabButtonMods);
