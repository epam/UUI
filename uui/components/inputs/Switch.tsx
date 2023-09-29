import { withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import css from './Switch.module.scss';

export interface SwitchMods {
    size?: '12' | '18' | '24';
}

export type SwitchProps = uuiComponents.SwitchProps & SwitchMods;

export function applySwitchMods(mods: SwitchProps) {
    return [
        'switch-vars', css.root, css['size-' + (mods.size || '18')],
    ];
}

export const Switch = withMods<uuiComponents.SwitchProps, SwitchMods>(uuiComponents.Switch, applySwitchMods);
