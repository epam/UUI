import * as React from 'react';
import { Dayjs } from 'dayjs';
import {
    IHasCX, cx, IHasRawProps, RangeDatePickerPresets, IHasForwardedRef,
} from '@epam/uui-core';

export type ViewType = 'DAY_SELECTION' | 'MONTH_SELECTION' | 'YEAR_SELECTION';

export const defaultFormat = 'MMM D, YYYY';
export const valueFormat = 'YYYY-MM-DD';
export const supportedDateFormats = (format: string) => {
    return [
        ...(format ? [format] : []), 'MM/DD/YYYY', 'DD-MM-YYYY', 'DD.MM.YYYY', 'YYYY/MM/DD', 'YYYY-MM-DD', 'YYYY.MM.DD', 'MMM D, YYYY', 'D/M/YYYY', 'YYYY/M/D',
    ];
};

export const uuiDatePickerBodyBase = {
    container: 'uui-datepicker-container',
} as const;

export interface DatePickerBodyBaseOptions extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    filter?(day: Dayjs): boolean;
    changeIsOpen?(newValue: boolean): void;
    presets?: RangeDatePickerPresets;
    renderDay?: (day: Dayjs, onDayClick: (day: Dayjs) => void) => React.ReactElement<Element>;
}

export interface DatePickerBodyBaseProps<TSelection> extends DatePickerBodyBaseOptions {
    value: PickerBodyValue<TSelection>;
    setSelectedDate: (newDate: TSelection) => void;
    setDisplayedDateAndView: (displayedDate: Dayjs, view: ViewType) => void;
}

export interface PickerBodyValue<TSelection> {
    selectedDate: TSelection | null;
    displayedDate: Dayjs;
    view: ViewType;
}

export abstract class DatePickerBodyBase<TSelection, TProps> extends React.Component<DatePickerBodyBaseProps<TSelection> & TProps> {
    abstract renderBody: () => React.ReactElement<Element>;
    onMonthClick = (newDate: Dayjs) => {
        this.props.setDisplayedDateAndView(newDate, 'DAY_SELECTION');
    };

    onYearClick = (newDate: Dayjs) => {
        this.props.setDisplayedDateAndView(newDate, 'MONTH_SELECTION');
    };

    render() {
        return (
            <div ref={ this.props.forwardedRef } className={ cx(uuiDatePickerBodyBase.container, this.props.cx) } { ...this.props.rawProps }>
                {this.renderBody()}
            </div>
        );
    }
}
