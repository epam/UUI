import React from 'react';
import { DatePickerCoreProps } from "@epam/uui-core";
import { BaseDatePicker } from '@epam/uui-components';
import { DropdownContainer, DatePickerBody } from '../../index';

export interface DatePickerProps extends DatePickerCoreProps {}

export class FilterDataPickerBody extends BaseDatePicker<DatePickerProps> {
    renderInput = (): any => {
        return null;
    }

    renderBody() {
        return <DropdownContainer>
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
            { this.props.renderFooter?.() }
        </DropdownContainer>;
    }

    render() {
        return this.renderBody();
    }
}