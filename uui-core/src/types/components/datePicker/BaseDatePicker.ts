import React, { ReactElement, ReactNode } from 'react';
import { Dayjs } from 'dayjs';
import { Placement } from '@popperjs/core';
import {
    IAnalyticableOnChange, ICanBeReadonly, ICanFocus, IDisableable, IEditable, IHasPlaceholder, IHasRawProps,
    IDropdownToggler,
} from '../../props';
import { CX } from '../../objects';

export interface BaseDatePickerProps
    extends IEditable<string | null>,
    ICanFocus<HTMLInputElement>,
    IDisableable,
    IHasPlaceholder,
    ICanBeReadonly,
    IAnalyticableOnChange<string> {
    /** Date format string, see [dayjs docs](@link https://day.js.org/docs/en/display/format) */
    format?: string;

    /** Filter selectable days. Days, for which this callback returns false - will be disabled */
    filter?(day: Dayjs): boolean;

    /** Overrides rendering of picker Target - component which triggers dropdown. Can be used to attach DatePicker to other components, e.g. Buttons */
    renderTarget?(props: IDropdownToggler): ReactNode;

    /** Defines where to place calendar icon */
    iconPosition?: 'left' | 'right';

    /**
     * Disable clearing date value (e.g. via cross icon)
     * @default false
     */
    disableClear?: boolean;

    /** Overrides rendering of the single day. For example, to highlight certain days */
    renderDay?: (day: Dayjs, onDayClick: (day: Dayjs) => void) => ReactElement<Element>;

    /** If this function returns true, the day will be highlighted as holiday */
    isHoliday?: (day: Dayjs) => boolean;

    /** Called when component lose focus */
    onBlur?: (e?: React.FocusEvent<HTMLInputElement>) => void;

    /** Dropdown position relative to the input. See [Popper Docs](@link https://popper.js.org/) */
    placement?: Placement;

    /** Any HTML attributes (native or 'data-') to put on date picker parts */
    rawProps?: {
        /** Any HTML attributes (native or 'data-') to put on date picker input */
        input?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        /** Any HTML attributes (native or 'data-') to put on date picker body */
        body?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    };

    /** CSS class(es) to put on datepicker input */
    inputCx?: CX;
    /** CSS class(es) to put on datepicker body */
    bodyCx?: CX;
}
