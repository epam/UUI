import { withMods } from '@epam/uui';
import { Switch as uuiSwitch, SwitchProps } from '@epam/uui-components';
import * as css from './Switch.scss';
import '../../assets/styles/colorvars/inputs/switch-colorvars.scss';

export interface SwitchMods {
    size?: '12' | '18' | '24';
}

export function applySwitchMods(mods: SwitchMods & SwitchProps) {
    return [
        'switch-colors',
        css.root,
        css['size-' + (mods.size || '18')],
    ];
}

export const Switch = withMods<SwitchProps, SwitchMods>(uuiSwitch, applySwitchMods);
