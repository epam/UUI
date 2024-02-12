import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import { arrayToMatrix, cx, DayProps, IEditable, RangeDatePickerInputType, RangeDatePickerPresets } from '@epam/uui-core';
import {
    DatePickerBodyBaseOptions, uuiDatePickerBodyBase, PickerBodyValue, uuiDaySelection, RangePickerBodyValue, Day
} from '@epam/uui-components';
import { FlexCell, FlexRow } from '../layout';
import { DatePickerBody } from './DatePickerBody';
import css from './RangeDatePickerBody.module.scss';

dayjs.extend(isoWeek);

export function weekCount(displayedDate: Dayjs) {
    let days: Dayjs[] = [];
    const dayOfLastWeekInPrevMonth = displayedDate.subtract(1, 'month').endOf('month').day();
    days = days.concat(new Array(dayOfLastWeekInPrevMonth).fill(undefined));
    // get days of current month
    days = days.concat(new Array(displayedDate.endOf('month').date()).fill(undefined));
    return arrayToMatrix(days, 7).length;
}

export const uuiRangeDatePickerBody = {
    inRange: 'uui-range-datepicker-in-range',
    firstDayInRangeWrapper: 'uui-range-datepicker-first-day-in-range-wrapper',
    lastDayInRangeWrapper: 'uui-range-datepicker-last-day-in-range-wrapper',
    separator: 'uui-range-datepicker-separator',
};

export type PickerPart = 'from' | 'to' | null;

export const rangeDatePickerPresets: RangeDatePickerPresets = {
    today: {
        name: 'Today',
        getRange: () => ({ from: dayjs().toString(), to: undefined, order: 1 }),
    },
    thisWeek: {
        name: 'This Week',
        getRange: () => ({ from: dayjs().startOf('isoWeek').toString(), to: dayjs().endOf('isoWeek').toString(), order: 2 }),
    },
    lastWeek: {
        name: 'Last Week',
        getRange: () => ({ from: dayjs().startOf('isoWeek').subtract(1, 'week').toString(), to: dayjs().endOf('isoWeek').subtract(1, 'week').toString(), order: 3 }),
    },
    thisMonth: {
        name: 'This Month',
        getRange: () => ({ from: dayjs().startOf('month').toString(), to: dayjs().endOf('month').toString(), order: 4 }),
    },
    lastMonth: {
        name: 'Last Month',
        getRange: () => ({ from: dayjs().startOf('month').subtract(1, 'month').toString(), to: dayjs().subtract(1, 'month').endOf('month').toString(), order: 5 }),
    },
    last3Month: {
        name: 'Last 3 Months',
        getRange: () => ({ from: dayjs().startOf('month').subtract(3, 'month').toString(), to: dayjs().subtract(1, 'month').endOf('month').toString(), order: 5 }),
    },
    thisYear: {
        name: 'This Year',
        getRange: () => ({ from: dayjs().startOf('year').toString(), to: dayjs().endOf('year').toString(), order: 7 }),
    },
    lastYear: {
        name: 'Last Year',
        getRange: () => ({ from: dayjs().startOf('year').subtract(1, 'year').toString(), to: dayjs().subtract(1, 'year').endOf('year').toString(), order: 8 }),
    },
};

export interface RangeDatePickerValue {
    /*
    * Defines DatePicker value 'from'.
    */
    from: string | null;
    /*
    * Defines DatePicker value 'to'.
    */
    to: string | null;
}

export interface RangeDatePickerBodyProps<T> extends DatePickerBodyBaseOptions, IEditable<RangePickerBodyValue<T>> {
    renderFooter?(): React.ReactNode;
    isHoliday?: (day: Dayjs) => boolean;
    renderHeader?: (props: IEditable<RangePickerBodyValue<string>>) => React.ReactNode; // Do we need this?
    renderPresets?: (props: RangeDatePickerPresets) => React.ReactNode;
}

export function RangeDatePickerBody(props: RangeDatePickerBodyProps<RangeDatePickerValue>): JSX.Element {
    const [activeMonth, setActiveMonth] = React.useState<RangeDatePickerInputType>(null);

    const getRange = (selectedDate: string) => {
        const newRange: RangeDatePickerValue = { from: null, to: null };
        const currentRange = props.value.selectedDate || { from: null, to: null };

        if (!props.filter || props.filter(dayjs(selectedDate))) {
            if (props.value.activePart === 'from') {
                if (dayjs(selectedDate).valueOf() <= dayjs(currentRange.to).valueOf()) {
                    newRange.from = selectedDate;
                    newRange.to = currentRange.to;
                } else {
                    newRange.from = selectedDate;
                    newRange.to = null;
                }
            }

            if (props.value.activePart === 'to') {
                if (!currentRange.from) {
                    newRange.to = selectedDate;
                } else if (dayjs(selectedDate).valueOf() >= dayjs(currentRange.from).valueOf()) {
                    newRange.from = currentRange.from;
                    newRange.to = selectedDate;
                } else {
                    newRange.from = selectedDate;
                    newRange.to = null;
                }
            }
        }

        return newRange;
    };

    const onBodyValueChange = (value: PickerBodyValue<string>, part: 'from' | 'to') => {
        let newValue: Partial<PickerBodyValue<RangeDatePickerValue>>;
        if (value.selectedDate) {
            const range = getRange(value.selectedDate);
            newValue = { ...newValue, selectedDate: range };
        }

        if (value.month) {
            newValue = {
                ...newValue,
                month: part === 'from' ? value.month : value.month.subtract(1, 'month'),
            };
        }

        if (value.view) {
            newValue = { ...newValue, view: value.view };
        }

        setActiveMonth(part);
        props.onValueChange({
            ...props.value,
            ...newValue,
        });
    };

    const renderDay = (renderProps: DayProps): JSX.Element => {
        return (
            <Day
                { ...renderProps }
                cx={ getDayCX(renderProps.value, props.value.selectedDate) }
            />
        );
    };

    const from: PickerBodyValue<string> = {
        ...props.value,
        view: activeMonth === 'from' ? props.value.view : 'DAY_SELECTION',
        selectedDate: null,
    };

    const to: PickerBodyValue<string> = {
        view: activeMonth === 'to' ? props.value.view : 'DAY_SELECTION',
        month: props.value.month.add(1, 'month'),
        selectedDate: null,
    };

    return (
        <div className={ cx(css.root, uuiDatePickerBodyBase.container, props.cx) } { ...props.rawProps }>
            <FlexRow
                cx={ [props.value.view === 'DAY_SELECTION' && css.daySelection, css.container] }
                alignItems="top"
            >
                <FlexCell width="auto">
                    <FlexRow>
                        <FlexRow cx={ css.bodesWrapper } alignItems="top">
                            <DatePickerBody
                                cx={ cx(css.fromPicker) }
                                value={ from }
                                onValueChange={ (v) => onBodyValueChange(v, 'from') }
                                filter={ props.filter }
                                isHoliday={ props.isHoliday }
                                renderDay={ props.renderDay || renderDay }
                            />
                            <DatePickerBody
                                cx={ cx(css.toPicker) }
                                value={ to }
                                onValueChange={ (v) => onBodyValueChange(v, 'to') }
                                filter={ props.filter }
                                renderDay={ props.renderDay || renderDay }
                                isHoliday={ props.isHoliday }
                            />
                            {props.value.view !== 'DAY_SELECTION' && (
                                <div
                                    style={ {
                                        left: activeMonth === 'from' ? '50%' : undefined,
                                        right: activeMonth === 'to' ? '50%' : undefined,
                                    } }
                                    className={ css.blocker }
                                />
                            )}
                        </FlexRow>
                        {props.presets && props.renderPresets && props.renderPresets(props.presets)}
                    </FlexRow>
                    {props.renderFooter && props.renderFooter()}
                </FlexCell>
            </FlexRow>
        </div>
    );
}

const getDayCX = (day: Dayjs, selectedDate: RangeDatePickerValue): string[] => {
    const dayValue = day.valueOf();
    const fromValue = selectedDate?.from
        ? dayjs(selectedDate.from).valueOf() : null;
    const toValue = selectedDate?.to
        ? dayjs(selectedDate.to).valueOf() : null;

    const inRange = fromValue
        && toValue
        && dayValue >= fromValue
        && dayValue <= toValue
        && fromValue !== toValue;
    const isFirst = dayValue === fromValue;
    const isLast = dayValue === toValue;

    return [cx(
        inRange && uuiRangeDatePickerBody.inRange,
        isFirst && uuiRangeDatePickerBody.firstDayInRangeWrapper,
        !inRange && isFirst && uuiRangeDatePickerBody.lastDayInRangeWrapper,
        isLast && uuiRangeDatePickerBody.lastDayInRangeWrapper,
        !inRange && isLast && uuiRangeDatePickerBody.firstDayInRangeWrapper,
        (dayValue === fromValue || dayValue === toValue) && uuiDaySelection.selectedDay,
    )];
};
