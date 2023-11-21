import { withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import css from './Switch.module.scss';

export interface SwitchMods {
    /**
     * @default '18'
     */
    size?: '12' | '18' | '24';
}

export type SwitchProps = uuiComponents.SwitchProps & SwitchMods;

export function applySwitchMods(mods: SwitchProps) {
    return [
        css.root, css['size-' + (mods.size || '18')], 'uui-color-primary',
    ];
}

export const Switch = withMods<uuiComponents.SwitchProps, SwitchMods>(uuiComponents.Switch, applySwitchMods);
