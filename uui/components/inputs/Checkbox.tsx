import { Overwrite, withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { ReactComponent as Check } from '@epam/assets/icons/notification-done-outline.svg';
import { ReactComponent as PartlySelect } from '@epam/assets/icons/content-minus-outline.svg';
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
export type CheckboxProps = uuiComponents.CheckboxProps & Overwrite<CheckboxMods, CheckboxModsOverride>;

function applyCheckboxMods(mods: CheckboxMods) {
    return [
        css.root,
        css['size-' + (mods.size || '18')],
        css['mode-' + (mods.mode || 'form')],
        'uui-color-primary',
    ];
}

const applyUUICheckboxProps = (props: CheckboxProps) => {
    const defaultIcon = Check;
    const defaultIndeterminateIcon = PartlySelect;
    return {
        icon: props.icon ? props.icon : defaultIcon,
        indeterminateIcon: props.indeterminateIcon ? props.indeterminateIcon : defaultIndeterminateIcon,
    };
};

export const Checkbox = withMods<uuiComponents.CheckboxProps, CheckboxProps>(
    uuiComponents.Checkbox,
    applyCheckboxMods,
    applyUUICheckboxProps,
);
