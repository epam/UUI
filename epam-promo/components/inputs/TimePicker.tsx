import React from 'react';
import dayjs from 'dayjs';
import { IEditable, IDisableable, TimePickerValue, ICanBeReadonly, IHasPlaceholder } from '@epam/uui';
import { IHasEditMode, SizeMod, EditMode } from '../types';
import { DropdownContainer, Dropdown } from '../overlays';
import { TextInput } from './TextInput';
import { TimePickerBody } from './TimePickerBody';
import * as css from './TimePicker.scss';
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const defaultMode = EditMode.FORM;

interface TimePickerState {
    isOpen: boolean;
    value: string | null;
}

const valueToTimeString = (value: TimePickerValue, format: TimePickerProps['format']) => {
    if (value === null) {
        return null;
    }
    return dayjs().set(value).format(format === 24 ? 'HH:mm' : 'hh:mm A');
};

export interface TimePickerProps extends IEditable<TimePickerValue>, IDisableable, SizeMod, ICanBeReadonly, IHasPlaceholder, IHasEditMode {
    minutesStep?: number;
    format?: 12 | 24;
}

export class TimePicker extends React.Component<TimePickerProps, TimePickerState> {
    state = {
        isOpen: false,
        value: valueToTimeString(this.props.value, this.props.format),
    };

    componentDidUpdate(prevProps: TimePickerProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({ ...this.state, value: valueToTimeString(this.props.value, this.props.format) });
        }
    }

    getFormat = () => {
        return this.props.format === 24 ? 'HH:mm' : 'hh:mm A';
    }

    onClear = () => {
        this.props.onValueChange({ hours: 0, minutes: 0 });
    }

    handleInputChange = (newValue: string) => {
        if (this.getFormat() === "hh:mm A" && newValue.length < 8) {
            this.setState({ ...this.state, value: newValue });
        } else if (dayjs(newValue, this.getFormat(), true).isValid()) {
            const value = dayjs(newValue, this.getFormat(), true);
            this.props.onValueChange({ hours: value.hour(), minutes: value.minute() });
            this.setState({ ...this.state, value: newValue });
        } else {
            this.setState({ ...this.state, value: newValue });
        }
    }

    onToggle = (value: boolean) => {
        this.setState({ ...this.state, isOpen: value });
    }

    handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        this.onToggle(true);
    }

    handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        this.onToggle(false);

        if (this.state.value === '') {
            this.props.onValueChange(null);
            this.setState({ ...this.state, value: null });
        } else if (!dayjs(this.state.value, this.getFormat(), true).isValid()) {
            this.props.onValueChange(this.props.value);
            this.setState({ ...this.state, value: valueToTimeString(this.props.value, this.props.format) });
        }
    }

    render() {
        return (
            <Dropdown
                renderTarget={ (props) => (
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
                    />
                ) }
                renderBody={ () =>
                    !this.props.isDisabled &&
                    !this.props.isReadonly && (
                        <DropdownContainer>
                            <TimePickerBody
                                { ...this.props }
                                value={ this.props.value !== null ? this.props.value : { hours: null, minutes: null } }
                            />
                        </DropdownContainer>
                    )
                }
                onValueChange={ !this.props.isDisabled && !this.props.isReadonly ? this.onToggle : null }
                value={ this.state.isOpen }
                modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
            />
        );
    }
}
