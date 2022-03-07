import css from './VerticalTabButton.scss';
import { ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { TabButton, TabButtonMods } from "./TabButton";

function applyVerticalTabButtonMods() {
    return [
        css.root,
    ];
}

export const VerticalTabButton = withMods<ButtonProps & TabButtonMods>(TabButton, applyVerticalTabButtonMods);