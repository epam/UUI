import * as React from 'react';
import { Dayjs } from 'dayjs';
import {
    IHasCX, IHasRawProps, RangeDatePickerPresets, IHasForwardedRef,
} from '@epam/uui-core';

export type ViewType = 'DAY_SELECTION' | 'MONTH_SELECTION' | 'YEAR_SELECTION';

export interface DatePickerBodyBaseOptions extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    filter?(day: Dayjs): boolean;
    changeIsOpen?(newValue: boolean): void;
    presets?: RangeDatePickerPresets;
    renderDay?: (day: Dayjs, onDayClick: (day: Dayjs) => void) => React.ReactElement<Element>;
}

export interface DatePickerBodyBaseProps<TSelection> extends DatePickerBodyBaseOptions {
    value: PickerBodyValue<TSelection>;
    onValueChange: (value: Partial<PickerBodyValue<TSelection>>) => void;
}

export interface RangePickerBodyValue<TSelection> extends PickerBodyValue<TSelection> {
    activePart: 'from' | 'to';
}

export interface PickerBodyValue<TSelection> {
    selectedDate: TSelection | null;
    month: Dayjs;
    view: ViewType;
}
