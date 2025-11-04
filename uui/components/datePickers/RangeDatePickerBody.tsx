import React, { forwardRef, useState, type JSX } from 'react';
import cx from 'classnames';
import {
    IControlled,
    RangeDatePickerPresets,
    DayProps,
    RangeDatePickerInputType,
    RangeDatePickerValue,
    RangeDatePickerProps, useLayoutEffectSafeForSsr,
} from '@epam/uui-core';
import { uuiDaySelection, Day } from '@epam/uui-components';
import { FlexCell, FlexRow } from '../layout';
import { CalendarPresets } from './CalendarPresets';
import { StatelessDatePickerBody, StatelessDatePickerBodyValue } from './DatePickerBody';

import type { Dayjs } from '../../helpers/dayJsHelper';
import { uuiDayjs } from '../../helpers/dayJsHelper';
import {
    defaultRangeValue, getDisplayedMonth, getWithFrom, getWithTo, uuiDatePickerBodyBase, valueFormat,
} from './helpers';
import type { CommonDatePickerBodyProps, ViewType } from './types';

import css from './RangeDatePickerBody.module.scss';

export const uuiRangeDatePickerBody = {
    inRange: 'uui-range-datepicker-in-range',
    firstDayInRangeWrapper: 'uui-range-datepicker-first-day-in-range-wrapper',
    lastDayInRangeWrapper: 'uui-range-datepicker-last-day-in-range-wrapper',
    separator: 'uui-range-datepicker-separator',
} as const;

export const rangeDatePickerPresets: RangeDatePickerPresets = {
    today: {
        name: 'Today',
        getRange: () => ({
            from: uuiDayjs.dayjs().toString(),
            to: uuiDayjs.dayjs().toString(),
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
            order: 6,
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

interface DayState {
    inRange: boolean;
    isFirst: boolean;
    isLast: boolean;
}

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

export interface RangeDatePickerBodyProps<T> extends CommonDatePickerBodyProps, Pick<RangeDatePickerProps, 'preventEmptyToDate' | 'preventEmptyFromDate' | 'preselectedViewDate'>, IControlled<RangeDatePickerBodyValue<T>> {
    renderFooter?(): React.ReactNode;
    isHoliday?: (day: Dayjs) => boolean;
}

export const RangeDatePickerBody = forwardRef(RangeDatePickerBodyComp);

const getPreselectedViewDate = (selectedDate: RangeDatePickerValue, preselectedViewDate: string | undefined): RangeDatePickerValue => {
    return selectedDate.from || selectedDate.to ? selectedDate : {
        from: preselectedViewDate || null,
        to: null,
    };
};

function RangeDatePickerBodyComp(props: RangeDatePickerBodyProps<RangeDatePickerValue | null>, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element {
    const { value: _value, filter, preselectedViewDate: _preselectedViewDate } = props;
    const {
        selectedDate: _selectedDate, inFocus,
    } = _value;
    const selectedDate = _selectedDate || defaultRangeValue; // also handles null in comparison to default value
    const preselectedViewDate = getPreselectedViewDate(selectedDate, _preselectedViewDate);

    const [view, setView] = useState<ViewType>('DAY_SELECTION');
    const [disabledPanel, setDisabledPanel] = useState<'left' | 'right' | null>(null);
    const [month, setMonth] = useState(() => {
        return getDisplayedMonth(preselectedViewDate, inFocus);
    });

    const getRange = (newValue: string | null) => {
        if (!filter || filter(uuiDayjs.dayjs(newValue))) {
            if (inFocus === 'from') {
                return getWithFrom(selectedDate, newValue, props.preventEmptyFromDate);
            }
            if (inFocus === 'to') {
                return getWithTo(selectedDate, newValue, props.preventEmptyToDate);
            }
        }
    };

    const onBodyValueChange = (v: string | null) => {
        // selectedDate can be null, other params should always have values
        const newRange = v ? getRange(v) : selectedDate;

        let newInFocus: RangeDatePickerInputType = null;
        const fromChanged = selectedDate.from !== newRange?.from;
        const toChanged = selectedDate.to !== newRange?.to;
        if (inFocus === 'from' && fromChanged) {
            newInFocus = 'to';
        } else if (inFocus === 'to' && toChanged && !fromChanged) { // for the case when we change the value "to" less than the value "from" and do not want to get stuck on the focus "from"
            newInFocus = 'from';
        }

        props.onValueChange({
            selectedDate: newRange ? newRange : selectedDate,
            inFocus: newInFocus ?? inFocus,
        });
    };

    const renderDay = (renderProps: DayProps): JSX.Element => {
        const { inRange, isFirst, isLast } = getDayState(renderProps.value, selectedDate);
        return (
            <Day
                { ...renderProps }
                cx={ getDayCX({ inRange, isFirst, isLast }) }
                rawProps={ {
                    ...renderProps.rawProps,
                    'aria-selected': (isFirst || isLast || inRange) ? 'true' : undefined,
                } }
            />
        );
    };

    const from: StatelessDatePickerBodyValue<string> = {
        month,
        view: disabledPanel === 'right' ? view : 'DAY_SELECTION',
        value: null,
    };

    const to: StatelessDatePickerBodyValue<string> = {
        view: disabledPanel === 'left' ? view : 'DAY_SELECTION',
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
                        setDisabledPanel(null);
                        setMonth(uuiDayjs.dayjs(presetVal.from));
                        props.onValueChange({
                            inFocus: props.value.inFocus,
                            selectedDate: {
                                from: presetVal.from ? uuiDayjs.dayjs(presetVal.from).format(valueFormat) : undefined,
                                to: presetVal.to ? uuiDayjs.dayjs(presetVal.to).format(valueFormat) : undefined,
                            },
                        });
                    } }
                    presets={ presets }
                />
            </React.Fragment>
        );
    };

    useLayoutEffectSafeForSsr(() => {
        const monthToSet = getDisplayedMonth(preselectedViewDate, inFocus);
        // To avoid re-rendering the body if the current month being displayed is equal to or greater than 1
        const shouldNotIgnoreUpdate = !(uuiDayjs.dayjs(month).isSame(monthToSet, 'month') || uuiDayjs.dayjs(month).add(1, 'month').isSame(monthToSet, 'month'));
        if (shouldNotIgnoreUpdate) {
            setMonth(monthToSet);
        }
    }, [selectedDate]);

    return (
        <div
            ref={ ref }
            className={ cx(css.root, uuiDatePickerBodyBase.container, props.cx) }
            { ...props.rawProps }
            aria-multiselectable="true"
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
                                onValueChange={ (v) => onBodyValueChange(v) }
                                onMonthChange={ (m) => {
                                    setMonth(m);
                                } }
                                onViewChange={ (v) => {
                                    setView(v);
                                    setDisabledPanel(v !== 'DAY_SELECTION' ? 'right' : null);
                                } }
                                filter={ props.filter }
                                isHoliday={ props.isHoliday }
                                renderDay={ props.renderDay || renderDay }
                                isDisabled={ disabledPanel === 'left' }
                            />
                            <StatelessDatePickerBody
                                key="date-picker-body-right"
                                cx={ cx(css.toPicker) }
                                { ...to }
                                onValueChange={ (v) => onBodyValueChange(v) }
                                onMonthChange={ (m) => {
                                    setMonth(m.subtract(1, 'month'));
                                } }
                                onViewChange={ (v) => {
                                    setView(v);
                                    setDisabledPanel(v !== 'DAY_SELECTION' ? 'left' : null);
                                } }
                                filter={ props.filter }
                                renderDay={ props.renderDay || renderDay }
                                isHoliday={ props.isHoliday }
                                isDisabled={ disabledPanel === 'right' }
                            />
                            {view !== 'DAY_SELECTION' && (
                                <div
                                    style={ {
                                        left: disabledPanel === 'right' ? '50%' : undefined,
                                        right: disabledPanel === 'left' ? '50%' : undefined,
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

const getDayCX = ({ inRange, isFirst, isLast }: DayState): string[] => {
    return [
        cx(
            inRange && uuiRangeDatePickerBody.inRange,
            isFirst && uuiRangeDatePickerBody.firstDayInRangeWrapper,
            !inRange && isFirst && uuiRangeDatePickerBody.lastDayInRangeWrapper,
            isLast && uuiRangeDatePickerBody.lastDayInRangeWrapper,
            !inRange && isLast && uuiRangeDatePickerBody.firstDayInRangeWrapper,
            (isFirst || isLast) && uuiDaySelection.selectedDay,
        ),
    ];
};

const getDayState = (day: Dayjs, selectedDate: RangeDatePickerValue): DayState => {
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

    return {
        inRange,
        isFirst,
        isLast,
    };
};
