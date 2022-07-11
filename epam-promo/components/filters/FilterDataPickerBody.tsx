import React from 'react';
import { DatePickerCoreProps } from "@epam/uui-core";
import { BaseDatePicker, DatePickerState } from '@epam/uui-components';
import { DropdownContainer, DatePickerBody, FlexSpacer, LinkButton, FlexRow, FlexCell, Text } from '../../index';

export interface DatePickerProps extends DatePickerCoreProps {}

export class FilterDataPickerBody extends BaseDatePicker<DatePickerProps> {
    state: DatePickerState = {
        ...super.getValue(),
        isOpen: false,
        inputValue: null,
    };

    renderInput = (): any => {
        return null;
    }

    renderBody() {
        return (
            <DropdownContainer>
                <FlexRow borderBottom="gray40">
                    <DatePickerBody
                        filter={ this.props.filter }
                        value={ this.getValue() }
                        setSelectedDate={ this.setSelectedDate }
                        setDisplayedDateAndView={ this.setDisplayedDateAndView }
                        changeIsOpen={ this.onToggle }
                        renderDay={ this.props.renderDay }
                        isHoliday={ this.props.isHoliday }
                        rawProps={ this.props.rawProps?.body }
                    />
                </FlexRow>
                <FlexCell alignSelf="stretch">
                    <FlexRow padding="24" vPadding="12">
                        <Text>{ this.state.selectedDate }</Text>
                        <FlexSpacer />
                        <LinkButton isDisabled={ !this.state.selectedDate } caption="CLEAR" onClick={ this.handleCancel }/>
                    </FlexRow>
                </FlexCell>
            </DropdownContainer>
        );
    }

    render() {
        return this.renderBody();
    }
}