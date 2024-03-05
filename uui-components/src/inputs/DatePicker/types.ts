import * as React from 'react';
import { Dayjs } from 'dayjs';
import {
    IHasCX, IHasRawProps, RangeDatePickerPresets, IHasForwardedRef, DayProps,
} from '@epam/uui-core';

export type ViewType = 'DAY_SELECTION' | 'MONTH_SELECTION' | 'YEAR_SELECTION';

export interface DatePickerBodyBaseOptions extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    filter?(day: Dayjs): boolean;
    presets?: RangeDatePickerPresets;
    renderDay?: (renderProps: DayProps) => React.ReactElement<Element>;
}

export interface DatePickerBodyBaseProps<TSelection> extends DatePickerBodyBaseOptions {
    value: PickerBodyValue<TSelection>;
    onValueChange: (value: PickerBodyValue<TSelection>) => void;
}
export interface PickerBodyValue<TSelection> {
    selectedDate: TSelection | null;
    month: Dayjs;
    view: ViewType;
}

export interface RangePickerBodyValue<TSelection> extends PickerBodyValue<TSelection> {
    inFocus: 'from' | 'to';
}
