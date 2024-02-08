import { BaseRangeDatePickerProps } from '@epam/uui-core';
import { SizeMod } from '../types';

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
