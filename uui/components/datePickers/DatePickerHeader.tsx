import * as React from 'react';
import { Icon, IEditable, IHasCX } from '@epam/uui-core';
import cx from 'classnames';
import css from './DatePickerHeader.module.scss';
import dayjs, { Dayjs } from 'dayjs';
import { PickerBodyValue, ViewType } from '@epam/uui-components';
import { ReactComponent as LeftArrowIcon } from '@epam/assets/icons/common/navigation-chevron-left-18.svg';
import { ReactComponent as RightArrowIcon } from '@epam/assets/icons/common/navigation-chevron-right-18.svg';
import { Button } from '../buttons';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(localeData);

export const uuiHeader = {
    container: 'uui-datepickerheader-container',
    header: 'uui-datepickerheader-header',
    navTitle: 'uui-datepickerheader-nav-title',
    navIconRight: 'uui-datepickerheader-nav-icon-right',
    navIconLeft: 'uui-datepickerheader-nav-icon-left',
};

export interface DatePickerHeaderProps extends IHasCX {
    view: ViewType;
    month: Dayjs;
    onSetMonth: (month: Dayjs) => void;
    onSetView: (view: ViewType) => void;
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

const getPrevMonthFromCurrent = (currentDate: Dayjs) => {
    return currentDate.subtract(1, 'month');
};

export const getNextMonthFromCurrent = (currentDate: Dayjs) => {
    return currentDate.add(1, 'month');
};

const getPrevYearFromCurrent = (currentDate: Dayjs) => {
    return currentDate.subtract(1, 'year');
};

export const getNextYearFromCurrent = (currentDate: Dayjs) => {
    return currentDate.add(1, 'year');
};

const getPrevListYearFromCurrent = (currentDate: Dayjs) => {
    return currentDate.subtract(16, 'year');
};

export const getNextListYearFromCurrent = (currentDate: Dayjs) => {
    return currentDate.add(16, 'year');
};

export function DatePickerHeader({ navIconLeft, navIconRight, month, view, onSetMonth, onSetView }: DatePickerHeaderProps) {
    const onLeftNavigationArrow = () => {
        switch (view) {
            case 'DAY_SELECTION':
                onSetMonth(getPrevMonthFromCurrent(month));
                break;
            case 'MONTH_SELECTION':
                onSetMonth(getPrevYearFromCurrent(month));
                break;
            case 'YEAR_SELECTION':
                onSetMonth(getPrevListYearFromCurrent(month));
                break;
        }
    };

    const onRightNavigationArrow = () => {
        switch (view) {
            case 'DAY_SELECTION':
                onSetMonth(getNextMonthFromCurrent(month));
                break;
            case 'MONTH_SELECTION':
                onSetMonth(getNextYearFromCurrent(month));
                break;
            case 'YEAR_SELECTION':
                onSetMonth(getNextListYearFromCurrent(month));
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
                ? dayjs.months()[month.month()]
                : '';
            return `${monthSubstr} ${month.year()}`;
        },
        [view, month],
    );

    return (
        <div className={ cx(css.container, uuiHeader.container, cx) }>
            <header className={ uuiHeader.header }>
                <Button icon={ navIconLeft || LeftArrowIcon } color="secondary" fill="ghost" cx={ uuiHeader.navIconLeft } onClick={ () => onLeftNavigationArrow() } />
                <Button caption={ title } fill="ghost" cx={ uuiHeader.navTitle } onClick={ () => onCaptionClick(view) } />
                <Button icon={ navIconRight || RightArrowIcon } color="secondary" fill="ghost" cx={ uuiHeader.navIconRight } onClick={ () => onRightNavigationArrow() } />
            </header>
        </div>
    );
}
