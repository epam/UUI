import * as React from 'react';
import cx from 'classnames';
import moment from 'moment';
import { DatePickerBodyBaseOptions, uuiDatePickerBodyBase, PickerBodyValue, valueFormat, ViewType } from './DatePickerBodyBase';
import { uuiDaySelection } from './Calendar';
import { FlexCell, FlexRow } from '../../layout';
import { DatePickerBody } from './DatePickerBody';
import * as css from './RangeDatePickerBody.scss';
import { CalendarPresets, Presets } from './CalendarPresets';
import { arrayToMatrix } from '@epam/uui';
import { IEditable } from '@epam/uui';

export function weekCount(displayedDate: moment.Moment) {
    let days: any[] = [];
    const dayOfLastWeekInPrevMonth = moment(displayedDate).subtract(1, 'months').endOf('month').day();
    days = days.concat(new Array(dayOfLastWeekInPrevMonth).fill(undefined));
    // get days of current month
    days = days.concat(new Array(moment(displayedDate).endOf('month').date()).fill(undefined));
    return arrayToMatrix(days, 7).length;
}

const uuiRangeDatePickerBody = {
    inRange: 'uui-range-datepicker-in-range',
    firstDayInRangeWrapper: 'uui-range-datepicker-first-day-in-range-wrapper',
    lastDayInRangeWrapper: 'uui-range-datepicker-last-day-in-range-wrapper',
    separator: 'uui-range-datepicker-separator',
};

export type pickerPart = 'from' | 'to';

export const rangeDatePickerPresets: Presets = {
    today: {
        name: 'Today',
        getRange: () => ({ from: moment().toString(), to: undefined, order: 1 }),
    },
    thisWeek: {
        name: 'This Week',
        getRange: () => ({ from: moment().startOf('isoWeek').toString(), to: moment().endOf('isoWeek').toString(), order: 2 }),
    },
    lastWeek: {
        name: 'Last Week',
        getRange: () => ({ from: moment().startOf('isoWeek').subtract(1, 'week').toString(), to: moment().endOf('isoWeek').subtract(1, 'week').toString(), order: 3 }),
    },
    thisMonth: {
        name: 'This Month',
        getRange: () => ({ from: moment().startOf('month').toString(), to: moment().endOf('month').toString(), order: 4 }),
    },
    lastMonth: {
        name: 'Last Month',
        getRange: () => ({ from: moment().startOf('month').subtract(1, 'month').toString(), to: moment().subtract(1, 'month').endOf('month').toString(), order: 5 }),
    },
    last3Month: {
        name: 'Last 3 Months',
        getRange: () => ({ from: moment().startOf('month').subtract(3, 'month').toString(), to: moment().subtract(1, 'month').endOf('month').toString(), order: 5 }),
    },
    thisYear: {
        name: 'This Year',
        getRange: () => ({ from: moment().startOf('year').toString(), to: moment().endOf('year').toString(), order: 7 }),
    },
    lastYear: {
        name: 'Last Year',
        getRange: () => ({ from: moment().startOf('year').subtract(1, 'year').toString(), to: moment().subtract(1, 'year').endOf('year').toString(), order: 8 }),
    },
};

export interface RangeDatePickerValue {
    from: string | null;
    to: string | null;
}

interface RangeDatePickerBodyState {
    activePart: pickerPart;
    height: number;
}

type InputType = 'from' | 'to';

export interface RangeDatePickerBodyProps<T> extends DatePickerBodyBaseOptions, IEditable<PickerBodyValue<T>> {
    focusPart: InputType;
    renderFooter?(): React.ReactNode;
    isHoliday?: (day: moment.Moment) => boolean;
}

export class RangeDatePickerBody extends React.Component<RangeDatePickerBodyProps<RangeDatePickerValue>, RangeDatePickerBodyState> {
    state: RangeDatePickerBodyState = {
        activePart: null,
        height: null,
    };

    componentDidMount() {
        this.getContainerHeight(this.props.value.displayedDate);
    }

    getDayCX = (day: moment.Moment) => {
        const dayValue = day.valueOf();
        const fromValue = this.props.value?.selectedDate.from ? moment(this.props.value.selectedDate.from).valueOf() : null;
        const toValue = this.props.value?.selectedDate.to ? moment(this.props.value.selectedDate.to).valueOf() : null;

        const inRange = dayValue >= fromValue && dayValue <= toValue && fromValue !== toValue && fromValue && toValue;
        const isFirst = dayValue === fromValue;
        const isLast = dayValue === toValue;

        return [
            inRange && uuiRangeDatePickerBody.inRange,
            isFirst && uuiRangeDatePickerBody.firstDayInRangeWrapper,
            !inRange && isFirst && uuiRangeDatePickerBody.lastDayInRangeWrapper,
            isLast && uuiRangeDatePickerBody.lastDayInRangeWrapper,
            !inRange && isLast && uuiRangeDatePickerBody.firstDayInRangeWrapper,
            (dayValue === fromValue || dayValue === toValue) && uuiDaySelection.selectedDay,
        ];
    }

    getRange(selectedDate: string) {
        const newRange: RangeDatePickerValue = { from: null, to: null };
        const currentRange = this.props.value.selectedDate;
        if (!this.props.filter || this.props.filter(moment(selectedDate))) {
            if (this.props.focusPart === 'from') {
                if (moment(selectedDate).valueOf() <= moment(currentRange.to).valueOf()) {
                    newRange.from = selectedDate;
                    newRange.to = currentRange.to;
                } else {
                    newRange.from = selectedDate;
                    newRange.to = null;
                }
            }

            if (this.props.focusPart === 'to') {
                if (!currentRange.from) {
                    newRange.to = selectedDate;
                } else if (moment(selectedDate).valueOf() >= moment(currentRange.from).valueOf()) {
                    newRange.from = currentRange.from;
                    newRange.to = selectedDate;
                } else {
                    newRange.from = selectedDate;
                    newRange.to = null;
                }
            }
        }

        return newRange;
    }

    setSelectedDate(selectedDate: string) {
        const range = this.getRange(selectedDate);

        this.props.onValueChange({
            ...this.props.value,
            selectedDate: range,
        });

        if (range.from && range.to && this.props.focusPart === 'to') {
            this.props.changeIsOpen(false);
        }
    }

    setDisplayedDateAndView(displayedDate: moment.Moment, view: ViewType, part: pickerPart) {
        this.setState({ activePart: part });

        this.props.onValueChange({
            selectedDate: this.props.value.selectedDate,
            displayedDate: part === 'from' ? displayedDate : moment(displayedDate).subtract(1, 'months'),
            view: view,
        });
        this.getContainerHeight(part === 'from' ? displayedDate : moment(displayedDate).subtract(1, 'months'));
    }
    // activePart для перехода в режимы выбора месяца и года, чтобы ховерить противоположную часть

    getContainerHeight = (displayedDate: moment.Moment) => {
        let numberWeeksOfFirstMonth = weekCount(displayedDate);
        let numberWeeksOfSecondMonth = weekCount(moment(displayedDate).add(1, 'month'));
        let height;

        if (numberWeeksOfFirstMonth > numberWeeksOfSecondMonth) {
            //
            height = 96 + (36 * numberWeeksOfFirstMonth);
        } else if (numberWeeksOfFirstMonth === numberWeeksOfSecondMonth) {
            height = 96 + (36 * numberWeeksOfFirstMonth);
        } else {
            height = 96 + (36 * numberWeeksOfSecondMonth);
        }
        if (height !== this.state.height) {
            this.setState({ ...this.state, height: height });
        }
    }

    getFromValue = (): PickerBodyValue<string> => {
        return {
            ...this.props.value,
            view: this.state.activePart === 'from' ? this.props.value.view : 'DAY_SELECTION',
            selectedDate: this.props.value?.selectedDate.from,
        };
    }

    getToValue = (): PickerBodyValue<string> => {
        return {
            ...this.props.value,
            view: this.state.activePart === 'to' ? this.props.value.view : 'DAY_SELECTION',
            displayedDate: moment(this.props.value?.displayedDate).add(1, 'months'),
            selectedDate: this.props.value?.selectedDate.to,
        };
    }

    renderPresets = () => {
        return (
            <>
                <div className={ uuiRangeDatePickerBody.separator } />
                <CalendarPresets
                    onPresetSet={ (presetVal) => {
                        this.props.onValueChange({
                            view: 'DAY_SELECTION',
                            selectedDate: { from: moment(presetVal.from).format(valueFormat), to: moment(presetVal.to).format(valueFormat) },
                            displayedDate: moment(presetVal.from),
                        });
                        this.props.changeIsOpen(false);
                    } }
                    presets={ this.props.presets }
                />
            </>
        );
    }

    renderDatePicker = () => {
        return (
            <FlexRow cx={ [this.props.value?.view == 'DAY_SELECTION' && css.daySelection, css.container] }>
                <FlexRow cx={ css.pickerWrapper } >
                    <FlexCell width='auto' >
                        <FlexRow cx={ css.bodesWrapper } alignItems='top' rawProps={ this.state.height ? { style: { 'height': `${ this.state.height }px` } } : null }>
                            <DatePickerBody
                                cx={ cx(css.fromPicker) }
                                setSelectedDate={ nv => this.setSelectedDate(nv) }
                                value={ this.getFromValue() }
                                setDisplayedDateAndView={ (displayedDate, view) => this.setDisplayedDateAndView(displayedDate, view, 'from') }
                                getDayCX={ this.getDayCX }
                                filter={ this.props.filter }
                                navIconLeft={ this.props.navIconLeft }
                                navIconRight={ this.props.navIconRight }
                                renderDay={ this.props.renderDay }
                                isHoliday={ this.props.isHoliday }
                            />
                            <DatePickerBody
                                cx={ cx(css.toPicker) }
                                setSelectedDate={ nv => this.setSelectedDate(nv) }
                                value={ this.getToValue() }
                                setDisplayedDateAndView={ (displayedDate, view) => this.setDisplayedDateAndView(displayedDate, view, 'to') }
                                getDayCX={ this.getDayCX }
                                filter={ this.props.filter }
                                navIconLeft={ this.props.navIconLeft }
                                navIconRight={ this.props.navIconRight }
                                renderDay={ this.props.renderDay }
                                isHoliday={ this.props.isHoliday }
                            />
                        </FlexRow>
                        { this.props.value?.view !== 'DAY_SELECTION' &&
                        <div
                            style={ {
                                left: this.state.activePart === 'from' && '50%',
                                right: this.state.activePart === 'to' && '50%',
                            } }
                            className={ css.blocker }
                        />
                        }
                        { this.props.renderFooter && this.props.renderFooter() }
                    </FlexCell>
                </FlexRow>
                { this.props.presets && this.renderPresets() }
            </FlexRow>
        );
    }

    render() {
        return (
            <div className={ cx(uuiDatePickerBodyBase.container, this.props.cx) }>
                { this.renderDatePicker() }
            </div>
        );
    }
}
