import React from 'react';
import { cx, IEditable } from '@epam/uui';
import moment from 'moment';
import { uuiDaySelection } from './Calendar';

export interface DayProps extends IEditable<moment.Moment> {
    filter?(day: moment.Moment): boolean;
    getDayCX?: (day: moment.Moment) => any;
    renderDayNumber?: (param: any) => any;
    isSelected?: boolean;
    isHoliday?: boolean;
}

export class Day extends React.Component<DayProps, any> {
    render() {
        if (!this.props.value) {
            return null;
        }

        const isCurrent = this.props.value.format('L') === moment().format('L');
        const isPassedFilter = this.props.filter ? this.props.filter : true;

        return (
            <div
                onClick={ isPassedFilter ? (() => this.props.onValueChange(this.props.value)) : undefined }
                className={ cx(
                    isPassedFilter && uuiDaySelection.clickable,
                    isCurrent && uuiDaySelection.currentDay,
                    this.props.isSelected && uuiDaySelection.selectedDay,
                    this.props.filter && !this.props.filter(this.props.value) && uuiDaySelection.filteredDay,
                    ...(this.props.getDayCX ? this.props.getDayCX(this.props.value) : []),
                    uuiDaySelection.dayWrapper,
                    this.props.isHoliday && uuiDaySelection.holiday,
                ) }
            >
                <div className={ uuiDaySelection.day }>
                    { this.props.renderDayNumber ? this.props.renderDayNumber(this.props.value) : this.props.value.format('D') }
                </div>
            </div>);
    }
}