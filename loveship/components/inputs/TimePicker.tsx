import React from 'react';
import { EditMode, SizeMod } from '../types';
import dayjs from 'dayjs';
import { IEditable, IDisableable, TimePickerValue, ICanBeReadonly, IHasPlaceholder } from '@epam/uui';
import { TextInput } from './TextInput';
import { DropdownContainer, Dropdown } from '../overlays';
import { TimePickerBody } from './TimePickerBody';
import * as css from './TimePicker.scss';

interface TimePickerState {
    isOpen: boolean;
    inFocus: boolean;
    value: string | null;
}

const valueToTimeString = (value: TimePickerValue, format: TimePickerProps['format']) => {
    if (value === null) {
        return null;
    }
    return dayjs().set(value).format(format === 24 ? "HH:mm" : "hh:mm A");
};

export interface TimePickerProps extends IEditable<TimePickerValue>, IDisableable, SizeMod, ICanBeReadonly, EditMode, IHasPlaceholder {
    minutesStep?: number;
    format?: 12 | 24;
}

export class TimePicker extends React.Component<TimePickerProps, TimePickerState> {
    state = {
        isOpen: false,
        inFocus: false,
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
        this.props.onValueChange(null);
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

    handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, inFocus: !this.state.inFocus, isOpen: !this.state.isOpen });
    }

    handleBlur = () => {
        this.setState({ ...this.state, isOpen: !this.state.isOpen, inFocus: !this.state.inFocus });
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
                renderTarget={ (props) =>
                    <TextInput
                        { ...props }
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
                    />
                }
                renderBody={ () =>
                     !this.props.isDisabled && !this.props.isReadonly && <DropdownContainer>
                        <TimePickerBody { ...this.props } value={ this.props.value !== null ? this.props.value : { hours: null, minutes: null } }/>
                    </DropdownContainer> }
                onValueChange={ (opened) => this.setState({ ...this.state, isOpen: opened }) }
                value={ this.state.isOpen || this.state.inFocus }
                modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
            />
        );
    }
}