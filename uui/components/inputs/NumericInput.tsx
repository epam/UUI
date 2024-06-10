import { withMods, Overwrite } from '@epam/uui-core';
import { NumericInput as uuiNumericInput, NumericInputProps as uuiNumericInputProps } from '@epam/uui-components';
import { EditMode, IHasEditMode } from '../types';
import { systemIcons } from '../../icons/icons';
import textInputCss from './TextInput.module.scss';
import { settings } from '../../settings';
import css from './NumericInput.module.scss';

const DEFAULT_MODE = EditMode.FORM;

type NumericInputMods = IHasEditMode & {
    /**
     * Defines component size
     * @default '36'
     */
    size?: '24' | '30' | '36' | '42' | '48';
};

export interface NumericInputModsOverride {}

function applyNumericInputMods(mods: NumericInputMods) {
    return [
        textInputCss.root,
        css.root,
        `uui-size-${mods.size || settings.sizes.defaults.numericInput}`,
        textInputCss['mode-' + (mods.mode || DEFAULT_MODE)],
    ];
}

/** Represents the properties of a NumericInput component. */
export type NumericInputProps = uuiNumericInputProps & Overwrite<NumericInputMods, NumericInputModsOverride>;

export const NumericInput = withMods<uuiNumericInputProps, NumericInputProps>(
    uuiNumericInput,
    applyNumericInputMods,
    (props) => {
        return {
            upIcon: systemIcons.foldingArrow,
            downIcon: systemIcons.foldingArrow,
            align: props.align ?? (props.mode === 'cell' ? 'right' : 'left'),
            disableArrows: props.disableArrows ?? props.mode === 'cell',
        };
    },
);
