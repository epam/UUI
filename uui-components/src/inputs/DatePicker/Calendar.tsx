import React, { HTMLAttributes } from 'react';
import { uuiDayjs } from '../../helpers/dayJsHelper';
import type { Dayjs } from '../../helpers/dayJsHelper';
import {
    arrayToMatrix, cx, IDisableable, IHasCX, IHasForwardedRef, IHasRawProps,
} from '@epam/uui-core';
import { Day, DayProps } from './Day';
import { uuiDaySelection } from './calendarConstants';
import css from './Calendar.module.scss';

/**
 * Represents the properties of the Calendar component
 */
export interface CalendarProps<TSelection> extends IHasCX, IDisableable, IHasRawProps<HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    value?: TSelection;
    onValueChange: (day: Dayjs) => void;
    renderDay?: (renderProps: DayProps) => React.ReactNode;
    filter?(day: Dayjs): boolean;
    hideAnotherMonths?: boolean;
    isHoliday?: (day: Dayjs) => boolean;
    /**
     * Represents displayed month
     */
    month: Dayjs;
}

const DAYS_COUNT_IN_WEEK = 7;

const getPrevMonthFromCurrent = (currentDate: Dayjs) => {
    return currentDate.subtract(1, 'month');
};

const getDays = (start: number, end: number, date: Dayjs): Dayjs[] => {
    const daysMomentObjects = [];
    for (let i = start; i <= end; i += 1) {
        daysMomentObjects.push(date.date(i));
    }
    return daysMomentObjects;
};

const isHoliday = (day: Dayjs) => {
    return day.day() === 0 || day.day() === 6;
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
                            isSelected: isSelected(day, props.value),
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
                            isSelected={ isSelected(day, props.value) }
                            isDisabled={ props.isDisabled }
                        />
                    )}
                </div>
            );
        });

    const getDaysMatrix = (currentDate: Dayjs) => {
        const dayOfLastWeekInPrevMonth = getPrevMonthFromCurrent(currentDate).endOf('month').day();

        // get days of current month
        const days = Array.from({ length: dayOfLastWeekInPrevMonth }, (_, index) => {
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
