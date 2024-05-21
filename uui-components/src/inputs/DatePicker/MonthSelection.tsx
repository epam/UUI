import * as React from 'react';
import { type Dayjs, uuiDayjs } from '../../helpers/dayJsHelper';
import { IEditable, IHasCX, arrayToMatrix, cx, IHasRawProps, IHasForwardedRef } from '@epam/uui-core';

import css from './MonthSelection.module.scss';

const MONTH_ROW_LENGTH = 3;

export const uuiMonthSelection = {
    container: 'uui-monthselection-container',
    content: 'uui-monthselection-content',
    monthContainer: 'uui-monthselection-month-container',
    monthsRow: 'uui-monthselection-months-row',
    month: 'uui-monthselection-month',
    currentMonth: 'uui-monthselection-current-month',
} as const;

interface MonthSelectionProps extends IEditable<Dayjs>, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    selectedDate: Dayjs;
}

interface MonthSelectionProps extends IEditable<Dayjs>, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    selectedDate: Dayjs;
}

export function MonthSelection(props: MonthSelectionProps): JSX.Element {
    const renderMonth = (month: string, index: number) => {
        const isSelected = props.selectedDate.year() === props.value.year() && month === props.selectedDate.format('MMM');
        return (
            <div
                key={ month }
                className={ cx(isSelected && uuiMonthSelection.currentMonth, uuiMonthSelection.month) }
                onClick={ () => props.onValueChange(props.value.month(index)) }
            >
                {month}
            </div>
        );
    };
    const MONTHS_SHORT_ARRAY = uuiDayjs.dayjs.monthsShort();
    return (
        <div
            ref={ props.forwardedRef }
            className={ cx(css.container, uuiMonthSelection.container, props.cx) }
            { ...props.rawProps }
        >
            <div className={ uuiMonthSelection.content }>
                <div className={ uuiMonthSelection.monthContainer }>
                    {arrayToMatrix(MONTHS_SHORT_ARRAY, MONTH_ROW_LENGTH).map((monthsRow, index) => (
                        <div key={ index } className={ uuiMonthSelection.monthsRow }>
                            {monthsRow.map((month) => {
                                const monthIndex = MONTHS_SHORT_ARRAY.findIndex((it) => it === month);
                                return renderMonth(month, monthIndex);
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
