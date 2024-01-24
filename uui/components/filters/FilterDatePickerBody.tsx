import React from 'react';
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

export function FilterDatePickerBody(allProps: DatePickerProps) {
    const {
        filter,
        onClose,
        renderDay,
        isHoliday,
        rawProps,
    } = allProps;
    const {
        state,
        handleValueChange,
        setState,
        onToggle,
        getValue,
        setSelectedDate,
        setDisplayedDateAndView,
    } = useDatePickerState(allProps);

    const onToggleHandler = (val: boolean) => {
        onToggle(val);
        onClose();
    };

    const handleCancel = () => {
        handleValueChange(undefined);
        setState({ inputValue: null, selectedDate: null });
    };

    const renderBody = () => {
        return (
            <>
                <FlexRow borderBottom={ true }>
                    <DatePickerBody
                        filter={ filter }
                        value={ getValue() }
                        setSelectedDate={ setSelectedDate }
                        setDisplayedDateAndView={ setDisplayedDateAndView }
                        changeIsOpen={ onToggleHandler }
                        renderDay={ renderDay }
                        isHoliday={ isHoliday }
                        rawProps={ rawProps?.body }
                    />
                </FlexRow>
                <FlexCell alignSelf="stretch">
                    <FlexRow padding="24" vPadding="12">
                        <Text>{state.selectedDate ? dayjs(state.selectedDate).format('MMM DD, YYYY') : ''}</Text>
                        <FlexSpacer />
                        <LinkButton isDisabled={ !state.selectedDate } caption={ i18n.filterToolbar.datePicker.clearCaption } onClick={ handleCancel } />
                    </FlexRow>
                </FlexCell>
            </>
        );
    };

    return renderBody();
}
