import React from 'react';
import dayjs from "dayjs";
import { DatePickerCoreProps } from "@epam/uui-core";
import { BaseDatePicker, DatePickerState } from '@epam/uui-components';
import { DatePickerBody, FlexSpacer, LinkButton, FlexRow, FlexCell, Text } from '../../index';

export interface DatePickerProps extends DatePickerCoreProps {
    onClose?: () => void;
}

export class FilterDataPickerBody extends BaseDatePicker<DatePickerProps> {
    state: DatePickerState = {
        ...super.getValue(),
        isOpen: false,
        inputValue: null,
    };

    renderInput = (): any => {
        return null;
    }

    onToggleHandler = (val: boolean) => {
        this.onToggle(val);
        this.props.onClose();
    }

    renderBody() {
        return (
            <>
                <FlexRow borderBottom="gray40">
                    <DatePickerBody
                        filter={ this.props.filter }
                        value={ this.getValue() }
                        setSelectedDate={ this.setSelectedDate }
                        setDisplayedDateAndView={ this.setDisplayedDateAndView }
                        changeIsOpen={ this.onToggleHandler }
                        renderDay={ this.props.renderDay }
                        isHoliday={ this.props.isHoliday }
                        rawProps={ this.props.rawProps?.body }
                    />
                </FlexRow>
                <FlexCell alignSelf="stretch">
                    <FlexRow padding="24" vPadding="12">
                        <Text >{ this.state.selectedDate ? dayjs(this.state.selectedDate).format('MMM DD, YYYY') : '' }</Text>
                        <FlexSpacer />
                        <LinkButton isDisabled={ !this.state.selectedDate } caption="CLEAR" onClick={ this.handleCancel }/>
                    </FlexRow>
                </FlexCell>
            </>
        );
    }

    render() {
        return this.renderBody();
    }
}