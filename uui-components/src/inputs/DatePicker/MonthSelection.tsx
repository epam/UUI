import * as React from 'react';
import { uuiDayjs } from '../../helpers/dayJsHelper';
import type { Dayjs } from '../../helpers/dayJsHelper';
import { IEditable, IHasCX, arrayToMatrix, cx, IHasRawProps, IHasForwardedRef } from '@epam/uui-core';

import css from './MonthSelection.module.scss';

import type { JSX } from 'react';

const MONTH_ROW_LENGTH = 3;

export const uuiMonthSelection = {
    container: 'uui-month_selection-container',
    content: 'uui-month_selection-content',
    monthContainer: 'uui-month_selection-month-container',
    monthsRow: 'uui-month_selection-months-row',
    month: 'uui-month_selection-month',
    currentMonth: 'uui-month_selection-current-month',
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
                tabIndex={ 0 }
                className={ cx(isSelected && uuiMonthSelection.currentMonth, uuiMonthSelection.month) }
                onClick={ () => props.onValueChange(props.value.month(index)) }
                onKeyDown={ (e) => { e.key === 'Enter' && props.onValueChange(props.value.month(index)); } }
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
