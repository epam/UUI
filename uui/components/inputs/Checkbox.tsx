import { withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { ReactComponent as Check } from '../../icons/check-18.svg';
import { ReactComponent as PartlySelect } from '../../icons/partly-select-18.svg';
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

/** Represents the properties of the Checkbox component. */
export type CheckboxProps = CheckboxMods & uuiComponents.CheckboxProps;

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

export const Checkbox = withMods<uuiComponents.CheckboxProps, CheckboxMods>(uuiComponents.Checkbox, applyCheckboxMods, applyUUICheckboxProps);
