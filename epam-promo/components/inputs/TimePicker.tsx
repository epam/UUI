import React from 'react';
import moment from 'moment';
import { IEditable, IDisableable, TimePickerValue, ICanBeReadonly, IHasPlaceholder } from '@epam/uui';
import { EditMode, SizeMod, Mode } from '../types';
import { DropdownContainer, Dropdown } from '../overlays';
import { TextInput } from './TextInput';
import { TimePickerBody } from './TimePickerBody';
import * as css from './TimePicker.scss';

const defaultMode = Mode.FORM;

interface TimePickerState {
    isOpen: boolean;
    value: string | null;
}

const valueToTimeString = (value: TimePickerValue, format: TimePickerProps['format']) => {
    if (value === null) {
        return null;
    }
    return moment(value).format(format === 24 ? 'HH:mm' : 'hh:mm A');
};

export interface TimePickerProps extends IEditable<TimePickerValue>, IDisableable, SizeMod, ICanBeReadonly, IHasPlaceholder, EditMode {
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
        } else if (moment(newValue, this.getFormat(), true).isValid()) {
            const value = moment(newValue, this.getFormat(), true);

            this.props.onValueChange({ hours: value.hours(), minutes: value.minutes() });
            this.setState({ ...this.state, value: newValue });
        } else {
            this.setState({ ...this.state, value: newValue });
        }
    }

    handleBlur = () => {
        if (this.state.value === '') {
            this.props.onValueChange(null);
            this.setState({ ...this.state, value: null });
        } else if (!moment(this.state.value, this.getFormat(), true).isValid()) {
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
                        size={ this.props.size || '36' }
                        isDisabled={ this.props.isDisabled }
                        isReadonly={ this.props.isReadonly }
                        isInvalid={ this.props.isInvalid }
                        cx={ css.dateInput }
                        value={ this.state.value }
                        onValueChange={ this.handleInputChange }
                        onCancel={ this.onClear }
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
                            <TimePickerBody { ...this.props } value={ this.props.value !== null ? this.props.value : { hours: null, minutes: null } } />
                        </DropdownContainer>
                    )
                }
                onValueChange={ (opened) =>
                    this.setState({ ...this.state, isOpen: opened })
                }
                value={ this.state.isOpen }
                modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
            />
        );
    }
}
