import { devLogger, withMods } from '@epam/uui-core';
import { NumericInput as uuiNumericInput, NumericInputProps as uuiNumericInputProps } from '@epam/uui-components';
import { ControlSize, EditMode, IHasEditMode } from '../types';
import { systemIcons } from '../../icons/icons';
import textInputCss from './TextInput.module.scss';
import css from './NumericInput.module.scss';

const defaultSize = '36';
const defaultMode = EditMode.FORM;

export type NumericInputMods = IHasEditMode & {
    /**
     * @default '36'.
     * Size '48' is deprecated and will be removed in future release
     * */
    size?: ControlSize;
};

export function applyNumericInputMods(mods: NumericInputMods) {
    return [
        textInputCss.root,
        css.root,
        css['size-' + (mods.size || defaultSize)],
        textInputCss['size-' + (mods.size || defaultSize)],
        textInputCss['mode-' + (mods.mode || defaultMode)],
    ];
}

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
            upIcon: systemIcons[props.size || defaultSize].foldingArrow,
            downIcon: systemIcons[props.size || defaultSize].foldingArrow,
            align: props.align ?? (props.mode === 'cell' ? 'right' : 'left'),
            disableArrows: props.disableArrows ?? props.mode === 'cell',
        };
    },
);
