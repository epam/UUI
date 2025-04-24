import React, { forwardRef, useState, type JSX } from 'react';
import cx from 'classnames';
import type { IControlled, RangeDatePickerPresets, DayProps, RangeDatePickerInputType, RangeDatePickerValue } from '@epam/uui-core';
import { uuiDaySelection, Day } from '@epam/uui-components';
import { FlexCell, FlexRow } from '../layout';
import { CalendarPresets } from './CalendarPresets';
import { StatelessDatePickerBody, StatelessDatePickerBodyValue } from './DatePickerBody';

import type { Dayjs } from '../../helpers/dayJsHelper';
import { uuiDayjs } from '../../helpers/dayJsHelper';
import {
    defaultRangeValue, getMonthOnOpen, getWithFrom, getWithTo, uuiDatePickerBodyBase, valueFormat,
} from './helpers';
import type {
    CommonDatePickerBodyProps,
} from './types';

import css from './RangeDatePickerBody.module.scss';

export const uuiRangeDatePickerBody = {
    inRange: 'uui-range-datepicker-in-range',
    firstDayInRangeWrapper: 'uui-range-datepicker-first-day-in-range-wrapper',
    lastDayInRangeWrapper: 'uui-range-datepicker-last-day-in-range-wrapper',
    separator: 'uui-range-datepicker-separator',
};

export const rangeDatePickerPresets: RangeDatePickerPresets = {
    today: {
        name: 'Today',
        getRange: () => ({
            from: uuiDayjs.dayjs().toString(),
            to: undefined,
            order: 1,
        }),
    },
    thisWeek: {
        name: 'This Week',
        getRange: () => ({
            from: uuiDayjs.dayjs().startOf('isoWeek').toString(),
            to: uuiDayjs.dayjs().endOf('isoWeek').toString(),
            order: 2,
        }),
    },
    lastWeek: {
        name: 'Last Week',
        getRange: () => ({
            from: uuiDayjs.dayjs().startOf('isoWeek').subtract(1, 'week').toString(),
            to: uuiDayjs.dayjs().endOf('isoWeek').subtract(1, 'week').toString(),
            order: 3,
        }),
    },
    thisMonth: {
        name: 'This Month',
        getRange: () => ({
            from: uuiDayjs.dayjs().startOf('month').toString(),
            to: uuiDayjs.dayjs().endOf('month').toString(),
            order: 4,
        }),
    },
    lastMonth: {
        name: 'Last Month',
        getRange: () => ({
            from: uuiDayjs.dayjs().startOf('month').subtract(1, 'month').toString(),
            to: uuiDayjs.dayjs().subtract(1, 'month').endOf('month').toString(),
            order: 5,
        }),
    },
    last3Month: {
        name: 'Last 3 Months',
        getRange: () => ({
            from: uuiDayjs.dayjs().startOf('month').subtract(3, 'month').toString(),
            to: uuiDayjs.dayjs().subtract(1, 'month').endOf('month').toString(),
            order: 5,
        }),
    },
    thisYear: {
        name: 'This Year',
        getRange: () => ({
            from: uuiDayjs.dayjs().startOf('year').toString(),
            to: uuiDayjs.dayjs().endOf('year').toString(),
            order: 7,
        }),
    },
    lastYear: {
        name: 'Last Year',
        getRange: () => ({
            from: uuiDayjs.dayjs().startOf('year').subtract(1, 'year').toString(),
            to: uuiDayjs.dayjs().subtract(1, 'year').endOf('year').toString(),
            order: 8,
        }),
    },
};

export type ViewType = 'DAY_SELECTION' | 'MONTH_SELECTION' | 'YEAR_SELECTION';

/**
 * Represents date picker body value
 */
export interface RangeDatePickerBodyValue<TSelection> {
    /**
     * Currently setting date
     */
    inFocus: RangeDatePickerInputType;
    /**
     * Date currently set
     */
    selectedDate: TSelection;
}

export interface RangeDatePickerBodyProps<T> extends CommonDatePickerBodyProps, IControlled<RangeDatePickerBodyValue<T>> {
    renderFooter?(): React.ReactNode;
    isHoliday?: (day: Dayjs) => boolean;
}

export const RangeDatePickerBody = forwardRef(RangeDatePickerBodyComp);

function RangeDatePickerBodyComp(props: RangeDatePickerBodyProps<RangeDatePickerValue | null>, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element {
    const { value: _value, filter } = props;
    const {
        selectedDate: _selectedDate, inFocus,
    } = _value;
    const selectedDate = _selectedDate || defaultRangeValue; // also handles null in comparison to default value

    const [activeMonth, setActiveMonth] = useState<RangeDatePickerInputType>(inFocus);
    const [view, setView] = useState<ViewType>('DAY_SELECTION');
    const [month, setMonth] = useState(() => {
        return getMonthOnOpen(selectedDate, inFocus);
    });

    const getRange = (newValue: string | null) => {
        if (!filter || filter(uuiDayjs.dayjs(newValue))) {
            if (inFocus === 'from') {
                return getWithFrom(selectedDate, newValue);
            }
            if (inFocus === 'to') {
                return getWithTo(selectedDate, newValue);
            }
        }
    };

    const onBodyValueChange = (v: string | null, part: 'from' | 'to') => {
        // selectedDate can be null, other params should always have values
        const newRange = v ? getRange(v) : selectedDate;

        let newInFocus: RangeDatePickerInputType = null;
        const fromChanged = selectedDate.from !== newRange?.from;
        const toChanged = selectedDate.to !== newRange?.to;
        if (inFocus === 'from' && fromChanged) {
            newInFocus = 'to';
        } else if (inFocus === 'to' && toChanged) {
            newInFocus = 'from';
        }

        setActiveMonth(part);
        props.onValueChange({
            selectedDate: newRange ? newRange : selectedDate,
            inFocus: newInFocus ?? inFocus,
        });
    };

    const renderDay = (renderProps: DayProps): JSX.Element => {
        return (
            <Day
                { ...renderProps }
                cx={ getDayCX(renderProps.value, selectedDate) }
            />
        );
    };

    const from: StatelessDatePickerBodyValue<string> = {
        month,
        view: activeMonth === 'from' ? view : 'DAY_SELECTION',
        value: null,
    };

    const to: StatelessDatePickerBodyValue<string> = {
        view: activeMonth === 'to' ? view : 'DAY_SELECTION',
        month: month.add(1, 'month'),
        value: null,
    };

    const renderPresets = (presets: RangeDatePickerPresets) => {
        return (
            <React.Fragment>
                <div className={ uuiRangeDatePickerBody.separator } />
                <CalendarPresets
                    onPresetSet={ (presetVal) => {
                        // enable day if smth other were selected
                        setView('DAY_SELECTION');
                        setMonth(uuiDayjs.dayjs(presetVal.from));
                        props.onValueChange({
                            inFocus: props.value.inFocus,
                            selectedDate: {
                                from: uuiDayjs.dayjs(presetVal.from).format(valueFormat),
                                to: uuiDayjs.dayjs(presetVal.to).format(valueFormat),
                            },
                        });
                    } }
                    presets={ presets }
                />
            </React.Fragment>
        );
    };

    return (
        <div
            ref={ ref }
            className={ cx(css.root, uuiDatePickerBodyBase.container, props.cx) }
            { ...props.rawProps }
        >
            <FlexRow
                cx={ [view === 'DAY_SELECTION' && css.daySelection, css.container] }
                alignItems="top"
            >
                <FlexCell width="auto">
                    <FlexRow>
                        <FlexRow
                            cx={ css.bodesWrapper }
                            alignItems="top"
                        >
                            <StatelessDatePickerBody
                                key="date-picker-body-left"
                                cx={ cx(css.fromPicker) }
                                { ...from }
                                onValueChange={ (v) => onBodyValueChange(v, 'from') }
                                onMonthChange={ (m) => {
                                    setMonth(m);
                                } }
                                onViewChange={ (v) => setView(v) }
                                filter={ props.filter }
                                isHoliday={ props.isHoliday }
                                renderDay={ props.renderDay || renderDay }
                                isDisabled={ view !== 'DAY_SELECTION' && activeMonth === 'to' }
                            />
                            <StatelessDatePickerBody
                                key="date-picker-body-right"
                                cx={ cx(css.toPicker) }
                                { ...to }
                                onValueChange={ (v) => onBodyValueChange(v, 'to') }
                                onMonthChange={ (m) => {
                                    setMonth(m.subtract(1, 'month'));
                                } }
                                onViewChange={ (v) => setView(v) }
                                filter={ props.filter }
                                renderDay={ props.renderDay || renderDay }
                                isHoliday={ props.isHoliday }
                                isDisabled={ view !== 'DAY_SELECTION' && activeMonth === 'from' }
                            />
                            {view !== 'DAY_SELECTION' && (
                                <div
                                    style={ {
                                        left: activeMonth === 'from' ? '50%' : undefined,
                                        right: activeMonth === 'to' ? '50%' : undefined,
                                    } }
                                    className={ css.blocker }
                                />
                            )}
                        </FlexRow>
                        {props.presets && renderPresets(props.presets)}
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
        ? uuiDayjs.dayjs(selectedDate.from).valueOf() : null;
    const toValue = selectedDate?.to
        ? uuiDayjs.dayjs(selectedDate.to).valueOf() : null;

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
