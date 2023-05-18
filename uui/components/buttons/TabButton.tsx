import { Button, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { systemIcons } from '../../icons/icons';
import { getIconClass } from './helper';
import css from './TabButton.module.scss';

export interface TabButtonMods {
    size?: '36' | '48' | '60';
    withNotify?: boolean;
}

export type TabButtonProps = TabButtonMods & ButtonProps;

function applyTabButtonMods(mods: TabButtonProps) {
    return [
        css.root, 'informer-default', css['size-' + (mods.size || '48')], mods.withNotify && css.uuiNotification, ...getIconClass(mods),
    ];
}

export const TabButton = withMods<ButtonProps, TabButtonMods>(Button, applyTabButtonMods, (props) => ({
    dropdownIcon: systemIcons['36'].foldingArrow,
    clearIcon: systemIcons['36'].clear,
    countPosition: 'right',
    ...props,
    rawProps: { role: 'tab', ...props.rawProps },
}));
