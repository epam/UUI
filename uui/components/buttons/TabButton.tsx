import { Button, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { systemIcons } from '../../icons/icons';
import { getIconClass } from './helper';
import '../../assets/styles/variables/buttons/tabButton.scss';
import css from './TabButton.scss';

export interface TabButtonMods {
    size?: '36' | '48' | '60';
    withNotify?: boolean;
}

function applyTabButtonMods(mods: TabButtonMods & ButtonProps) {
    return [
        'tab-button-vars',
        css.root,
        css['size-' + (mods.size || '48')],
        mods.withNotify && css.uuiNotification,
        ...getIconClass(mods),
    ];
}

export const TabButton = withMods<ButtonProps, TabButtonMods>(Button, applyTabButtonMods, props => ({
    dropdownIcon: systemIcons['36'].foldingArrow,
    clearIcon: systemIcons['36'].clear,
    countPosition: 'right',
    ...props,
    rawProps: { role: 'tab', ...props.rawProps },
}));
