import { withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
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
        css.root, css['size-' + (mods.size || '18')], 'uui-color-primary',
    ];
}

export const Switch = /* @__PURE__ */withMods<uuiComponents.SwitchProps, SwitchMods>(uuiComponents.Switch, applySwitchMods);
