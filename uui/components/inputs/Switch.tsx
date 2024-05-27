import { withMods } from '@epam/uui-core';
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

/** Represents the properties of the Switch component. */
export type SwitchProps = uuiComponents.SwitchProps & SwitchMods;

function applySwitchMods(mods: SwitchProps) {
    return [
        css.root,
        `uui-size-${mods.size || settings.sizes.defaults.switch}`,
        'uui-color-primary',
    ];
}

export const Switch = withMods<uuiComponents.SwitchProps, SwitchMods>(uuiComponents.Switch, applySwitchMods);
