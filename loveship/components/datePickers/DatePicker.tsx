import React from 'react';
import { DropdownContainer, DatePickerBody, SizeMod, EditMode, TextInput } from '../index';
import { cx, IDropdownToggler, uuiMod, IHasRawProps, BaseDatePickerProps } from '@epam/uui-core';
import * as css from './DatePicker.scss';
import { Dayjs } from "dayjs";
import { BaseDatePicker } from '@epam/uui-components';
import { TextSettings } from '../../helpers/textLayout';
import { systemIcons } from '../icons/icons';

export interface DatePickerProps extends BaseDatePickerProps, SizeMod, TextSettings, EditMode {
    format: string;
    filter?(day: Dayjs): boolean;
    renderTarget?(props: any): React.ReactNode;
    renderFooter?(): React.ReactNode;
    iconPosition?: 'left' | 'right';
    disableClear?: boolean;
    rawProps?: {
        input?: IHasRawProps<HTMLDivElement>['rawProps'];
        body?: IHasRawProps<HTMLDivElement>['rawProps'];
    };
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
                lineHeight={ this.props.lineHeight }
                fontSize={ this.props.fontSize }
                mode={ this.props.mode || 'form' }
                value={ this.state.inputValue }
                onValueChange={ this.handleInputChange }
                onCancel={ this.props.disableClear ? null : this.state.inputValue && this.handleCancel }
                isInvalid={ this.props.isInvalid }
                isDisabled={ this.props.isDisabled }
                isReadonly={ this.props.isReadonly }
                onFocus={ this.handleFocus }
                onBlur={ this.handleBlur }
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