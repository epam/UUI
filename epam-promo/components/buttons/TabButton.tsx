import css from './TabButton.scss';
import styles from '../../assets/styles/colorvars/buttons/tabButton-colorvars.scss';
import { Button, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { systemIcons } from '../../icons/icons';
import { getIconClass } from './helper';

export interface TabButtonMods {
    /** Tab button size */
    size?: '36' | '48' | '60';

    /** Show notification red dot */
    withNotify?: boolean;
}

function applyTabButtonMods(mods: TabButtonMods & ButtonProps) {
    return [
        css.root,
        css['size-' + (mods.size || '48')],
        mods.withNotify && css.uuiNotification,
        styles.tabButtonColor,
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
