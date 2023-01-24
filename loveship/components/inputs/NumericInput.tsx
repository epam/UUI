import { NumericInput as UuiNumericInput, NumericInputMods as UuiNumericInputMods, NumericInputProps as UuiNumericInputProps } from "@epam/uui";
import { withMods } from "@epam/uui-core";

export interface NumericInputMods extends UuiNumericInputMods {}

export function applyNumericInputMods() {
    return [
        'uui-theme-loveship',
    ];
}

export const NumericInput = withMods<UuiNumericInputProps, NumericInputMods>(
    UuiNumericInput,
    applyNumericInputMods,
);
