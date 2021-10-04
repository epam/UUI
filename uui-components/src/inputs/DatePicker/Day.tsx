import React from 'react';
import { cx, IEditable, uuiMarkers, IHasRawProps } from '@epam/uui';
import dayjs, { Dayjs } from 'dayjs';
import { uuiDaySelection } from './Calendar';
import isToday from "dayjs/plugin/isToday";
dayjs.extend(isToday);

export interface DayProps extends IEditable<Dayjs>, IHasRawProps<HTMLDivElement>  {
    filter?(day: Dayjs): boolean;
    getDayCX?: (day: Dayjs) => any;
    renderDayNumber?: (param: any) => any;
    isSelected?: boolean;
    isHoliday?: boolean;
}

export class Day extends React.Component<DayProps, any> {
    render() {
        if (!this.props.value) {
            return null;
        }
        const isCurrent = this.props.value.isToday();
        const isPassedFilter = this.props.filter ? this.props.filter(this.props.value) : true;

        return (
            <div
                onClick={ isPassedFilter ? (() => this.props.onValueChange(this.props.value)) : undefined }
                className={ cx(
                    isPassedFilter && uuiDaySelection.clickable,
                    isPassedFilter && uuiMarkers.clickable,
                    isCurrent && uuiDaySelection.currentDay,
                    this.props.isSelected && uuiDaySelection.selectedDay,
                    this.props.filter && !this.props.filter(this.props.value) && uuiDaySelection.filteredDay,
                    ...(this.props.getDayCX ? this.props.getDayCX(this.props.value) : []),
                    uuiDaySelection.dayWrapper,
                    this.props.isHoliday && uuiDaySelection.holiday
                ) }
                {...this.props.rawProps}
            >
                <div className={ uuiDaySelection.day }>
                    { this.props.renderDayNumber ? this.props.renderDayNumber(this.props.value) : this.props.value.format('D') }
                </div>
            </div>);
    }
}