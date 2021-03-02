import * as React from 'react';
import moment from 'moment';
import { IEditable, IHasCX, arrayToMatrix } from '@epam/uui';
import cx from 'classnames';
import * as css from './MonthSelection.scss';

const MONTH_ROW_LENGTH = 3;

export const uuiMonthSelection = {
    container: 'uui-monthselection-container',
    content: 'uui-monthselection-content',
    monthContainer: 'uui-monthselection-month-container',
    monthsRow: 'uui-monthselection-months-row',
    month: 'uui-monthselection-month',
    currentMonth: 'uui-monthselection-current-month',
};

export interface MonthSelectionProps extends IEditable<moment.Moment>, IHasCX {
    selectedDate: moment.Moment;
}

export class MonthSelection extends React.Component<MonthSelectionProps, any> {
    renderMonth(month: string) {
        const isSelected = this.props.selectedDate.year() === this.props.value.year() && month === this.props.selectedDate.format('MMM');
        return (
            <div
                key={ month }
                className={ cx(isSelected && uuiMonthSelection.currentMonth, uuiMonthSelection.month) }
                onClick={ () => this.props.onValueChange(this.props.value.month(month)) }
            >
                { month }
            </div>
        );
    }

    render() {
        return (
            <div className={ cx(css.container, uuiMonthSelection.container, this.props.cx) }>
                <div className={ uuiMonthSelection.content }>
                    <div className={ uuiMonthSelection.monthContainer }>
                        { arrayToMatrix(moment.monthsShort(), MONTH_ROW_LENGTH).map((monthsRow, index) =>
                            <div key={ index } className={ uuiMonthSelection.monthsRow }>
                                { monthsRow.map(month => this.renderMonth(month)) }
                            </div>,
                        ) }
                    </div>
                </div>
            </div>
        );
    }
}