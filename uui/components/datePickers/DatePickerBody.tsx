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
    value,
    onValueChange,
    renderDay,
    isHoliday,
    cx: classes,
    filter,
}: DatePickerBodyProps) {
    const selectedDate = dayjs(value.selectedDate);

    const onMonthClick = (newDate: Dayjs) => {
        onValueChange({
            ...value,
            month: newDate,
            view: 'DAY_SELECTION',
        });
    };

    const onYearClick = (newDate: Dayjs) => {
        onValueChange({
            ...value,
            month: newDate,
            view: 'MONTH_SELECTION',
        });
    };

    const onDayClick = (day: Dayjs) => {
        if (!filter || filter(day)) {
            onValueChange({
                ...value,
                selectedDate: day.format(valueFormat),
            });
        }
    };

    const getView = () => {
        switch (value.view) {
            case 'MONTH_SELECTION':
                return (
                    <MonthSelection
                        selectedDate={ selectedDate }
                        value={ value.month }
                        onValueChange={ onMonthClick }
                    />
                );
            case 'YEAR_SELECTION':
                return (
                    <YearSelection
                        selectedDate={ selectedDate }
                        value={ value.month }
                        onValueChange={ onYearClick }
                    />
                );
            case 'DAY_SELECTION':
                return (
                    <Calendar
                        value={ selectedDate }
                        month={ value.month }
                        onValueChange={ onDayClick }
                        filter={ filter }
                        renderDay={ renderDay }
                        isHoliday={ isHoliday }
                    />
                );
        }
    };

    return (
        <div className={ cx(css.root, uuiDatePickerBody.wrapper, classes) }>
            <DatePickerHeader
                value={ {
                    view: value.view,
                    month: value.month,
                } }
                onValueChange={ (newValue) => {
                    onValueChange({
                        ...value,
                        ...newValue,
                    });
                } }
            />
            {getView()}
        </div>
    );
}
