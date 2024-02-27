import { BaseRangeDatePickerProps, DatePickerCoreProps } from '@epam/uui-core';
import { IHasEditMode, SizeMod } from '../types';

/** Represents the properties of the DatePicker component. */
export interface DatePickerProps extends DatePickerCoreProps, SizeMod, IHasEditMode {
    /**
    * HTML ID attribute for the toggler input
    */
    id?: string;
}

export type InputType = 'from' | 'to';

export interface RangeDatePickerProps extends BaseRangeDatePickerProps, SizeMod {
    /**
     * A pure function that gets placeholder for 'from' or 'to' input.
     */
    getPlaceholder?(type: InputType): string;
    /**
    * HTML ID attribute for the first input into toggler
    */
    id?: string;
}
