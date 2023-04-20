import React from 'react';
import { DropdownBodyProps, IDropdownToggler } from '@epam/uui-core';
import { BaseTimePicker, BaseTimePickerProps } from '@epam/uui-components';
import { SizeMod, EditMode } from '../types';
import { TextInput } from './TextInput';
import css from './TimePicker.scss';
import { TimePickerBody } from './TimePickerBody';
import { DropdownContainer } from '../overlays';

export interface TimePickerProps extends BaseTimePickerProps, SizeMod, EditMode {
    minutesStep?: number;
    format?: 12 | 24;
}

export class TimePicker extends BaseTimePicker<TimePickerProps> {
    renderInput = (props: IDropdownToggler) => (
        <TextInput
            { ...props }
            onClick={ null }
            size={ this.props.size || '36' }
            isDisabled={ this.props.isDisabled }
            isReadonly={ this.props.isReadonly }
            isInvalid={ this.props.isInvalid }
            cx={ css.dateInput }
            value={ this.state.value }
            onValueChange={ this.handleInputChange }
            onCancel={ this.onClear }
            onFocus={ this.handleFocus }
            onBlur={ this.handleBlur }
            mode={ this.props.mode }
            isDropdown={ false }
            placeholder={ this.props.placeholder ? this.props.placeholder : this.getFormat() }
            rawProps={ this.props.rawProps?.input }
        />
    );

    renderBody = (props: DropdownBodyProps) => {
        return (
            !this.props.isDisabled
            && !this.props.isReadonly && (
                <DropdownContainer { ...props }>
                    <TimePickerBody
                        { ...this.props }
                        value={ this.props.value !== null ? this.props.value : { hours: null, minutes: null } }
                        rawProps={ this.props.rawProps?.body }
                    />
                </DropdownContainer>
            )
        );
    };
}
