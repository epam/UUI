import React from 'react';
import dayjs from 'dayjs';
import { IDropdownToggler, IHasRawProps } from '@epam/uui';
import { BaseTimePickerProps, BaseTimePicker } from '@epam/uui-components';
import { IHasEditMode, SizeMod, EditMode } from '../types';
import { DropdownContainer } from '../overlays';
import { TextInput } from './TextInput';
import { TimePickerBody } from './TimePickerBody';
import * as css from './TimePicker.scss';
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const defaultMode = EditMode.FORM;
export interface TimePickerProps extends BaseTimePickerProps, SizeMod, IHasEditMode {
    minutesStep?: number;
    format?: 12 | 24;
    rawProps?: {
        input?: IHasRawProps<HTMLDivElement>['rawProps'];
        body?: IHasRawProps<HTMLDivElement>['rawProps'];
    }
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
            isDropdown={ false }
            placeholder={ this.props.placeholder ? this.props.placeholder : this.getFormat() }
            mode={ this.props.mode || defaultMode }
            rawProps={ this.props.rawProps?.input }
        />
    );

    renderBody = () => {
        return !this.props.isDisabled && !this.props.isReadonly && (
            <DropdownContainer>
                <TimePickerBody
                    { ...this.props }
                    value={ this.props.value !== null ? this.props.value : { hours: null, minutes: null } }
                    rawProps={ this.props.rawProps?.body }
                />
            </DropdownContainer>
        )
    }
}
