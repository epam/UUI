import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale.js';
import {
    IControlled,
    cx,
} from '@epam/uui-core';
import { MonthSelection, YearSelection } from '@epam/uui-components';
import { DatePickerHeader } from './DatePickerHeader';
import { Calendar } from './Calendar';
import css from './DatePickerBody.module.scss';
import { CommonDatePickerBodyProps, DatePickerBodyValue } from './types';
import { uuiDatePickerBodyBase, valueFormat } from './helpers';

export interface DatePickerBodyProps extends CommonDatePickerBodyProps, IControlled<DatePickerBodyValue<string>> {
    isHoliday?: (day: Dayjs) => boolean;
}

dayjs.extend(updateLocale);

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
    forwardedRef,
    rawProps,
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
        <div
            ref={ forwardedRef }
            className={ cx(uuiDatePickerBodyBase.container, classes) }
            { ...rawProps }
        >
            <div className={ cx(css.root, uuiDatePickerBody.wrapper) }>
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
        </div>
    );
}
