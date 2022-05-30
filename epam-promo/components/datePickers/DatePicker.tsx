import React from 'react';
import css from './DatePicker.scss';
import { cx, IDropdownToggler, uuiMod, DatePickerCoreProps } from "@epam/uui-core";
import { BaseDatePicker } from '@epam/uui-components';
import { DropdownContainer, DatePickerBody, SizeMod, TextInput, IHasEditMode, EditMode } from '../';
import { systemIcons } from '../../icons/icons';

const defaultMode = EditMode.FORM;

export interface DatePickerProps extends DatePickerCoreProps, SizeMod, IHasEditMode {
    
}

export class DatePicker extends BaseDatePicker<DatePickerProps> {
    renderInput = (props: IDropdownToggler) => {
        return (
            <TextInput
                { ...props }
                onClick={ null }
                isDropdown={ false }
                cx={ cx(this.props.cx, css.dateInput, this.state.isOpen && uuiMod.focus) }
                icon={ systemIcons[this.props.size || '36'].calendar }
                iconPosition={ this.props.iconPosition || 'left' }
                placeholder={ this.props.placeholder ? this.props.placeholder : this.getFormat() }
                size={ this.props.size || '36' }
                value={ this.state.inputValue }
                onValueChange={ this.handleInputChange }
                onCancel={ (this.props.disableClear || !this.state.inputValue) ? undefined : this.handleCancel }
                isInvalid={ this.props.isInvalid }
                isDisabled={ this.props.isDisabled }
                isReadonly={ this.props.isReadonly }
                tabIndex={ (this.props.isReadonly || this.props.isDisabled) ? -1 : 0 }
                onFocus={ this.handleFocus }
                onBlur={ this.handleBlur }
                mode={ this.props.mode || defaultMode }
                rawProps={ this.props.rawProps?.input }
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
                rawProps={ this.props.rawProps?.body }
                cx={ css.body }
            />
            { this.props.renderFooter?.() }
        </DropdownContainer>;
    }
}