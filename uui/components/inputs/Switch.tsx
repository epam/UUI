import { Overwrite, withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { settings } from '../../settings';

import css from './Switch.module.scss';

interface SwitchMods {
    /**
     * Defines component size.
     * @default '18'
     */
    size?: '12' | '18' | '24';
}

export interface SwitchModsOverride {}

/** Represents the properties of the Switch component. */
export interface SwitchProps extends uuiComponents.SwitchProps, Overwrite<SwitchMods, SwitchModsOverride> {}

function applySwitchMods(mods: SwitchProps) {
    return [
        css.root,
        `uui-size-${mods.size || settings.switch.sizes.default}`,
        'uui-color-primary',
    ];
}

export const Switch = withMods<uuiComponents.SwitchProps, SwitchProps>(uuiComponents.Switch, applySwitchMods);
