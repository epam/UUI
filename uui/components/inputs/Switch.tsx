import { withMods } from '@epam/uui-core';
import { Switch as uuiSwitch, SwitchProps } from '@epam/uui-components';
import css from './Switch.scss';

export interface SwitchMods {
    size?: '12' | '18' | '24';
}

export function applySwitchMods(mods: SwitchMods & SwitchProps) {
    return [
        'switch-vars', css.root, css['size-' + (mods.size || '18')],
    ];
}

export const Switch = withMods<SwitchProps, SwitchMods>(uuiSwitch, applySwitchMods);
