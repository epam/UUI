import * as React from 'react';
import { DayProps as CoreDayProps, cx, uuiMarkers } from '@epam/uui-core';
import { uuiDaySelection } from './calendarConstants';
import type { JSX } from 'react';

export interface DayProps extends CoreDayProps {}

export function Day(props: DayProps): JSX.Element {
    const isCurrent = props.value.isToday();
    const isPassedFilter = props.filter ? props.filter(props.value) : true;

    const dayNumber = props.renderDayNumber
        ? props.renderDayNumber(props.value)
        : props.value.format('D');

    const selectDay = () => {
        isPassedFilter && props.onValueChange(props.value);
    };

    const isDisabled = props.isDisabled || (props.filter && !props.filter(props.value));

    return (
        <div
            onClick={ selectDay }
            onKeyDown={ (e) => e.key === 'Enter' && selectDay() }
            tabIndex={ !isDisabled ? 0 : -1 }
            className={ cx([
                isPassedFilter && uuiDaySelection.clickableDay,
                isPassedFilter && uuiMarkers.clickable,
                isCurrent && uuiDaySelection.currentDay,
                props.isSelected && uuiDaySelection.selectedDay,
                isDisabled && uuiDaySelection.filteredDay,
                props.cx,
                uuiDaySelection.dayWrapper,
                props.isHoliday && uuiDaySelection.holiday,
            ]) }
            ref={ props.forwardedRef }
            data-date={ props.value.format('YYYY-MM-DD') }
            aria-selected={ props.isSelected ? 'true' : undefined }
            { ...props.rawProps }
        >
            <div className={ uuiDaySelection.day }>
                {dayNumber}
            </div>
        </div>
    );
}
