import React from 'react';
import { cx, DatePickerCoreProps, IDropdownToggler, uuiMod, DropdownBodyProps, devLogger } from '@epam/uui-core';
import { BaseDatePicker } from '@epam/uui-components';
import { EditMode, SizeMod, IHasEditMode } from '../types';
import { TextInput } from '../inputs';
import { DatePickerBody } from './DatePickerBody';
import { systemIcons } from '../../icons/icons';
import { DropdownContainer } from '../overlays';

const defaultMode = EditMode.FORM;

export interface DatePickerProps extends DatePickerCoreProps, SizeMod, IHasEditMode {}

export class DatePicker extends BaseDatePicker<DatePickerProps> {
    renderInput = (props: IDropdownToggler & { cx: any }) => {
        if (__DEV__) {
            if (this.props.size === '48') {
                devLogger.warnAboutDeprecatedPropValue<DatePickerProps, 'size'>({
                    component: 'DatePicker',
                    propName: 'size',
                    propValue: this.props.size,
                    propValueUseInstead: '42',
                    condition: () => ['48'].indexOf(this.props.size) !== -1,
                });
            }
        }
        return (
            <TextInput
                { ...props }
                onClick={ null }
                isDropdown={ false }
                cx={ cx(this.props.inputCx, this.state.isOpen && uuiMod.focus) }
                icon={ this.props.mode !== EditMode.CELL && systemIcons[this.props.size || '36'].calendar }
                iconPosition={ this.props.iconPosition || 'left' }
                placeholder={ this.props.placeholder ? this.props.placeholder : this.getFormat() }
                size={ this.props.size || '36' }
                value={ this.state.inputValue }
                onValueChange={ this.handleInputChange }
                onCancel={ this.props.disableClear || !this.state.inputValue ? undefined : this.handleCancel }
                isInvalid={ this.props.isInvalid }
                isDisabled={ this.props.isDisabled }
                isReadonly={ this.props.isReadonly }
                tabIndex={ this.props.isReadonly || this.props.isDisabled ? -1 : 0 }
                onFocus={ this.handleFocus }
                onBlur={ this.handleBlur }
                mode={ this.props.mode || defaultMode }
                rawProps={ this.props.rawProps?.input }
            />
        );
    };

    renderBody(props: DropdownBodyProps) {
        return (
            <DropdownContainer { ...props } focusLock={ false }>
                <DatePickerBody
                    cx={ cx(this.props.bodyCx) }
                    filter={ this.props.filter }
                    value={ this.getValue() }
                    setSelectedDate={ this.setSelectedDate }
                    setDisplayedDateAndView={ this.setDisplayedDateAndView }
                    changeIsOpen={ this.onToggle }
                    renderDay={ this.props.renderDay }
                    isHoliday={ this.props.isHoliday }
                    rawProps={ this.props.rawProps?.body }
                />
                {this.props.renderFooter?.()}
            </DropdownContainer>
        );
    }
}
