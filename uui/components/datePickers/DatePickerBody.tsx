import React, { useEffect, useState } from 'react';
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
import { CommonDatePickerBodyProps, ViewType } from './types';
import {
    getNewMonth, uuiDatePickerBodyBase, valueFormat,
} from './helpers';

export interface DatePickerBodyProps extends CommonDatePickerBodyProps, IControlled<string | null> {
    isHoliday?: (day: Dayjs) => boolean;
}

export type DatePickerBodyOptions = {
    month: Dayjs;
    view: ViewType;
};

dayjs.extend(updateLocale);

export const uuiDatePickerBody = {
    wrapper: 'uui-datepickerBody-wrapper',
    separator: 'uui-datepickerBody-separator',
} as const;

export function DatePickerBody(props: DatePickerBodyProps) {
    const { value, onValueChange } = props;
    const [{ view, month }, setState] = useState<DatePickerBodyOptions>({
        view: 'DAY_SELECTION',
        month: getNewMonth(value),
    });

    return (
        <StatelessDatePickerBody
            { ...props }
            month={ month }
            view={ view }
            onValueChange={ onValueChange }
            onOptionsChange={ (o) => setState(o) }
        />
    );
}

export interface StatelessDatePickerBodyValue<TSelection> {
    value: TSelection | null;
    month: Dayjs;
    view: ViewType;
}

export interface StatelessDatePickerBodyProps extends CommonDatePickerBodyProps, StatelessDatePickerBodyValue<string> {
    onValueChange: (value: string | null) => void;
    onOptionsChange: (o: DatePickerBodyOptions) => void;
    isHoliday?: (day: Dayjs) => boolean;
}

export function StatelessDatePickerBody({
    renderDay,
    isHoliday,
    cx: classes,
    filter,
    forwardedRef,
    rawProps,
    value,
    month,
    view,
    onValueChange,
    onOptionsChange,
}: StatelessDatePickerBodyProps) {
    const selectedDate = dayjs(value);

    const onMonthClick = (newDate: Dayjs) => {
        onOptionsChange({
            month: newDate,
            view: 'DAY_SELECTION',
        });
    };

    const onYearClick = (newDate: Dayjs) => {
        onOptionsChange({
            month: newDate,
            view: 'MONTH_SELECTION',
        });
    };

    const onDayClick = (day: Dayjs) => {
        if (!filter || filter(day)) {
            onValueChange(day.format(valueFormat));
        }
    };

    const getView = () => {
        switch (view) {
            case 'MONTH_SELECTION':
                return (
                    <MonthSelection
                        selectedDate={ selectedDate }
                        value={ month }
                        onValueChange={ onMonthClick }
                    />
                );
            case 'YEAR_SELECTION':
                return (
                    <YearSelection
                        selectedDate={ selectedDate }
                        value={ month }
                        onValueChange={ onYearClick }
                    />
                );
            case 'DAY_SELECTION':
                return (
                    <Calendar
                        value={ selectedDate }
                        month={ month }
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
                        view,
                        month,
                    } }
                    onValueChange={ (newValue) => {
                        onOptionsChange(newValue);
                    } }
                />
                {getView()}
            </div>
        </div>
    );
}
