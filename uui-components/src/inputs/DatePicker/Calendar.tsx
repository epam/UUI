import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData.js';
import updateLocale from 'dayjs/plugin/updateLocale.js';
import { arrayToMatrix, cx, CalendarProps } from '@epam/uui-core';
import { Day } from './Day';
import { uuiDaySelection } from './calendarConstants';
import { i18n } from '../../i18n';
import css from './Calendar.module.scss';

dayjs.extend(localeData);
dayjs.extend(updateLocale);

const DAYS_COUNT_IN_WEEK = 7;

export function Calendar<TSelection>(props: CalendarProps<TSelection>) {
    const [weeksHeight, setWeeksHeight] = useState<number>(0);

    useEffect(() => {
        dayjs.locale(i18n.datePicker.locale);
        dayjs.updateLocale(i18n.datePicker.locale, { weekStart: 1 });
    }, []);

    useEffect(() => {
        const newWeeksHeight = getDaysMatrix(props.month?.startOf('day')).length * 36;
        setWeeksHeight(newWeeksHeight);
    }, [props.month]);

    const getPrevMonthFromCurrent = (currentDate: Dayjs) => {
        return currentDate.subtract(1, 'month');
    };

    const getDaysToRender = (days: Dayjs[]) => {
        const isSelected = (day: Dayjs) => {
            if (dayjs.isDayjs(props.value)) {
                return day.isSame(props.value);
            } else if (Array.isArray(props.value)) {
                return props.value.find((selectedDay) => day.isSame(selectedDay));
            }
        };

        const isHoliday = (day: Dayjs) => {
            return day.day() === 0 || day.day() === 6;
        };

        return days.map((day: Dayjs, index: number) => {
            return (
                <div
                    className={ uuiDaySelection.dayCell }
                    tabIndex={ 0 }
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
                            isSelected: isSelected(day),
                        })
                    ) : (
                        <Day
                            value={ day }
                            onValueChange={ (v) =>{
                                props.onValueChange(v);
                            } }
                            filter={ props.filter }
                            isHoliday={ props.isHoliday ? props.isHoliday(day) : isHoliday(day) }
                            isSelected={ isSelected(day) }
                        />
                    )}
                </div>
            );
        });
    };

    const getDays = (start: number, end: number, date: Dayjs): Dayjs[] => {
        const daysMomentObjects = [];
        for (let i = start; i <= end; i += 1) {
            daysMomentObjects.push(date.date(i));
        }
        return daysMomentObjects;
    };

    const getDaysMatrix = (currentDate: Dayjs) => {
        const dayOfLastWeekInPrevMonth = getPrevMonthFromCurrent(currentDate).endOf('month').day();

        // get days of current month
        const days = Array.from({ length: dayOfLastWeekInPrevMonth }, (_, index) => {
            return (
                <div
                    className={ uuiDaySelection.dayCell }
                    tabIndex={ 0 }
                    key={ `day-${props.month.valueOf()}-${index}` }
                />
            );
        }).concat(
            getDaysToRender(getDays(1, currentDate?.daysInMonth(), currentDate)),
        );

        return arrayToMatrix(days, DAYS_COUNT_IN_WEEK);
    };

    const renderDaysTable = () => {
        return getDaysMatrix(props.month?.startOf('day')).map((week, index) => {
            const key = `${props.month.valueOf()}-${index}`;
            return <div key={ key }>{week.map((day) => day)}</div>;
        });
    };

    return (
        <div
            ref={ props.forwardedRef } className={ cx(css.container, uuiDaySelection.container, props.cx) }
            { ...props.rawProps }
        >
            <div className={ uuiDaySelection.content }>
                <div className={ uuiDaySelection.weekdaysContainer }>
                    {dayjs.weekdaysShort(true).map((weekday, index) => (
                        <div className={ uuiDaySelection.weekday } key={ index }>
                            {weekday}
                        </div>
                    ))}
                </div>
                <div className={ uuiDaySelection.days } style={ { height: `${weeksHeight}px` } }>
                    {renderDaysTable()}
                </div>
            </div>
        </div>
    );
}
