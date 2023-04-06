import * as React from 'react';
import { IconContainer } from '../../layout';
import { Icon, IEditable, IHasCX } from '@epam/uui-core';
import cx from 'classnames';
import css from './DatePickerHeader.scss';
import dayjs, { Dayjs } from "dayjs";
import { PickerBodyValue, ViewType } from './DatePickerBodyBase';

export const uuiHeader = {
    container: 'uui-datepickerheader-container',
    header: 'uui-datepickerheader-header',
    navTitle: 'uui-datepickerheader-nav-title',
    navIconRight: 'uui-datepickerheader-nav-icon-right',
    navIconLeft: 'uui-datepickerheader-nav-icon-left',
};

export interface DatePickerHeaderProps extends IEditable<PickerBodyValue<string>>, IHasCX {
    navIconLeft?: Icon;
    navIconRight?: Icon;
}

export class DatePickerHeader extends React.Component<DatePickerHeaderProps, any> {
    getPrevMonthFromCurrent = (currentDate: Dayjs) => {
        return currentDate.subtract(1, 'month');
    }

    getNextMonthFromCurrent = (currentDate: Dayjs) => {
        return currentDate.add(1, 'month');
    }

    getPrevYearFromCurrent = (currentDate: Dayjs) => {
        return currentDate.subtract(1, 'year');
    }

    getNextYearFromCurrent = (currentDate: Dayjs) => {
        return currentDate.add(1, 'year');
    }

    getPrevListYearFromCurrent = (currentDate: Dayjs) => {
        return currentDate.subtract(16, 'year');
    }

    getNextListYearFromCurrent = (currentDate: Dayjs) => {
        return currentDate.add(16, 'year');
    }

    onLeftNavigationArrow = () => {
        switch (this.props.value.view) {
            case 'DAY_SELECTION': this.props.onValueChange({ ...this.props.value, displayedDate: this.getPrevMonthFromCurrent(this.props.value.displayedDate) }); break;
            case 'MONTH_SELECTION': this.props.onValueChange({ ...this.props.value, displayedDate: this.getPrevYearFromCurrent(this.props.value.displayedDate) }); break;
            case 'YEAR_SELECTION': this.props.onValueChange({ ...this.props.value, displayedDate: this.getPrevListYearFromCurrent(this.props.value.displayedDate) }); break;
        }
    }

    onRightNavigationArrow = () => {
        switch (this.props.value.view) {
            case 'DAY_SELECTION': this.props.onValueChange({ ...this.props.value, displayedDate: this.getNextMonthFromCurrent(this.props.value.displayedDate) }); break;
            case 'MONTH_SELECTION': this.props.onValueChange({ ...this.props.value, displayedDate: this.getNextYearFromCurrent(this.props.value.displayedDate) }); break;
            case 'YEAR_SELECTION': this.props.onValueChange({ ...this.props.value, displayedDate: this.getNextListYearFromCurrent(this.props.value.displayedDate) }); break;
        }
    }

    onCaptionClick = (view: ViewType) => {
        let nextView: ViewType;
        switch (view) {
            case 'DAY_SELECTION': nextView = 'MONTH_SELECTION'; break;
            case 'MONTH_SELECTION': nextView = 'YEAR_SELECTION'; break;
            case 'YEAR_SELECTION': nextView = 'DAY_SELECTION'; break;
        }

        this.props.onValueChange({
            ...this.props.value,
            view: nextView,
        });
    }

    render() {
        return (
            <div className={ cx(css.container, uuiHeader.container, this.props.cx) }>
                <header className={ uuiHeader.header }>
                    <IconContainer cx={ uuiHeader.navIconLeft } icon={ this.props.navIconLeft } onClick={ () => this.onLeftNavigationArrow() } />
                    <div
                        onClick={ () => this.onCaptionClick(this.props.value.view) }
                        className={ uuiHeader.navTitle }
                        tabIndex={ 0 }
                    >
                        { `${this.props.value?.view !== 'MONTH_SELECTION' ? dayjs.months()[this.props.value?.displayedDate.month()] : ''} ${this.props.value?.displayedDate.year()}` }
                    </div>
                    <IconContainer cx={ uuiHeader.navIconRight } icon={ this.props.navIconRight } onClick={ () => this.onRightNavigationArrow() } />
                </header>
            </div>
        );
    }
}
