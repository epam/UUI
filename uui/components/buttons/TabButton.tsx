import { Button, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { getIcon, icons } from '../../icons';
import { getIconClass } from './helper';
import '../../assets/styles/variables/buttons/tabButton.scss';
import * as css from './TabButton.scss';
import { uuiComponentClass } from '../constant';

export interface TabButtonMods {
    size?: string;
    withNotify?: boolean;
}

function applyTabButtonMods(mods: TabButtonMods & ButtonProps) {
    return [
        uuiComponentClass.tabButton,
        'tab-button-vars',
        css.root,
        css['size-' + (mods.size || '48')],
        mods.withNotify && css.uuiNotification,
        ...getIconClass(mods),
    ];
}

export const TabButton = withMods<ButtonProps, TabButtonMods>(Button, applyTabButtonMods, props => ({
    dropdownIcon: getIcon('foldingArrow'),
    clearIcon: getIcon('clear'),
    countPosition: 'right',
    ...props,
    rawProps: { role: 'tab', ...props.rawProps },
}));