import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale.js';
import { cx } from '@epam/uui-core';
import { MonthSelection, YearSelection, valueFormat, DatePickerBodyBaseProps } from '@epam/uui-components';
import { DatePickerHeader } from './DatePickerHeader';
import { Calendar } from './Calendar';
import css from './DatePickerBody.module.scss';

dayjs.extend(updateLocale);

export interface DatePickerBodyProps extends DatePickerBodyBaseProps<string> {
    /*
    * A pure function that gets array of classes for styling a day for each day.
    */
    getDayCX?(day: Dayjs): string[];
    /**
     * A pure function that gets whether day is holiday for each day.
     */
    isHoliday?: (day: Dayjs) => boolean;
}

export const uuiDatePickerBody = {
    wrapper: 'uui-datepickerBody-wrapper',
    separator: 'uui-datepickerBody-separator',
} as const;

export function DatePickerBody({
    getDayCX,
    renderDay,
    isHoliday,
    cx: classes,
    value,
    setDisplayedDateAndView,
    setSelectedDate,
    filter,
    changeIsOpen,
}: DatePickerBodyProps) {
    const selectedDate = dayjs(value.selectedDate);

    const onMonthClick = (newDate: Dayjs) => {
        setDisplayedDateAndView(newDate, 'DAY_SELECTION');
    };

    const onYearClick = (newDate: Dayjs) => {
        setDisplayedDateAndView(newDate, 'MONTH_SELECTION');
    };

    const onDayClick = (day: Dayjs) => {
        if (!filter || filter(day)) {
            setSelectedDate(day.format(valueFormat));
        }
        changeIsOpen?.(false);
    };

    const getView = () => {
        switch (value.view) {
            case 'MONTH_SELECTION':
                return (
                    <MonthSelection
                        selectedDate={ selectedDate }
                        value={ value.displayedDate }
                        onValueChange={ onMonthClick }
                    />
                );
            case 'YEAR_SELECTION':
                return (
                    <YearSelection
                        selectedDate={ selectedDate }
                        value={ value.displayedDate }
                        onValueChange={ onYearClick }
                    />
                );
            case 'DAY_SELECTION':
                return (
                    <Calendar
                        value={ selectedDate }
                        displayedDate={ value.displayedDate }
                        onValueChange={ onDayClick }
                        filter={ filter }
                        getDayCX={ getDayCX }
                        renderDay={ renderDay }
                        isHoliday={ isHoliday }
                    />
                );
        }
    };

    return (
        <div className={ cx(css.root, uuiDatePickerBody.wrapper, classes) }>
            <DatePickerHeader
                value={ value }
                onValueChange={ (newValue) => setDisplayedDateAndView(newValue.displayedDate, newValue.view) }
            />
            {getView()}
        </div>
    );
}
