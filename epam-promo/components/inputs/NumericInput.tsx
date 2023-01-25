import { withMods } from "@epam/uui-core";
import { NumericInputMods as UuiNumericInputMods, NumericInput as UuiNumericInput, NumericInputProps as UuiNumericInputProps } from "@epam/uui";

export interface NumericInputMods extends UuiNumericInputMods {}

export function applyNumericInputMods() {
    return [
        'uui-theme-promo',
    ];
}

export const NumericInput = withMods<UuiNumericInputProps, NumericInputMods>(
    UuiNumericInput,
    applyNumericInputMods,
);
