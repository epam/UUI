import React from 'react';
import { EditMode, SizeMod } from '../types';
import moment from 'moment';
import { IEditable, IDisableable, TimePickerValue, ICanBeReadonly } from '@epam/uui';
import { TextInput } from './TextInput';
import { DropdownContainer, Dropdown } from '../overlays';
import { TimePickerBody } from './TimePickerBody';
import * as css from './TimePicker.scss';

interface TimePickerState {
    isOpen: boolean;
    value: string;
}

const valueToTimeString = (value: TimePickerValue, format: TimePickerProps['format']) => {
    return moment(value).format(format === 24 ? "HH:mm" : "hh:mm A");
};

export interface TimePickerProps extends IEditable<TimePickerValue>, IDisableable, SizeMod, ICanBeReadonly, EditMode {
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
        const value = moment(newValue, this.getFormat(), true);
        if (moment(newValue, this.getFormat(), true).isValid()) {
            this.props.onValueChange({ hours: value.hours(), minutes: value.minutes() });
            this.setState({ ...this.state, value: newValue });
        } else {
            this.setState({ ...this.state, value: newValue });
        }
    }

    handleBlur = () => {
        if (!moment(this.state.value, this.getFormat(), true).isValid()) {
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
                        onBlur={ this.handleBlur }
                        mode={ this.props.mode }
                        isDropdown={ false }
                    />
                }
                renderBody={ () =>
                     !this.props.isDisabled && !this.props.isReadonly && <DropdownContainer>
                        <TimePickerBody { ...this.props } value={ this.props.value }/>
                    </DropdownContainer> }
                onValueChange={ (opened) => this.setState({ ...this.state, isOpen: opened }) }
                value={ this.state.isOpen }
                modifiers={ {offset: {offset: '0,6px'}} }
            />
        );
    }
}