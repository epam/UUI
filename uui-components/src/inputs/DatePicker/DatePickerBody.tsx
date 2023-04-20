import * as React from 'react';
import { DatePickerBodyBase, DatePickerBodyBaseProps, valueFormat } from './DatePickerBodyBase';
import dayjs, { Dayjs } from 'dayjs';
import { MonthSelection } from './MonthSelection';
import { Calendar } from './Calendar';
import { DatePickerHeader } from './DatePickerHeader';
import { YearSelection } from './YearSelection';
import { i18n } from '../../i18n';
import { CalendarPresets } from './CalendarPresets';
import updateLocale from 'dayjs/plugin/updateLocale.js';
import { cx } from '@epam/uui-core';

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

    renderPresets = () => {
        return (
            <>
                <div className={ uuiDatePickerBody.separator } />
                <CalendarPresets
                    onPresetSet={ () => {
                        // this.props.onValueChange((presetVal) => this.props.setDisplayedDateAndView(presetVal.displayedDate, presetVal.view));
                        this.props.changeIsOpen(false);
                    } }
                    presets={ this.props.presets }
                />
            </>
        );
    };

    renderDatePicker = () => {
        return (
            <div className={ cx(uuiDatePickerBody.wrapper, this.props.cx) }>
                <DatePickerHeader
                    value={ this.props.value }
                    onValueChange={ (newValue) => this.props.setDisplayedDateAndView(newValue.displayedDate, newValue.view) }
                    navIconLeft={ this.props.navIconLeft }
                    navIconRight={ this.props.navIconRight }
                />
                {this.getView()}
            </div>
        );
    };
}
