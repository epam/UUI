import React, { ReactElement, ReactNode } from 'react';
import { Dayjs } from 'dayjs';
import { Placement } from '@popperjs/core';
import {
    IAnalyticableOnChange, ICanBeReadonly, ICanFocus, IDisableable, IEditable, IHasForwardedRef, IHasPlaceholder, IHasRawProps,
    IDropdownToggler,
} from '../../props';
import { CX } from '../../objects';
import { DayProps } from './Day';

export interface CommonDatePickerProps extends IDisableable,
    ICanBeReadonly,
    IHasForwardedRef<HTMLElement> {
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
     * Overrides rendering of the single day. For example, to highlight certain days
     */
    renderDay?: (renderProps: DayProps) => ReactElement<Element>;

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

export interface BaseDatePickerProps
    extends
    ICanFocus<HTMLInputElement>,
    IEditable<string | null>,
    IAnalyticableOnChange<string>,
    IHasPlaceholder,
    CommonDatePickerProps {

    /** Called when component lose focus */
    onBlur?: (e?: React.FocusEvent<HTMLInputElement>) => void;

    /**
     * Defines where to place calendar icon
     */
    iconPosition?: 'left' | 'right';

    /**
     * Any HTML attributes (native or 'data-') to put on date picker parts
     */
    rawProps?: {
        /**
         * Any HTML attributes (native or 'data-') to put on date picker input
         */
        input?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        /**
         * Any HTML attributes (native or 'data-') to put on date picker body
         */
        body?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    };

}
