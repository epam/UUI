import css from './VerticalTabButton.scss';
import { withMods } from '@epam/uui-core';
import { ButtonProps } from '@epam/uui-components';
import { TabButton, TabButtonMods } from './TabButton';
import { uuiComponentClass } from '../constant';

function applyVerticalTabButtonMods() {
    return [
        uuiComponentClass.verticalTabButton,
        css.root,
    ];
}

export const VerticalTabButton = withMods<ButtonProps & TabButtonMods>(TabButton, applyVerticalTabButtonMods);