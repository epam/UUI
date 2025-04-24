import React, { ReactElement, ReactNode } from 'react';
import { Placement } from '@floating-ui/react';
import type {
    IAnalyticableOnChange, IHasForwardedRef, IHasCX, ICanFocus, IHasPlaceholder,
    ICanBeReadonly, IDisableable, IDropdownTogglerProps, IEditable, IHasRawProps,
} from '../props';
import { CX } from '../objects';
import { Dayjs } from '../../helpers/dayJsHelper';

/**
 * Represents CommonDatePickerProps
*/
export interface CommonDatePickerProps extends IDisableable,
    ICanBeReadonly {
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
    renderTarget?(props: IDropdownTogglerProps): ReactNode;

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

/**
 * Represents the properties of the DatePicker component
 */
export interface DatePickerProps extends
    CommonDatePickerProps,
    ICanFocus<HTMLInputElement>,
    IEditable<string | null>,
    IAnalyticableOnChange<string>,
    IHasPlaceholder {
    /**
     * Defines where to place calendar icon
     */
    iconPosition?: 'left' | 'right';

    /**
     * Render prop to add a custom footer inside the DatePicker dropdown body
     */
    renderFooter?(): ReactNode;

    /**
     * Overrides rendering of the single day. For example, to highlight certain days
     */
    renderDay?: (renderProps: DayProps) => ReactElement<Element>;

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
    /**
     * Pass true to prevent component from being empty.
     * It's disable clear cross-icon and return last selected value if input was cleared
    */
    preventEmpty?: boolean;
}

export type RangeDatePickerPresets = {
    /**
     * Preset config
     */
    [key: string]: {
        /**
         * Name of the preset to display in rangeDatePicker body
         */
        name: ReactNode;
        /**
         * A pure function that gets range value which will be applied by preset selection
         */
        getRange: () => RangeDatePickerPresetValue;
    };
};

/**
 * Represents RangeDatePickerPresetValue
 */
export interface RangeDatePickerPresetValue {
    /**
     * Range from value
     */
    from?: string;
    /**
     * Range to value
     */
    to?: string;
    /**
     * Preset order in presets list
     */
    order?: number;
}

/**
 * Represents RangeDatePicker input type
 */
export type RangeDatePickerInputType = 'from' | 'to' | null;

/**
 * Represents RangeDatePicker value
 */
export type RangeDatePickerValue = {
    /**
     * Defines DatePicker value 'from'.
     */
    from: string | null;
    /**
     * Defines DatePicker value 'to'.
     */
    to: string | null;
};

export interface RangeDatePickerProps extends
    IEditable<RangeDatePickerValue | null>,
    IAnalyticableOnChange<RangeDatePickerValue | null>,
    CommonDatePickerProps {
    /**
     * Range presets (like 'this week', 'this month', etc.) to display at the right of the Picker's body.
     * UUI provides defaults in the 'rangeDatePickerPresets' exported variable - you can use it as is, or build on top of it (e.g. add your presets)
     */
    presets?: RangeDatePickerPresets;

    /**
     * Allows to add a custom footer to the Picker's dropdown body
     */
    renderFooter?(value: RangeDatePickerValue): ReactNode;

    /**
     * Called when component gets input focus
     */
    onFocus?: (e: React.FocusEvent<HTMLInputElement>, inputType: RangeDatePickerInputType) => void;

    /**
     * Called when component looses input focus
     */
    onBlur?: (e: React.FocusEvent<HTMLInputElement>, inputType: RangeDatePickerInputType) => void;

    /**
     * Called when component is opened/closed
     */
    onOpenChange?: (isOpen: boolean) => void

    /**
     * A pure function that gets placeholder for 'from' or 'to' input.
     */
    getPlaceholder?(type: RangeDatePickerInputType): string;

    /**
     * Overrides rendering of a single day. For example, to highlight certain days
     */
    renderDay?: (renderProps: DayProps) => ReactElement<Element>;

    /**
     * rawProps as HTML attributes
     */
    rawProps?: {
        /**
         * Any HTML attributes (native or 'data-') to put on 'from' input
         */
        from?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        /**
         * Any HTML attributes (native or 'data-') to put on 'to' input
         */
        to?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        /**
         * Any HTML attributes (native or 'data-') to put on date picker body
         */
        body?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    };
    /**
     * Pass true to prevent "From" date from being empty.
     * It's disable clear cross-icon(if both preventEmptyFromDate and preventEmptyToDate specified) and return last selected value if input was cleared
     */
    preventEmptyFromDate?: boolean;
    /**
     * Pass true to prevent "To" date from being empty.
     * It's disable clear cross-icon(if both preventEmptyFromDate and preventEmptyToDate specified) and return last selected value if input was cleared
     */
    preventEmptyToDate?: boolean;
}

/**
 * Represents the properties of the Day component
 */
export interface DayProps extends IEditable<Dayjs>, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement>, IHasCX {
    filter?(day: Dayjs): boolean;
    renderDayNumber?: (param: Dayjs) => any;
    isSelected?: boolean;
    isHoliday?: boolean;
}
