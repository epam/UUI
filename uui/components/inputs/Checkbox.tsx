import { Overwrite, withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { settings } from '../../settings';

import css from './Checkbox.module.scss';

interface CheckboxMods {
    /**
     * Defines component size.
     * @default '18'
     */
    size?: '12' | '18';
    /**
     * Defines the different edit modes.
     * @default 'form'
     */
    mode?: 'form' | 'cell';
}

export interface CheckboxModsOverride {}

/** Represents the properties of the Checkbox component. */
export interface CheckboxProps extends uuiComponents.CheckboxProps, Overwrite<CheckboxMods, CheckboxModsOverride> {}

function applyCheckboxMods(mods: CheckboxMods) {
    return [
        css.root,
        `uui-size-${mods.size || settings.checkbox.sizes.default}`,
        'uui-control-mode-' + (mods.mode || 'form'),
        'uui-color-primary',
    ];
}

const applyUUICheckboxProps = (props: CheckboxProps) => {
    return {
        icon: props.icon ? props.icon : settings.checkbox.icons.checkIcon,
        indeterminateIcon: props.indeterminateIcon ? props.indeterminateIcon : settings.checkbox.icons.indeterminateIcon,
    };
};

export const Checkbox = withMods<uuiComponents.CheckboxProps, CheckboxProps>(
    uuiComponents.Checkbox,
    applyCheckboxMods,
    applyUUICheckboxProps,
);
