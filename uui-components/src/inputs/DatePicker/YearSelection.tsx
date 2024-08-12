import * as React from 'react';
import { Dayjs } from '../../helpers/dayJsHelper';
import { IEditable, IHasCX, arrayToMatrix, cx, IHasRawProps, IHasForwardedRef } from '@epam/uui-core';
import css from './YearSelection.module.scss';

const MONTH_ROW_LENGTH = 4;

export const uuiYearSelection = {
    container: 'uui-year_selection-container',
    content: 'uui-year_selection-content',
    yearsContainer: 'uui-year_selection-years-container',
    yearsRow: 'uui-year_selection-years-row',
    year: 'uui-year_selection-year',
    currentYear: 'uui-year_selection-current-year',
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
                <div className={ uuiYearSelection.yearsContainer }>
                    {arrayToMatrix(getYears(props.value.year()), MONTH_ROW_LENGTH).map((yearsRow, index) => (
                        <div key={ index } className={ uuiYearSelection.yearsRow }>
                            {yearsRow.map((year) => (
                                <div
                                    key={ year }
                                    tabIndex={ 0 }
                                    className={ cx(year === props.selectedDate.year() && uuiYearSelection.currentYear, uuiYearSelection.year) }
                                    onClick={ () => props.onValueChange(props.value.year(year)) }
                                    onKeyDown={ (e) => { e.key === 'Enter' && props.onValueChange(props.value.year(year)); } }
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
