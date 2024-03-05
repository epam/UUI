import { ReactNode } from 'react';
import {
    IAnalyticableOnChange, IEditable, IHasRawProps,
} from '../../props';
import * as React from 'react';
import { CommonDatePickerProps } from './BaseDatePicker';

export type RangeDatePickerValue = {
    /** RangeDatePicker 'from' value */
    from: string | null;
    /** RangeDatePicker 'to' value */
    to: string | null;
};

export type RangeDatePickerInputType = 'from' | 'to';

export type RangeDatePickerPresets = {
    /** Preset config */
    [key: string]: {
        /** Name of the preset to display in rangeDatePicker body */
        name: ReactNode;
        /** A pure function that gets range value which will be applied by preset selection */
        getRange: () => RangeDatePickerPresetValue;
    };
};

export type RangeDatePickerPresetValue = {
    /** Range from value */
    from?: string;
    /** Range to value */
    to?: string;
    /** Preset order in presets list */
    order?: number;
};

export interface BaseRangeDatePickerProps extends IEditable<RangeDatePickerValue | null>,
    IAnalyticableOnChange<RangeDatePickerValue>,
    CommonDatePickerProps {
    /**
     * Allows to add a custom footer to the Picker's dropdown body
     */
    renderFooter?(value: RangeDatePickerValue): ReactNode;

    /**
     * Range presets (like 'this week', 'this month', etc.) to display at the right of the Picker's body.
     * UUI provides defaults in the 'rangeDatePickerPresets' exported variable - you can use it as is, or build on top of it (e.g. add your presets)
     */
    presets?: RangeDatePickerPresets;

    /**
     * Called when component gets input focus
     */
    onFocus?: (e: React.FocusEvent<HTMLInputElement>, inputType: 'from' | 'to') => void;

    /**
     * Called when component looses input focus
     */
    onBlur?: (e: React.FocusEvent<HTMLInputElement>, inputType: 'from' | 'to') => void;

    /**
     * Called when component is opened/closed
     */
    onOpenChange?: (isOpen: boolean) => void

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
