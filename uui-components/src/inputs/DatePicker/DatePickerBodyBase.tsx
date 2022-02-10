import * as React from 'react';
import { Dayjs } from 'dayjs';
import { IHasCX, Icon, cx, IHasRawProps } from '@epam/uui-core';
import { Presets } from './CalendarPresets';

export type ViewType = 'DAY_SELECTION' | 'MONTH_SELECTION' | 'YEAR_SELECTION';

export const defaultFormat = 'MMM D, YYYY';
export const valueFormat = 'YYYY-MM-DD';

export const uuiDatePickerBodyBase = {
    container: 'uui-datepicker-container',
};

export interface DatePickerBodyBaseOptions extends IHasCX, IHasRawProps<HTMLDivElement> {
    filter?(day: Dayjs): boolean;
    changeIsOpen?(newValue: boolean): void;
    presets?: Presets;
    renderDay?: (day: Dayjs, onDayClick: (day: Dayjs) => void) => React.ReactElement<Element>;
    navIconLeft?: Icon;
    navIconRight?: Icon;
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
    abstract renderDatePicker: () => React.ReactElement<Element>;

    onMonthClick = (newDate: Dayjs) => {
        this.props.setDisplayedDateAndView(newDate, 'DAY_SELECTION');
    }

    onYearClick = (newDate: Dayjs) => {
        this.props.setDisplayedDateAndView(newDate, 'MONTH_SELECTION');
    }

    render() {
        return (
            <div className={ cx(uuiDatePickerBodyBase.container, this.props.cx) } {...this.props.rawProps}>
                { this.renderDatePicker() }
            </div>
        );
    }
}
