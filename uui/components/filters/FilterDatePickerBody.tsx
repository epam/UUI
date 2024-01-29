import React, { Fragment } from 'react';
import dayjs from 'dayjs';
import { i18n } from '../../i18n';
import { DatePickerCoreProps, IDropdownBodyProps } from '@epam/uui-core';
import { FlexSpacer, FlexRow, FlexCell } from '../layout';
import { LinkButton } from '../buttons';
import { Text } from '../typography';
import { DatePickerBody } from '../datePickers';
import { useDatePickerState } from '../datePickers/useDatePickerState';

/** Represents the properties of the DatePicker. */
export interface DatePickerProps extends DatePickerCoreProps, IDropdownBodyProps {}

export function FilterDatePickerBody(props: DatePickerProps) {
    const {
        state,
        // handleInputChange,
        // handleFocus,
        // handleBlur,
        handleCancel,
        handleToggle,
        setDisplayedDateAndView,
        setSelectedDate,
    } = useDatePickerState(props);

    const value = {
        selectedDate: props.value,
        displayedDate: state.displayedDate,
        view: state.view,
    };

    return (
        <Fragment>
            <FlexRow borderBottom={ true }>
                <DatePickerBody
                    filter={ props.filter }
                    value={ value }
                    setSelectedDate={ setSelectedDate }
                    setDisplayedDateAndView={ setDisplayedDateAndView }
                    changeIsOpen={ handleToggle }
                    renderDay={ props.renderDay }
                    isHoliday={ props.isHoliday }
                    rawProps={ props.rawProps?.body }
                />
            </FlexRow>
            <FlexCell alignSelf="stretch">
                <FlexRow padding="24" vPadding="12">
                    <Text>{state.selectedDate ? dayjs(state.selectedDate).format('MMM DD, YYYY') : ''}</Text>
                    <FlexSpacer />
                    <LinkButton isDisabled={ !state.selectedDate } caption={ i18n.filterToolbar.datePicker.clearCaption } onClick={ handleCancel } />
                </FlexRow>
            </FlexCell>
        </Fragment>
    );
}
