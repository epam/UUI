import React, { useEffect, useState } from 'react';
import { DropdownBodyProps, IDropdownToggler, isFocusReceiverInsideFocusLock } from '@epam/uui-core';
import { uuiDayjs } from '../../../helpers/dayJsHelper';
import { Dropdown, DropdownContainer } from '../../overlays';
import { TextInput } from '../TextInput';
import { TimePickerBody } from './TimePickerBody';
import { EditMode } from '../../types';
import { TimePickerProps, TimePickerValue } from './types';
import { formatTime, getMeridian, parseTimeNumbers } from './parseTimeHelper';
import css from './TimePicker.module.scss';

const DEFAULT_MODE = EditMode.FORM;

const valueToTimeString = (value: TimePickerValue, format: TimePickerProps['format']) => {
    if (value === null) return null;
    return uuiDayjs.dayjs()
        .set(value)
        .format(format === 24 ? 'HH:mm' : 'hh:mm A');
};

export function TimePicker(props: TimePickerProps) {
    const [state, setState] = useState(
        {
            isOpen: false,
            value: valueToTimeString(props.value, props.format),
            inputValue: valueToTimeString(props.value, props.format),
        },
    );

    useEffect(() => {
        if (valueToTimeString(props.value, props.format) !== state.value) {
            const stringValue = valueToTimeString(props.value, props.format);
            setState((prevState) => ({
                ...prevState,
                value: stringValue,
                inputValue: stringValue,
            }));
        }
    }, [props.value, props.format]);

    const getFormat = () => props.format === 24 ? 'HH:mm' : 'hh:mm A';

    const isTimeValid = (newValue: string) => uuiDayjs.dayjs(newValue, getFormat(), true).isValid();

    const formatStringTimeToObject = (stringTime: string | null) => {
        if (stringTime) {
            const value = uuiDayjs.dayjs(stringTime, getFormat(), true);
            return { hours: value.hour(), minutes: value.minute() };
        }
        return { hours: null, minutes: null };
    };

    const onClear = () => {
        props.onValueChange(null);
    };

    const onToggle = (value: boolean) => {
        setState((prevState) => ({ ...prevState, isOpen: value }));
    };

    const saveTime = (newTime: string) => {
        setState((prevState) => ({ ...prevState, inputValue: newTime }));
        props.onValueChange(formatStringTimeToObject(newTime));
    };

    const getTimeFromInputValue = (newValue: string) => {
        const trimmedNewValue = newValue.trimStart();
        const separator = trimmedNewValue.search(/\D/);
        const meridian = getMeridian(trimmedNewValue, getFormat());
        const { hours, minutes } = parseTimeNumbers(trimmedNewValue, separator);
        return formatTime(hours, minutes, meridian, getFormat());
    };

    const handleBodyValueChange = (newValue: TimePickerValue) => {
        const inputValue = valueToTimeString(newValue, props.format);
        saveTime(inputValue);
    };

    const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
        onToggle(true);
        props.onFocus?.(e);
    };

    const handleInputChange = (newValue: string) => {
        setState((prevState) => ({ ...prevState, inputValue: newValue }));

        if (newValue) {
            const result = getTimeFromInputValue(newValue);
            if (isTimeValid(result)) {
                setState((prevState) => ({ ...prevState, value: result }));
            }
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isFocusReceiverInsideFocusLock(e)) return;
        onToggle(false);
        props.onBlur?.(e);

        if (state.value === '' || state.inputValue === '') {
            props.onValueChange(null);
            setState((prevState) => ({ ...prevState, value: null, inputValue: null }));
        }

        state.value && state.inputValue && saveTime(state.value);
    };

    const renderInput = (inputProps: IDropdownToggler) => {
        return (
            <TextInput
                { ...inputProps }
                onClick={ null }
                size={ props.size || '36' }
                isDisabled={ props.isDisabled }
                isReadonly={ props.isReadonly }
                isInvalid={ props.isInvalid }
                cx={ [css.root, css.timepickerInput, props.inputCx] }
                value={ state.inputValue }
                onValueChange={ handleInputChange }
                onCancel={ !props.disableClear && onClear }
                onFocus={ handleFocus }
                onBlur={ handleBlur }
                isDropdown={ false }
                placeholder={ props.placeholder ? props.placeholder : getFormat() }
                mode={ props.mode || DEFAULT_MODE }
                rawProps={ props.rawProps?.input }
            />
        );
    };

    const renderBody = (bodyProps: DropdownBodyProps) => {
        const { forwardedRef, onValueChange, ...timePickerBodyProps } = props;

        return (
            !props.isDisabled && !props.isReadonly && (
                <DropdownContainer { ...bodyProps } focusLock={ false }>
                    <TimePickerBody
                        { ...timePickerBodyProps }
                        onValueChange={ handleBodyValueChange }
                        value={ formatStringTimeToObject(state.value) }
                        rawProps={ props.rawProps?.body }
                        cx={ props.bodyCx }
                    />
                </DropdownContainer>
            )
        );
    };

    return (
        <Dropdown
            renderTarget={ (targetProps) => (props.renderTarget ? props.renderTarget(targetProps) : renderInput(targetProps)) }
            renderBody={ (bodyProps) => !props.isDisabled && !props.isReadonly && renderBody(bodyProps) }
            onValueChange={ !props.isDisabled && !props.isReadonly ? onToggle : null }
            value={ state.isOpen }
            modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
            forwardedRef={ props.forwardedRef }
        />
    );
}
