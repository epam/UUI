import React from 'react';
import dayjs from 'dayjs';
import { i18n } from '../../i18n';
import { DatePickerCoreProps, IDropdownBodyProps } from '@epam/uui-core';
import { BaseDatePicker, DatePickerState } from '@epam/uui-components';
import { FlexSpacer, LinkButton, FlexRow, FlexCell, Text } from '../../index';
import { DatePickerBody } from '../';

export interface DatePickerProps extends DatePickerCoreProps, IDropdownBodyProps {}

export class FilterDataPickerBody extends BaseDatePicker<DatePickerProps> {
    state: DatePickerState = {
        ...super.getValue(),
        isOpen: false,
        inputValue: null,
    };

    renderInput = (): any => {
        return null;
    };

    onToggleHandler = (val: boolean) => {
        this.onToggle(val);
        this.props.onClose();
    };

    handleCancel = () => {
        this.handleValueChange(undefined);
        this.setState({ inputValue: null, selectedDate: null });
    };

    renderBody() {
        return (
            <>
                <FlexRow borderBottom={true}>
                    <DatePickerBody
                        filter={this.props.filter}
                        value={this.getValue()}
                        setSelectedDate={this.setSelectedDate}
                        setDisplayedDateAndView={this.setDisplayedDateAndView}
                        changeIsOpen={this.onToggleHandler}
                        renderDay={this.props.renderDay}
                        isHoliday={this.props.isHoliday}
                        rawProps={this.props.rawProps?.body}
                    />
                </FlexRow>
                <FlexCell alignSelf="stretch">
                    <FlexRow padding="24" vPadding="12">
                        <Text>{this.state.selectedDate ? dayjs(this.state.selectedDate).format('MMM DD, YYYY') : ''}</Text>
                        <FlexSpacer />
                        <LinkButton isDisabled={!this.state.selectedDate} caption={i18n.filterToolbar.datePicker.clearCaption} onClick={this.handleCancel} />
                    </FlexRow>
                </FlexCell>
            </>
        );
    }

    render() {
        return this.renderBody();
    }
}
