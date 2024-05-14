import { withMods } from '@epam/uui-core';
import { NumericInput as uuiNumericInput, NumericInputProps as uuiNumericInputProps } from '@epam/uui-components';
import { EditMode, IHasEditMode } from '../types';
import { systemIcons } from '../../icons/icons';
import textInputCss from './TextInput.module.scss';
import css from './NumericInput.module.scss';

const DEFAULT_SIZE = '36';
const DEFAULT_MODE = EditMode.FORM;

type NumericInputMods = IHasEditMode & {
    /**
     * Defines component size
     * @default '36'
     */
    size?: '24' | '30' | '36' | '42';
};

function applyNumericInputMods(mods: NumericInputMods) {
    return [
        textInputCss.root,
        css.root,
        css['size-' + (mods.size || DEFAULT_SIZE)],
        textInputCss['size-' + (mods.size || DEFAULT_SIZE)],
        textInputCss['mode-' + (mods.mode || DEFAULT_MODE)],
    ];
}

/** Represents the properties of a NumericInput component. */
export type NumericInputProps = uuiNumericInputProps & NumericInputMods;

export const NumericInput = withMods<uuiNumericInputProps, NumericInputMods>(
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
