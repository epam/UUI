import * as React from 'react';
import { IEditable, IHasCX, arrayToMatrix, cx, IHasRawProps } from '@epam/uui-core';
import * as css from './YearSelection.scss';
import { Dayjs } from 'dayjs';

const MONTH_ROW_LENGTH = 4;

export const uuiYearSelection = {
    container: 'uui-yearselection-container',
    content: 'uui-yearselection-content',
    yearContainer: 'uui-yearselection-year-container',
    yearRow: 'uui-yearselection-year-row',
    year: 'uui-yearselection-year',
    currentYear: 'uui-yearselection-current-year',
};

export interface YearSelectionProps extends IEditable<Dayjs>, IHasCX, IHasRawProps<HTMLDivElement> {
    selectedDate: Dayjs;
}

const getYears = (currentYear: number) => {
    return new Array(16).fill(0).map((item, index) => currentYear - 5 + index);
};

export class YearSelection extends React.Component<YearSelectionProps, any> {
    render() {
        return (
            <div className={ cx(css.container, uuiYearSelection.container, this.props.cx) } {...this.props.rawProps}>
                <div className={ uuiYearSelection.content }>
                    <div className={ uuiYearSelection.yearContainer }>
                        { arrayToMatrix(getYears(this.props.value.year()), MONTH_ROW_LENGTH).map((yearRow, index) =>
                            <div key={ index } className={ uuiYearSelection.yearRow }>
                                { yearRow.map(year =>
                                    <div
                                        key={ year }
                                        className={ cx(year === this.props.selectedDate.year() && uuiYearSelection.currentYear, uuiYearSelection.year) }
                                        onClick={ () => this.props.onValueChange(this.props.value.year(year)) }
                                    >
                                        { year }
                                    </div>,
                                ) }
                            </div>,
                        ) }
                    </div>
                </div>
            </div>
        );
    }
}