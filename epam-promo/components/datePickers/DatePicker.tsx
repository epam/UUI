import * as React from 'react';
import moment from 'moment';
import { cx, IDropdownToggler } from '@epam/uui';
import { BaseDatePicker, BaseDatePickerProps } from '@epam/uui-components';
import { DropdownContainer, DatePickerBody, SizeMod, TextInput, EditMode, Mode } from '../';
import { systemIcons } from '../../icons/icons';
import * as css from './DatePicker.scss';

const defaultMode = Mode.FORM;

export interface DatePickerProps extends BaseDatePickerProps, SizeMod, EditMode {
    format: string;
    filter?(day: moment.Moment): boolean;
    renderTarget?(props: IDropdownToggler): React.ReactNode;
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
                value={ this.state.inputValue }
                onValueChange={ this.handleInputChange }
                onCancel={ this.props.disableClear ? null : this.state.inputValue && this.handleCancel }
                isInvalid={ this.props.isInvalid }
                isDisabled={ this.props.isDisabled }
                isReadonly={ this.props.isReadonly }
                onBlur={ this.handleBlur }
                mode={ this.props.mode || defaultMode }
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