import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { IEditable, IHasCX, arrayToMatrix, cx, IHasRawProps } from '@epam/uui';
import * as css from './MonthSelection.scss';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);

const MONTH_ROW_LENGTH = 3;

export const uuiMonthSelection = {
    container: 'uui-monthselection-container',
    content: 'uui-monthselection-content',
    monthContainer: 'uui-monthselection-month-container',
    monthsRow: 'uui-monthselection-months-row',
    month: 'uui-monthselection-month',
    currentMonth: 'uui-monthselection-current-month',
};

export interface MonthSelectionProps extends IEditable<Dayjs>, IHasCX, IHasRawProps<HTMLDivElement> {
    selectedDate: Dayjs;
}

export class MonthSelection extends React.Component<MonthSelectionProps, any> {
    renderMonth(month: string, index: number) {
        const isSelected = this.props.selectedDate.year() === this.props.value.year() && month === this.props.selectedDate.format('MMM');
        return (
            <div
                key={ month }
                className={ cx(isSelected && uuiMonthSelection.currentMonth, uuiMonthSelection.month) }
                onClick={ () => this.props.onValueChange(this.props.value.month(index)) }
            >
                { month }
            </div>
        );
    }

    render() {
        const MONTHS_SHORT_ARRAY = dayjs.monthsShort();
        return (
            <div className={ cx(css.container, uuiMonthSelection.container, this.props.cx) } {...this.props.rawProps} >
                <div className={ uuiMonthSelection.content }>
                    <div className={ uuiMonthSelection.monthContainer }>
                        { arrayToMatrix(MONTHS_SHORT_ARRAY, MONTH_ROW_LENGTH).map((monthsRow, index) =>
                            <div key={ index } className={ uuiMonthSelection.monthsRow }>
                                { monthsRow.map(month => {
                                    const monthIndex = MONTHS_SHORT_ARRAY.findIndex((it: string) => it === month);
                                    return this.renderMonth(month, monthIndex);
                                })
                                }
                            </div>,
                        ) }
                    </div>
                </div>
            </div>
        );
    }
}