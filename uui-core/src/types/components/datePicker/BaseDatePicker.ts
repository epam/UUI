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

    iconPosition?: 'left' | 'right';

    /** Disable clearing date value (e.g. via cross icon) */
    disableClear?: boolean;

    /** Overrides rendering of the single day. For example, to highlight certain days */
    renderDay?: (day: Dayjs, onDayClick: (day: Dayjs) => void) => ReactElement<Element>;

    /** If this function returns true, the day will be highlighted as holiday */
    isHoliday?: (day: Dayjs) => boolean;
    onBlur?: (e?: React.FocusEvent<HTMLInputElement>) => void;

    /** Dropdown position relative to the input. See [Popper Docs](@link https://popper.js.org/) */
    placement?: Placement;

    /** Attributes for HTML Element */
    rawProps?: {
        input?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        body?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    };

    /** Styles for input and body components in DatePicker */
    inputCx?: CX;
    bodyCx?: CX;
}
