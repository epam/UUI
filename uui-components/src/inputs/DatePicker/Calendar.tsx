import React, {
    HTMLAttributes, ReactElement,
} from 'react';
import { uuiDayjs, type Dayjs } from '../../helpers';
import {
    arrayToMatrix, cx, IDisableable, IHasCX, IHasForwardedRef, IHasRawProps, DayProps,
} from '@epam/uui-core';
import { Day } from './Day';
import { uuiDaySelection } from './calendarConstants';
import css from './Calendar.module.scss';

/**
 * Represents the properties of the Calendar component
 */
export interface CalendarProps<TSelection> extends IHasCX, IDisableable, IHasRawProps<HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    value?: TSelection;
    onValueChange: (day: Dayjs) => void;
    renderDay?: (renderProps: DayProps) => ReactElement<Element>;
    filter?(day: Dayjs): boolean;
    hideAnotherMonths?: boolean;
    isHoliday?: (day: Dayjs) => boolean;
    /**
     * Represents displayed month
     */
    month: Dayjs;
}

const DAYS_COUNT_IN_WEEK = 7;

const getDays = (start: number, end: number, date: Dayjs): Dayjs[] => {
    const daysMomentObjects = [];
    for (let i = start; i <= end; i += 1) {
        daysMomentObjects.push(date.date(i));
    }
    return daysMomentObjects;
};

const isHoliday = (day: Dayjs) => {
    const dayOfWeek = day.day();
    // Weekend days are typically Saturday and Sunday, regardless of locale's first day of week
    return dayOfWeek === 0 || dayOfWeek === 6;
};

function isSelected <T>(day: Dayjs, value: T): boolean {
    if (uuiDayjs.dayjs.isDayjs(value)) {
        return day.isSame(value);
    } else if (Array.isArray(value)) {
        return value.find((selectedDay) => day.isSame(selectedDay));
    }
    return false;
}

export function Calendar<TSelection>(props: CalendarProps<TSelection>) {
    const getDaysToRender = (days: Dayjs[]) =>
        days.map((day: Dayjs, index: number) => {
            const isSelectedDay: boolean = isSelected(day, props.value);
            return (
                <div
                    className={ uuiDaySelection.dayCell }
                    key={ `day-${props.month.valueOf()}-${day && day.valueOf()}-${index}` }
                >
                    {props.renderDay ? (
                        props.renderDay({
                            value: day,
                            onValueChange: (v) => {
                                props.onValueChange(v);
                            },
                            filter: props.filter,
                            isHoliday: props.isHoliday ? props.isHoliday(day) : isHoliday(day),
                            isSelected: isSelectedDay,
                            isDisabled: props.isDisabled,
                        })
                    ) : (
                        <Day
                            value={ day }
                            onValueChange={ (v) =>{
                                props.onValueChange(v);
                            } }
                            filter={ props.filter }
                            isHoliday={ props.isHoliday ? props.isHoliday(day) : isHoliday(day) }
                            isSelected={ isSelectedDay }
                            isDisabled={ props.isDisabled }
                        />
                    )}
                </div>
            );
        });

    const getDaysMatrix = (currentDate: Dayjs) => {
        const firstDayOfMonth = currentDate.startOf('month');

        // Get the first day of week from locale (0 = Sunday, 1 = Monday, etc.)
        const firstDayOfWeek = uuiDayjs.dayjs.localeData().firstDayOfWeek();

        // Calculate how many empty cells we need at the beginning
        // We need to adjust the day() value based on the first day of week
        const dayOfWeek = firstDayOfMonth.day();
        const emptyCellsCount = (dayOfWeek - firstDayOfWeek + DAYS_COUNT_IN_WEEK) % DAYS_COUNT_IN_WEEK;

        // get days of current month
        const days = Array.from({ length: emptyCellsCount }, (_, index) => {
            return (
                <div
                    className={ uuiDaySelection.dayCell }
                    tabIndex={ -1 }
                    key={ `day-${props.month.valueOf()}-${index}` }
                />
            );
        }).concat(
            getDaysToRender(getDays(1, currentDate?.daysInMonth(), currentDate)),
        );

        return arrayToMatrix(days, DAYS_COUNT_IN_WEEK);
    };

    const daysMatrix = getDaysMatrix(props.month?.startOf('day'));

    const renderDaysTable = () => daysMatrix.map((week, index) => {
        const key = `${props.month.valueOf()}-${index}`;
        return <div key={ key }>{week.map((day) => day)}</div>;
    });

    const renderWeekdays = () => {
        return uuiDayjs.dayjs.weekdaysShort(true).map((weekday, index) => (
            <div
                key={ `${weekday}-${index}` }
                className={ uuiDaySelection.weekday }
            >
                {weekday}
            </div>
        ));
    };

    return (
        <div
            ref={ props.forwardedRef }
            className={ cx(css.container, uuiDaySelection.container, props.cx) }
            { ...props.rawProps }
        >
            <div className={ uuiDaySelection.content }>
                <div className={ uuiDaySelection.weekdaysContainer }>
                    {renderWeekdays()}
                </div>
                <div
                    className={ uuiDaySelection.days }
                >
                    {renderDaysTable()}
                </div>
            </div>
        </div>
    );
}
