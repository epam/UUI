import * as React from 'react';
import { Icon, IEditable, IHasCX } from '@epam/uui-core';
import cx from 'classnames';
import css from './DatePickerHeader.module.scss';
import dayjs, { Dayjs } from 'dayjs';
import { PickerBodyValue, ViewType } from '@epam/uui-components';
import { ReactComponent as LeftArrowIcon } from '../../icons/navigation-chevron-left-24.svg';
import { ReactComponent as RightArrowIcon } from '../../icons/navigation-chevron-right-24.svg';
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

export interface DatePickerHeaderProps extends IEditable<PickerBodyValue<string>>, IHasCX {
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

export function DatePickerHeader(props: DatePickerHeaderProps) {
    const onLeftNavigationArrow = () => {
        switch (props.value.view) {
            case 'DAY_SELECTION':
                props.onValueChange({ ...props.value, displayedDate: getPrevMonthFromCurrent(props.value.displayedDate) });
                break;
            case 'MONTH_SELECTION':
                props.onValueChange({ ...props.value, displayedDate: getPrevYearFromCurrent(props.value.displayedDate) });
                break;
            case 'YEAR_SELECTION':
                props.onValueChange({ ...props.value, displayedDate: getPrevListYearFromCurrent(props.value.displayedDate) });
                break;
        }
    };

    const onRightNavigationArrow = () => {
        switch (props.value.view) {
            case 'DAY_SELECTION':
                props.onValueChange({ ...props.value, displayedDate: getNextMonthFromCurrent(props.value.displayedDate) });
                break;
            case 'MONTH_SELECTION':
                props.onValueChange({ ...props.value, displayedDate: getNextYearFromCurrent(props.value.displayedDate) });
                break;
            case 'YEAR_SELECTION':
                props.onValueChange({ ...props.value, displayedDate: getNextListYearFromCurrent(props.value.displayedDate) });
                break;
        }
    };

    const onCaptionClick = (view: ViewType) => {
        let nextView: ViewType;
        switch (view) {
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

        props.onValueChange({
            ...props.value,
            view: nextView,
        });
    };

    const title = React.useMemo(
        () => `${
            props.value?.view !== 'MONTH_SELECTION'
                ? dayjs.months()[props.value?.displayedDate.month()]
                : ''
        } ${props.value?.displayedDate.year()}`,
        [props.value?.view, props.value?.displayedDate],
    );

    return (
        <div className={ cx(css.container, uuiHeader.container, props.cx) }>
            <header className={ uuiHeader.header }>
                <Button icon={ props.navIconLeft || LeftArrowIcon } color="secondary" fill="ghost" cx={ uuiHeader.navIconLeft } onClick={ () => onLeftNavigationArrow() } />
                <Button caption={ title } fill="ghost" cx={ uuiHeader.navTitle } onClick={ () => onCaptionClick(props.value.view) } />
                <Button icon={ props.navIconRight || RightArrowIcon } color="secondary" fill="ghost" cx={ uuiHeader.navIconRight } onClick={ () => onRightNavigationArrow() } />
            </header>
        </div>
    );
}
