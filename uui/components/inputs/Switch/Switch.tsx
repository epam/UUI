import { withMods } from '@epam/uui-core';
import { Switch as uuiSwitch, SwitchProps } from '@epam/uui-components';
import * as css from './Switch.scss';
import './Switch.colorvars.scss';

export interface SwitchMods {
    size?: string;
}

export function applySwitchMods(mods: SwitchMods & SwitchProps) {
    return [
        'switch-vars',
        css.root,
        mods.size && `size-${ mods.size }`,
    ];
}

export const Switch = withMods<SwitchProps, SwitchMods>(uuiSwitch, applySwitchMods);
