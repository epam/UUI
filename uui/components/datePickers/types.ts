import {
    CommonDatePickerProps,
    IAnalyticableOnChange,
    ICanFocus,
    IEditable,
    IHasCX,
    IHasPlaceholder,
    IHasRawProps,
    Overwrite,
} from '@epam/uui-core';
import { IHasEditMode } from '../types';
import { ReactElement, ReactNode } from 'react';
import { DayProps, RangeDatePickerPresets } from '@epam/uui-components';
import { type Dayjs } from '../../helpers/dayJsHelper';

/**
 * Represents RangeDatePicker value
*/
type RangeDatePickerValue = {
    /**
     * Defines DatePicker value 'from'.
     */
    from: string | null;
    /**
     * Defines DatePicker value 'to'.
     */
    to: string | null;
};

export interface DatePickerModsOverride {}

type DatePickerMods = {
    /**
     * Defines component size.
     */
    size?: '24' | '30' | '36' | '42' | '48';
};

/**
 * Represents the properties of the DatePicker component
 */
interface DatePickerProps extends
    Overwrite<DatePickerMods, DatePickerModsOverride>,
    CommonDatePickerProps,
    IHasEditMode,
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
}

export interface RangeDatePickerModsOverride {}

type RangeDatePickerMods = {
    /**
     * Defines component size.
     */
    size?: '24' | '30' | '36' | '42' | '48';
};

/**
 * Represents the properties of the RangeDatePicker component
 */
interface RangeDatePickerProps extends
    Overwrite<RangeDatePickerMods, RangeDatePickerModsOverride>,
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
     * Overrides rendering of the single day. For example, to highlight certain days
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
}

/**
 * Represents RangeDatePicker input type
 */
type RangeDatePickerInputType = 'from' | 'to' | null;

interface CommonDatePickerBodyProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    filter?(day: Dayjs): boolean;
    presets?: RangeDatePickerPresets;
    renderDay?: (renderProps: DayProps) => React.ReactElement<Element>;
}

type ViewType = 'DAY_SELECTION' | 'MONTH_SELECTION' | 'YEAR_SELECTION';

/**
 * Represents date picker body value
 */
interface RangeDatePickerBodyValue<TSelection> {
    /**
     * Currently setting date
     */
    inFocus: RangeDatePickerInputType;
    /**
     * Date currently set
     */
    selectedDate: TSelection;
}

export type {
    RangeDatePickerValue,
    DatePickerProps,
    RangeDatePickerProps,
    RangeDatePickerInputType,
    CommonDatePickerBodyProps,
    ViewType,
    RangeDatePickerBodyValue,
};
