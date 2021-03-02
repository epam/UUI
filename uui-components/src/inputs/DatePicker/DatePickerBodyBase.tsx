import * as React from 'react';
import cx from 'classnames';
import moment from 'moment';
import { IEditable, IHasCX, Icon } from '@epam/uui';
import { Presets } from './CalendarPresets';

export type ViewType = 'DAY_SELECTION' | 'MONTH_SELECTION' | 'YEAR_SELECTION';

export const defaultFormat = 'MMM D, YYYY';
export const valueFormat = 'YYYY-MM-DD';

export const uuiDatePickerBodyBase = {
    container: 'uui-datepicker-container',
};

export interface DatePickerBodyBaseOptions extends IHasCX {
    filter?(day: moment.Moment): boolean;
    changeIsOpen?(newValue: boolean): void;
    presets?: Presets;
    renderDay?: (day: moment.Moment, onDayClick: (day: moment.Moment) => void) => React.ReactElement<Element>;
    navIconLeft?: Icon;
    navIconRight?: Icon;
}

export interface DatePickerBodyBaseProps<TSelection> extends DatePickerBodyBaseOptions {
    value: PickerBodyValue<TSelection>;
    setSelectedDate: (newDate: TSelection) => void;
    setDisplayedDateAndView: (displayedDate: moment.Moment, view: ViewType) => void;
}

export interface PickerBodyValue<TSelection> {
    selectedDate: TSelection | null;
    displayedDate: moment.Moment;
    view: ViewType;
}

export abstract class DatePickerBodyBase<TSelection, TProps> extends React.Component<DatePickerBodyBaseProps<TSelection> & TProps> {
    abstract renderDatePicker: () => React.ReactElement<Element>;

    onMonthClick = (newDate: moment.Moment) => {
        this.props.setDisplayedDateAndView(newDate, 'DAY_SELECTION');
    }

    onYearClick = (newDate: moment.Moment) => {
        this.props.setDisplayedDateAndView(newDate, 'MONTH_SELECTION');
    }

    render() {
        return (
            <div className={ cx(uuiDatePickerBodyBase.container, this.props.cx) }>
                { this.renderDatePicker() }
            </div>
        );
    }
}
