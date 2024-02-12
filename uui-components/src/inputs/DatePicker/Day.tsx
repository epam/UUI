import * as React from 'react';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday.js';
import { cx, uuiMarkers, DayProps } from '@epam/uui-core';
import { uuiDaySelection } from './calendarConstants';

dayjs.extend(isToday);

export function Day(props: DayProps): JSX.Element {
    if (!props.value) return null;
    const isCurrent = props.value.isToday();
    const isPassedFilter = props.filter ? props.filter(props.value) : true;

    return (
        <div
            onClick={ isPassedFilter ? () => props.onValueChange(props.value) : undefined }
            className={ cx([
                isPassedFilter && uuiDaySelection.clickable,
                isPassedFilter && uuiMarkers.clickable,
                isCurrent && uuiDaySelection.currentDay,
                props.isSelected && uuiDaySelection.selectedDay,
                props.filter && !props.filter(props.value) && uuiDaySelection.filteredDay,
                props.cx,
                uuiDaySelection.dayWrapper,
                props.isHoliday && uuiDaySelection.holiday,
            ]) }
            ref={ props.forwardedRef }
            { ...props.rawProps }
        >
            <div className={ uuiDaySelection.day }>
                {props.renderDayNumber
                    ? props.renderDayNumber(props.value)
                    : props.value.format('D')}
            </div>
        </div>
    );
}
