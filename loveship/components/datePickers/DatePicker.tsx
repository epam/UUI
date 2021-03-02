import React from 'react';
import { DropdownContainer, DatePickerBody, SizeMod, EditMode, TextInput } from '../index';
import { cx, IDropdownToggler } from '@epam/uui';
import * as css from './DatePicker.scss';
import moment from 'moment';
import { BaseDatePicker, BaseDatePickerProps } from '@epam/uui-components';
import { TextSettings } from '../../helpers/textLayout';
import { systemIcons } from '../icons/icons';

export interface DatePickerProps extends BaseDatePickerProps, SizeMod, TextSettings, EditMode {
    format: string;
    filter?(day: moment.Moment): boolean;
    renderTarget?(props: any): React.ReactNode;
    renderFooter?(): React.ReactNode;
    iconPosition?: 'left' | 'right';
    disableClear?: boolean;
}
export class DatePicker extends BaseDatePicker<DatePickerProps> {

    renderInput = (props: IDropdownToggler) => {
        return (
            <TextInput
                { ...props }
                isDropdown={ false }
                cx={ cx(this.props.cx, css.dateInput) }
                icon={ systemIcons[this.props.size || '36'].calendar }
                iconPosition={ this.props.iconPosition || 'left' }
                placeholder={ this.props.placeholder ? this.props.placeholder : this.getFormat() }
                size={ this.props.size || '36' }
                lineHeight={ this.props.lineHeight }
                fontSize={ this.props.fontSize }
                mode={ this.props.mode || 'form' }
                value={ this.state.inputValue }
                onValueChange={ this.handleInputChange }
                onCancel={ this.props.disableClear ? null : this.state.inputValue && this.handleCancel }
                isInvalid={ this.props.isInvalid }
                isDisabled={ this.props.isDisabled }
                isReadonly={ this.props.isReadonly }
                onBlur={ this.handleBlur }
            />
        );
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
            />
            { this.props.renderFooter && this.props.renderFooter() }
        </DropdownContainer>;
    }
}