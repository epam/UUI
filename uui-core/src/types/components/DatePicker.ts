import { ReactNode } from 'react';
import { Dayjs } from 'dayjs';
import { Placement } from '@popperjs/core';
import {
    ICanBeReadonly, IDisableable, IHasForwardedRef, IDropdownToggler,
} from '../props';
import { CX } from '../objects';

/**
 * Represents CommonDatePickerProps
*/
export interface CommonDatePickerProps extends IDisableable,
    ICanBeReadonly,
    IHasForwardedRef<HTMLElement> {
    /**
     * HTML ID attribute for the toggler input
     */
    id?: string;

    /**
     * Date format string, see [dayjs docs](@link https://day.js.org/docs/en/display/format)
     */
    format?: string;

    /**
     * Filter selectable days. Days, for which this callback returns false - will be disabled
     */
    filter?(day: Dayjs): boolean;

    /**
     * Overrides rendering of picker Target - component which triggers dropdown. Can be used to attach DatePicker to other components, e.g. Buttons
     */
    renderTarget?(props: IDropdownToggler): ReactNode;

    /**
     * Disable clearing date value (e.g. via cross icon)
     */
    disableClear?: boolean;

    /**
     * Dropdown position relative to the input. See [Popper Docs](@link https://popper.js.org/)
     */
    placement?: Placement;

    /**
     * If this function returns true, the day will be highlighted as holiday
     */
    isHoliday?: (day: Dayjs) => boolean;

    /**
     * CSS class(es) to put on datepicker input
     */
    inputCx?: CX;

    /**
     * CSS class(es) to put on datepicker body
     */
    bodyCx?: CX;
}
