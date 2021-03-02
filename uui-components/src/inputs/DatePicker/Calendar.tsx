import * as React from 'react';
import { IHasCX, arrayToMatrix } from '@epam/uui';
import moment from 'moment';
import { Day } from "./Day";
import cx from 'classnames';
import * as css from './Calendar.scss';
import { i18n } from "../../../i18n";

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
};

export interface CalendarProps<TSelection> extends IHasCX {
    value: TSelection;
    onValueChange: (day: moment.Moment) => void;
    displayedDate: moment.Moment;
    renderDay?: (day: moment.Moment, onDayClick: (day: moment.Moment) => void) => React.ReactElement<Element>;
    filter?(day: moment.Moment): boolean;
    hideAnotherMonths?: boolean;
    getDayCX?: (day: moment.Moment) => any;
    isHoliday?: (day: moment.Moment) => boolean;
}

export class Calendar<TSelection> extends React.Component<CalendarProps<TSelection>, { weeksHeight: number }> {
    constructor(props: any) {
        super(props);
        moment.locale(i18n.datePicker.locale);
        moment.updateLocale(i18n.datePicker.locale, { week: { dow: 1, doy: 7 }});

        this.state = {
            weeksHeight: this.getDaysMatrix(this.props.displayedDate?.startOf('day')).length * 36,
        };
    }

    componentDidUpdate(prevProps: Readonly<CalendarProps<TSelection>>) {
        if (prevProps.displayedDate.startOf('day') !== this.props.displayedDate.startOf('day')) {
            this.setState({ weeksHeight: this.getDaysMatrix(this.props.displayedDate.startOf('day')).length * 36 });
        }
    }

    getPrevMonthFromCurrent = (currentDate: moment.Moment) => {
        return moment(currentDate).subtract(1, 'months');
    }

    getNextMonthFromCurrent = (currentDate: moment.Moment) => {
        return moment(currentDate).add(1, 'months');
    }

    getDaysToRender(days: moment.Moment[]) {
        const isSelected = (day: moment.Moment) => {
            if (!day) return;
            if (moment.isMoment(this.props.value)) {
                return day.isSame(this.props.value);
            } else if (Array.isArray(this.props.value)) {
                return this.props.value.find(selectedDay => day.isSame(selectedDay));
            }
        };

        const isHoliday = (day: moment.Moment) => {
            if (!day) return;
            let cloneDay = day.clone();
            return cloneDay.day('sunday').isSame(day) || cloneDay.day('saturday').isSame(day);
        };

        return days.map((day, index) => {
            return (
                <div className={ uuiDaySelection.dayCell } tabIndex={ 0 } key={ `day-${day && day.valueOf()}-${index}` }>
                    { this.props.renderDay
                        ?
                        this.props.renderDay(day, this.props.onValueChange)
                        :
                        <Day value={ day } onValueChange={ this.props.onValueChange } isHoliday={ this.props.isHoliday ? this.props.isHoliday(day) : isHoliday(day) } isSelected={ isSelected(day) } getDayCX={ this.props.getDayCX } filter={ this.props.filter } />
                    }
                </div>
            );
        });
    }

    getDays = (start: number, end: number, date: moment.Moment): moment.Moment[] => {
        const daysMomentObjects = [];
        for (let i = start; i <= end; i += 1) {
            daysMomentObjects.push(moment(date.date(i)));
        }
        return daysMomentObjects;
    }

    getDaysMatrix(currentDate: moment.Moment) {
        let days: React.ReactElement<HTMLDivElement>[] = [];
        const dayOfLastWeekInPrevMonth = this.getPrevMonthFromCurrent(currentDate).endOf('month').day();

        days = days.concat(this.getDaysToRender(new Array(dayOfLastWeekInPrevMonth).fill(undefined)));

        // get days of current month
        days = days.concat(this.getDaysToRender(this.getDays(1, currentDate?.daysInMonth(), moment(currentDate))));

        return arrayToMatrix(days, DAYS_COUNT_IN_WEEK);
    }

    renderDaysTable() {
        return this.getDaysMatrix(this.props.displayedDate?.startOf('day'))
            .map((week, index) => {
                return <div key={ index }>{ week.map((day) => day) }</div>;
            });
    }

    render() {
        return (
            <div className={ cx(css.container, uuiDaySelection.container, this.props.cx) }>
                <div className={ uuiDaySelection.content }>
                    <div className={ uuiDaySelection.weekdaysContainer }>
                        { moment.weekdaysShort(true).map((weekday, index) => <div className={ uuiDaySelection.weekday } key={ index }>{ weekday }</div>) }
                    </div>
                    <div className={ uuiDaySelection.days } style={ { 'height': `${ this.state.weeksHeight }px` } }>
                        { this.renderDaysTable() }
                    </div>
                </div>
            </div>
        );
    }
}