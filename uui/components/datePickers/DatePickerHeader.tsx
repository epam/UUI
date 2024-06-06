import * as React from 'react';
import { Icon, IHasCX } from '@epam/uui-core';
import cx from 'classnames';
import css from './DatePickerHeader.module.scss';
import { type Dayjs, uuiDayjs } from '../../helpers/dayJsHelper';
import { ReactComponent as LeftArrowIcon } from '@epam/assets/icons/navigation-chevron_left-outline.svg';
import { ReactComponent as RightArrowIcon } from '@epam/assets/icons/navigation-chevron_right-outline.svg';
import { Button } from '../buttons';
import { ViewType } from './types';
import {
    getPrevMonth, getPrevYear, getPrevYearsList, getNextMonth, getNextYear, getNextYearsList,
} from './helpers';

export const uuiHeader = {
    container: 'uui-datepickerheader-container',
    header: 'uui-datepickerheader-header',
    navTitle: 'uui-datepickerheader-nav-title',
    navIconRight: 'uui-datepickerheader-nav-icon-right',
    navIconLeft: 'uui-datepickerheader-nav-icon-left',
};

interface DatePickerHeaderValue {
    view: ViewType;
    month: Dayjs;
}

export interface DatePickerHeaderProps extends IHasCX {
    value: DatePickerHeaderValue;
    onValueChange: (value: DatePickerHeaderValue) => void;
    /*
     * Navigation icon for the left navigation icon in header.
     * Usually it has a default implementation in skins, so providing this is only necessary if you want to replace the default icon.
     */
    navIconLeft?: Icon;
    /*
     * Navigation icon for the right navigation icon in header.
     * Usually it has a default implementation in skins, so providing this is only necessary if you want to replace the default icon.
     */
    navIconRight?: Icon;
}

const isSoberYear = (value: Dayjs) => {
    return value.year() >= 1990 && value.year() <= 2099;
};

export function DatePickerHeader({
    navIconLeft, navIconRight, value: { month, view }, onValueChange,
}: DatePickerHeaderProps) {
    const onSetMonth = (newMonth: Dayjs) => {
        onValueChange({
            view,
            month: newMonth,
        });
    };

    const onSetView = (newView: ViewType) => {
        onValueChange({
            view: newView,
            month,
        });
    };

    const onLeftNavigationArrow = () => {
        switch (view) {
            case 'DAY_SELECTION':
                onSetMonth(getPrevMonth(month));
                break;
            case 'MONTH_SELECTION':
                onSetMonth(getPrevYear(month));
                break;
            case 'YEAR_SELECTION':
                onSetMonth(getPrevYearsList(month));
                break;
        }
    };

    const onRightNavigationArrow = () => {
        switch (view) {
            case 'DAY_SELECTION':
                onSetMonth(getNextMonth(month));
                break;
            case 'MONTH_SELECTION':
                onSetMonth(getNextYear(month));
                break;
            case 'YEAR_SELECTION':
                onSetMonth(getNextYearsList(month));
                break;
        }
    };

    const onCaptionClick = (newView: ViewType) => {
        let nextView: ViewType;
        switch (newView) {
            case 'DAY_SELECTION':
                nextView = 'MONTH_SELECTION';
                break;
            case 'MONTH_SELECTION':
                nextView = 'YEAR_SELECTION';
                break;
            case 'YEAR_SELECTION':
                nextView = 'DAY_SELECTION';
                break;
        }

        onSetView(nextView);
    };

    const title = React.useMemo(
        () => {
            const monthSubstr = view !== 'MONTH_SELECTION'
                ? uuiDayjs.dayjs.months()[month.month()]
                : '';
            return `${monthSubstr} ${month.year()}`;
        },
        [view, month],
    );

    const disablePrev = view === 'YEAR_SELECTION' && !isSoberYear(getPrevYearsList(month));
    const disableNext = view === 'YEAR_SELECTION' && !isSoberYear(getNextYearsList(month));

    return (
        <div className={ cx(css.container, uuiHeader.container, cx) }>
            <header className={ uuiHeader.header }>
                <Button
                    icon={ navIconLeft || LeftArrowIcon }
                    color="secondary"
                    fill="ghost"
                    cx={ uuiHeader.navIconLeft }
                    onClick={ () => onLeftNavigationArrow() }
                    isDisabled={ disablePrev }
                />
                <Button
                    caption={ title }
                    fill="ghost"
                    cx={ uuiHeader.navTitle }
                    onClick={ () => onCaptionClick(view) }
                />
                <Button
                    icon={ navIconRight || RightArrowIcon }
                    color="secondary"
                    fill="ghost"
                    cx={ uuiHeader.navIconRight }
                    onClick={ () => onRightNavigationArrow() }
                    isDisabled={ disableNext }
                />
            </header>
        </div>
    );
}
