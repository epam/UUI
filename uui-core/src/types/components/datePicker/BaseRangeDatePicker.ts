import { ReactElement, ReactNode } from 'react';
import { Dayjs } from 'dayjs';
import { Placement } from '@popperjs/core';
import { IAnalyticableOnChange, ICanBeReadonly, IDisableable, IDropdownToggler, IEditable, IHasCX } from '../../props';

export interface RangeDatePickerValue {
    from: string | null;
    to: string | null;
}

export type RangeDatePickerPresets = {
    [key: string]: {
        name: string;
        getRange: () => RangeDatePickerPresetValue;
    };
};

export type RangeDatePickerPresetValue = {
    from: string;
    to: string;
    order?: number;
};

export interface BaseRangeDatePickerProps
    extends IEditable<RangeDatePickerValue>,
        IHasCX,
        IDisableable,
        ICanBeReadonly,
        IAnalyticableOnChange<RangeDatePickerValue> {
    /** Date format string, see [dayjs docs](@link https://day.js.org/docs/en/display/format) */
    format?: string;

    /** Filter selectable days. Days, for which this callback returns false - will be disabled */
    filter?(day: Dayjs): boolean;

    /** Overrides rendering of picker Target - component which triggers dropdown. Can be used to attach RangeDatePicker to other components, e.g. Buttons */
    renderTarget?(props: IDropdownToggler): ReactNode;

    /** Allows to add a custom footer to the Picker's dropdown body */
    renderFooter?(value: RangeDatePickerValue): ReactNode;

    /** Overrides rendering of the single day. For example, to highlight certain days */
    renderDay?: (day: Dayjs, onDayClick: (day: Dayjs) => void) => ReactElement<Element>;

    /**
     * Range presets (like 'this week', 'this month', etc.) to display at the right of the Picker's body.
     * UUI provides defaults in the 'rangeDatePickerPresets' exported variable - you can use it as is, or build on top of it (e.g. add your presets)
     */
    presets?: RangeDatePickerPresets;

    /** Disables clearing component (with the cross icon) */
    disableClear?: boolean;

    /** Dropdown position relative to the input. See [Popper Docs](@link https://popper.js.org/) */
    placement?: Placement;

    /** If this function returns true, the day will be highlighted as holiday */
    isHoliday?: (day: Dayjs) => boolean;

    /** Called when component gets input focus */
    onFocus?: (e: React.FocusEvent<HTMLInputElement>, inputType: 'from' | 'to') => void;

    /** Called when component looses input focus */
    onBlur?: (e: React.FocusEvent<HTMLInputElement>, inputType: 'from' | 'to') => void;
}
