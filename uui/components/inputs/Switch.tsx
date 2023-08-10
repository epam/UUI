import { withMods } from '@epam/uui-core';
import { Switch as uuiSwitch, SwitchProps } from '@epam/uui-components';
import css from './Switch.module.scss';

export interface SwitchMods {
    size?: '12' | '18' | '24';
}

export function applySwitchMods(mods: SwitchMods & SwitchProps) {
    return [
        css.root, css['size-' + (mods.size || '18')], 'uui-color-primary',
    ];
}

export const Switch = withMods<SwitchProps, SwitchMods>(uuiSwitch, applySwitchMods);
