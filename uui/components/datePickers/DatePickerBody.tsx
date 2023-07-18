import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale.js';
import { cx } from '@epam/uui-core';
import {
    MonthSelection, YearSelection, DatePickerBodyBase, DatePickerBodyBaseProps, valueFormat, i18n,
} from '@epam/uui-components';
import { DatePickerHeader } from './DatePickerHeader';
import { Calendar } from './Calendar';
import './DatePickerBody.module.scss';

dayjs.extend(updateLocale);

export interface DatePickerBodyProps extends DatePickerBodyBaseProps<string> {
    getDayCX?(day: Dayjs): string[];
    isHoliday?: (day: Dayjs) => boolean;
}

export const uuiDatePickerBody = {
    wrapper: 'uui-datepickerBody-wrapper',
    separator: 'uui-datepickerBody-separator',
} as const;

export class DatePickerBody extends DatePickerBodyBase<string, DatePickerBodyProps> {
    constructor(props: DatePickerBodyProps) {
        super(props);
        dayjs.locale('en');
        dayjs.updateLocale(i18n.datePicker.locale, { weekStart: 1 });
    }

    onDayClick = (day: Dayjs) => {
        if (!this.props.filter || this.props.filter(day)) {
            this.props.setSelectedDate(day.format(valueFormat));
        }
        this.props.changeIsOpen && this.props.changeIsOpen(false);
    };

    getView = () => {
        switch (this.props.value?.view) {
            case 'MONTH_SELECTION':
                return (
                    <MonthSelection selectedDate={ dayjs(this.props.value.selectedDate) } value={ this.props.value.displayedDate } onValueChange={ this.onMonthClick } />
                );
            case 'YEAR_SELECTION':
                return (
                    <YearSelection selectedDate={ dayjs(this.props.value.selectedDate) } value={ this.props.value.displayedDate } onValueChange={ this.onYearClick } />
                );
            case 'DAY_SELECTION':
                return (
                    <Calendar
                        value={ dayjs(this.props.value.selectedDate) }
                        onValueChange={ this.onDayClick }
                        displayedDate={ this.props.value.displayedDate }
                        filter={ this.props.filter }
                        getDayCX={ this.props.getDayCX }
                        renderDay={ this.props.renderDay }
                        isHoliday={ this.props.isHoliday }
                    />
                );
        }
    };

    renderDatePicker = () => {
        return (
            <div className={ cx(uuiDatePickerBody.wrapper, this.props.cx) }>
                <DatePickerHeader
                    value={ this.props.value }
                    onValueChange={ (newValue) => this.props.setDisplayedDateAndView(newValue.displayedDate, newValue.view) }
                />
                {this.getView()}
            </div>
        );
    };
}
