import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import {
    IHasCX, arrayToMatrix, cx, IHasRawProps, IHasForwardedRef,
} from '@epam/uui-core';
import { Day } from './Day';
import { i18n } from '../../i18n';
import localeData from 'dayjs/plugin/localeData.js';
import css from './Calendar.scss';

dayjs.extend(localeData);

const DAYS_COUNT_IN_WEEK = 7;

export const uuiDaySelection = {
    container: 'uui-calendar-container',
    content: 'uui-calendar-content',
    weekdaysContainer: 'uui-calendar-weekdays-container',
    weekday: 'uui-calendar-weekday',
    days: 'uui-calendar-days',
    dayCell: 'uui-calendar-day-cell',
    day: 'uui-calendar-day',
    currentDay: 'uui-calendar-current-day',
    selectedDay: 'uui-calendar-selected-day',
    filteredDay: 'uui-calendar-filtered-day',
    previousMonthEmptyDay: 'uui-calendar-previous-month-empty-day',
    clickable: 'uui-calendar-clickable-day',
    dayWrapper: 'uui-calendar-day-wrapper',
    holiday: 'uui-calendar-day-holiday',
} as const;

export interface CalendarProps<TSelection> extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    value: TSelection;
    onValueChange: (day: Dayjs) => void;
    displayedDate: Dayjs;
    renderDay?: (day: Dayjs, onDayClick: (day: Dayjs) => void) => React.ReactElement<Element>;
    filter?(day: Dayjs): boolean;
    hideAnotherMonths?: boolean;
    getDayCX?: (day: Dayjs) => any;
    isHoliday?: (day: Dayjs) => boolean;
}

export class Calendar<TSelection> extends React.Component<CalendarProps<TSelection>, { weeksHeight: number }> {
    constructor(props: CalendarProps<TSelection>) {
        super(props);
        dayjs.locale(i18n.datePicker.locale);
        dayjs.updateLocale(i18n.datePicker.locale, { weekStart: 1 });

        this.state = {
            weeksHeight: this.getDaysMatrix(this.props.displayedDate?.startOf('day')).length * 36,
        };
    }

    componentDidUpdate(prevProps: Readonly<CalendarProps<TSelection>>) {
        if (!prevProps.displayedDate.startOf('day').isSame(this.props.displayedDate.startOf('day'))) {
            this.setState({ weeksHeight: this.getDaysMatrix(this.props.displayedDate.startOf('day')).length * 36 });
        }
    }

    getPrevMonthFromCurrent = (currentDate: Dayjs) => {
        return currentDate.subtract(1, 'month');
    };

    getNextMonthFromCurrent = (currentDate: Dayjs) => {
        return currentDate.add(1, 'month');
    };

    getDaysToRender(days: Dayjs[]) {
        const isSelected = (day: Dayjs) => {
            if (!day) return;
            if (dayjs.isDayjs(this.props.value)) {
                return day.isSame(this.props.value);
            } else if (Array.isArray(this.props.value)) {
                return this.props.value.find((selectedDay) => day.isSame(selectedDay));
            }
        };

        const isHoliday = (day: Dayjs) => {
            if (!day) return;
            return day.day() === 0 || day.day() === 6;
        };

        return days.map((day, index) => {
            return (
                <div className={ uuiDaySelection.dayCell } tabIndex={ 0 } key={ `day-${day && day.valueOf()}-${index}` }>
                    {this.props.renderDay ? (
                        this.props.renderDay(day, this.props.onValueChange)
                    ) : (
                        <Day
                            value={ day }
                            onValueChange={ this.props.onValueChange }
                            isHoliday={ this.props.isHoliday ? this.props.isHoliday(day) : isHoliday(day) }
                            isSelected={ isSelected(day) }
                            getDayCX={ this.props.getDayCX }
                            filter={ this.props.filter }
                        />
                    )}
                </div>
            );
        });
    }

    getDays = (start: number, end: number, date: Dayjs): Dayjs[] => {
        const daysMomentObjects = [];
        for (let i = start; i <= end; i += 1) {
            daysMomentObjects.push(date.date(i));
        }
        return daysMomentObjects;
    };

    getDaysMatrix(currentDate: Dayjs) {
        let days: React.ReactElement<HTMLDivElement>[] = [];
        const dayOfLastWeekInPrevMonth = this.getPrevMonthFromCurrent(currentDate).endOf('month').day();

        days = days.concat(this.getDaysToRender(new Array(dayOfLastWeekInPrevMonth).fill(undefined)));

        // get days of current month
        days = days.concat(this.getDaysToRender(this.getDays(1, currentDate?.daysInMonth(), currentDate)));

        return arrayToMatrix(days, DAYS_COUNT_IN_WEEK);
    }

    renderDaysTable() {
        return this.getDaysMatrix(this.props.displayedDate?.startOf('day')).map((week, index) => {
            return <div key={ index }>{week.map((day) => day)}</div>;
        });
    }

    render() {
        return (
            <div ref={ this.props.forwardedRef } className={ cx(css.container, uuiDaySelection.container, this.props.cx) } { ...this.props.rawProps }>
                <div className={ uuiDaySelection.content }>
                    <div className={ uuiDaySelection.weekdaysContainer }>
                        {dayjs.weekdaysShort(true).map((weekday, index) => (
                            <div className={ uuiDaySelection.weekday } key={ index }>
                                {weekday}
                            </div>
                        ))}
                    </div>
                    <div className={ uuiDaySelection.days } style={ { height: `${this.state.weeksHeight}px` } }>
                        {this.renderDaysTable()}
                    </div>
                </div>
            </div>
        );
    }
}
