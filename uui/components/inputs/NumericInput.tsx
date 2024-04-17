import { devLogger, withMods } from '@epam/uui-core';
import { NumericInput as uuiNumericInput, NumericInputProps as uuiNumericInputProps } from '@epam/uui-components';
import { ControlSize, EditMode, IHasEditMode } from '../types';
import { systemIcons } from '../../icons/icons';
import textInputCss from './TextInput.module.scss';
import css from './NumericInput.module.scss';

const DEFAULT_SIZE = '36';
const DEFAULT_MODE = EditMode.FORM;

type NumericInputMods = IHasEditMode & {
    /**
     * Defines component size
     * @default '36'
     * Size '48' is deprecated and will be removed in future release
     */
    size?: ControlSize;
};

function applyNumericInputMods(mods: NumericInputMods) {
    return [
        textInputCss.root,
        css.root,
        `uui-size-${mods.size || DEFAULT_SIZE}`,
        textInputCss['mode-' + (mods.mode || DEFAULT_MODE)],
    ];
}

/** Represents the properties of a NumericInput component. */
export type NumericInputProps = uuiNumericInputProps & NumericInputMods;

export const NumericInput = withMods<uuiNumericInputProps, NumericInputMods>(
    uuiNumericInput,
    applyNumericInputMods,
    (props) => {
        if (__DEV__) {
            devLogger.warnAboutDeprecatedPropValue<NumericInputProps, 'size'>({
                component: 'NumericInput',
                propName: 'size',
                propValue: '48',
                propValueUseInstead: '42',
                condition: () => props.size === '48',
            });
        }
        return {
            upIcon: systemIcons.foldingArrow,
            downIcon: systemIcons.foldingArrow,
            align: props.align ?? (props.mode === 'cell' ? 'right' : 'left'),
            disableArrows: props.disableArrows ?? props.mode === 'cell',
        };
    },
);
