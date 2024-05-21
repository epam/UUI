import * as React from 'react';
import { type Dayjs } from '../../helpers/dayJsHelper';
import {
    IEditable, IHasCX, IHasForwardedRef, IHasRawProps, cx, uuiMarkers,
} from '@epam/uui-core';
import { uuiDaySelection } from './calendarConstants';

/**
 * Represents the properties of the Day component
 */
export interface DayProps extends IEditable<Dayjs>, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement>, IHasCX {
    filter?(day: Dayjs): boolean;
    renderDayNumber?: (param: Dayjs) => any;
    isSelected?: boolean;
    isHoliday?: boolean;
}

export function Day(props: DayProps): JSX.Element {
    const isCurrent = props.value.isToday();
    const isPassedFilter = props.filter ? props.filter(props.value) : true;

    const dayNumber = props.renderDayNumber
        ? props.renderDayNumber(props.value)
        : props.value.format('D');
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
                {dayNumber}
            </div>
        </div>
    );
}
