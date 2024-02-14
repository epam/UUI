import * as React from 'react';
import { Dayjs } from 'dayjs';
import {
    IEditable, IHasCX, arrayToMatrix, cx, IHasRawProps, IHasForwardedRef,
} from '@epam/uui-core';
import css from './YearSelection.module.scss';

const MONTH_ROW_LENGTH = 4;

export const uuiYearSelection = {
    container: 'uui-yearselection-container',
    content: 'uui-yearselection-content',
    yearContainer: 'uui-yearselection-year-container',
    yearRow: 'uui-yearselection-year-row',
    year: 'uui-yearselection-year',
    currentYear: 'uui-yearselection-current-year',
} as const;

export interface YearSelectionProps extends IEditable<Dayjs>, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    selectedDate: Dayjs;
}

const getYears = (currentYear: number) => {
    return new Array(16).fill(0).map((_, index) => currentYear - 5 + index);
};

export function YearSelection(props: YearSelectionProps) {
    return (
        <div className={ cx(css.container, uuiYearSelection.container, props.cx) } { ...props.rawProps }>
            <div className={ uuiYearSelection.content }>
                <div className={ uuiYearSelection.yearContainer }>
                    {arrayToMatrix(getYears(props.value.year()), MONTH_ROW_LENGTH).map((yearRow, index) => (
                        <div key={ index } className={ uuiYearSelection.yearRow }>
                            {yearRow.map((year) => (
                                <div
                                    key={ year }
                                    className={ cx(year === props.selectedDate.year() && uuiYearSelection.currentYear, uuiYearSelection.year) }
                                    onClick={ () => props.onValueChange(props.value.year(year)) }
                                >
                                    {year}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
