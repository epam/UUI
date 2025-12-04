import React, { useEffect, useState } from 'react';
import { offset } from '@floating-ui/react';
import { Dropdown } from '@epam/uui-components';
import { DropdownBodyProps, IDropdownTogglerProps } from '@epam/uui-core';
import { uuiDayjs } from '../../../helpers/dayJsHelper';
import { DropdownContainer } from '../../overlays/DropdownContainer';
import { TextInput } from '../TextInput';
import { TimePickerBody } from './TimePickerBody';
import { EditMode } from '../../types';
import type { TimePickerProps, TimePickerValue } from './types';
import { formatTime, getMeridian, parseTimeNumbers } from './parseTimeHelper';
import css from './TimePicker.module.scss';
import isEqual from 'react-fast-compare';

const DEFAULT_MODE = EditMode.FORM;

const valueToTimeString = (value: TimePickerValue, format: TimePickerProps['format']) => {
    if (value === null) return null;
    return uuiDayjs.dayjs()
        .set(value)
        .format(format === 24 ? 'HH:mm' : 'hh:mm A');
};

export function TimePickerComponent(props: TimePickerProps, ref: React.ForwardedRef<HTMLElement>) {
    const [state, setState] = useState(
        {
            isOpen: false,
            value: valueToTimeString(props.value, props.format),
            inputValue: valueToTimeString(props.value, props.format),
        },
    );

    const targetRef = React.useRef<HTMLInputElement>(null);

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
        const newValue = formatStringTimeToObject(newTime);

        if (!isEqual(props.value, newValue)) {
            props.onValueChange(formatStringTimeToObject(newTime));
        }
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
        props.onBlur?.(e);

        if (state.value === '' || state.inputValue === '') {
            props.onValueChange(null);
            setState((prevState) => ({ ...prevState, value: null, inputValue: null }));
        }

        state.value && state.inputValue && saveTime(state.value);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onToggle(true);
        }

        if (e.key === 'Escape' && state.isOpen) {
            e.preventDefault();
            e.stopPropagation();
            onToggle(false);
        }
    };

    const renderInput = (inputProps: IDropdownTogglerProps) => {
        return (
            <TextInput
                { ...inputProps }
                size={ props.size }
                isDisabled={ props.isDisabled }
                isReadonly={ props.isReadonly }
                isInvalid={ props.isInvalid }
                cx={ [css.root, css.timepickerInput, props.inputCx] }
                value={ state.inputValue }
                onValueChange={ handleInputChange }
                onCancel={ !props.disableClear && onClear }
                onKeyDown={ onKeyDown }
                onFocus={ handleFocus }
                onBlur={ handleBlur }
                isDropdown={ false }
                placeholder={ props.placeholder ? props.placeholder : getFormat() }
                mode={ props.mode || DEFAULT_MODE }
                rawProps={ props.rawProps?.input }
                ref={ (node) => {
                    targetRef.current = node;
                    if (typeof inputProps.ref === 'function') {
                        inputProps.ref(node);
                    } else if (inputProps.ref && 'current' in inputProps.ref) {
                        inputProps.ref.current = node;
                    }
                } }
            />
        );
    };

    const renderBody = (bodyProps: DropdownBodyProps) => {
        const { forwardedRef, onValueChange, ...timePickerBodyProps } = props;

        return (
            !props.isDisabled && !props.isReadonly && (
                <DropdownContainer { ...bodyProps } shards={ [targetRef] }>
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
            middleware={ [offset(6)] }
            ref={ ref }
        />
    );
}

export const TimePicker = React.forwardRef(TimePickerComponent);
