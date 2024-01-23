import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import {
    CX, devLogger, DropdownBodyProps, ICanBeReadonly, ICanFocus, IDisableable, IDropdownToggler, IEditable,
    IHasForwardedRef, IHasPlaceholder, IHasRawProps, isFocusReceiverInsideFocusLock,
} from '@epam/uui-core';
import { Dropdown, DropdownContainer } from '../../overlays';
import { TextInput } from '../TextInput';
import { TimePickerBody } from '../timePicker';
import { EditMode, IHasEditMode, SizeMod } from '../../types';
import { formatTime, getMeridian, parseTimeNumbers } from './parseTimeHelper';
import css from './TimePicker.module.scss';

dayjs.extend(customParseFormat);

const DEFAULT_MODE = EditMode.FORM;

export interface TimePickerProps extends SizeMod, IHasEditMode, IEditable<TimePickerValue | null>,
    IDisableable,
    ICanBeReadonly,
    IHasPlaceholder,
    ICanFocus<HTMLElement>,
    IHasForwardedRef<HTMLElement> {
    /**
     * Minutes input increase/decrease step on up/down icons clicks and up/down arrow keys
     * @default 5
     */
    minutesStep?: number;
    /**
     * Time format, 12 hours with AM/PM or 24 hours
     * @default 12
     */
    format?: 12 | 24;
    /** ID to put on time picker toggler 'input' node */
    id?: string;

    /**
     * Render callback for time picker toggler.
     * If omitted, default TextInput component will be rendered.
     */
    renderTarget?(props: IDropdownToggler): React.ReactNode;

    /** HTML attributes to put directly to TimePicker parts */
    rawProps?: {
        /** HTML attributes to put directly to the input element */
        input?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        /** HTML attributes to put directly to the body root element */
        body?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    };
    /** CSS class(es) to put on input-part component. See https://github.com/JedWatson/classnames#usage for details */
    inputCx?: CX;
    /** CSS class(es) to put on body-part component. See https://github.com/JedWatson/classnames#usage for details */
    bodyCx?: CX;
}

export interface TimePickerValue {
    /** Selected hours value */
    hours: number;
    /** Selected minutes value */
    minutes: number;
}

const valueToTimeString = (value: TimePickerValue, format: TimePickerProps['format']) => {
    if (value === null) return null;
    return dayjs()
        .set(value)
        .format(format === 24 ? 'HH:mm' : 'hh:mm A');
};

export function TimePicker(props: TimePickerProps) {
    const [state, setState] = useState(
        {
            isOpen: false,
            value: valueToTimeString(props.value, props.format),
        },
    );

    useEffect(() => {
        saveValueFromProps();
    }, [props.value, props.format]);

    const saveValueFromProps = () => {
        setState((prevState) => ({
            ...prevState,
            value: valueToTimeString(props.value, props.format),
        }));
    };

    const getFormat = () => props.format === 24 ? 'HH:mm' : 'hh:mm A';

    const checkTimeFormat = (newValue: string) => dayjs(newValue, getFormat(), true).isValid();

    const onClear = () => {
        props.onValueChange(null);
        setState((prevState) => ({ ...prevState, result: '' }));
    };

    const onToggle = (value: boolean) => {
        setState((prevState) => ({ ...prevState, isOpen: value }));
    };

    const saveTime = (newTime: string) => {
        const value = dayjs(newTime, getFormat(), true);
        props.onValueChange({ hours: value.hour(), minutes: value.minute() });
    };

    const getTimeFromValue = () => {
        const trimmedNewValue = state.value.trimStart();
        const separator = trimmedNewValue.search(/\D/);
        const meridian = getMeridian(trimmedNewValue, getFormat());
        const { hours, minutes } = parseTimeNumbers(trimmedNewValue, separator);
        return formatTime(hours, minutes, meridian);
    };

    const handleInputChange = (newValue: string) => {
        setState((prevState) => ({ ...prevState, value: newValue }));
    };

    const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
        onToggle(true);
        props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isFocusReceiverInsideFocusLock(e)) return;
        onToggle(false);
        props.onBlur?.(e);

        if (state.value === '') {
            props.onValueChange(null);
            setState((prevState) => ({ ...prevState, value: null }));
        }

        if (!state.value) return;

        const result = getTimeFromValue();
        if (checkTimeFormat(result)) {
            saveTime(result);
        } else { saveValueFromProps(); }
    };

    const renderInput = (inputProps: IDropdownToggler) => {
        if (__DEV__) {
            if (props.size === '48') {
                devLogger.warnAboutDeprecatedPropValue<TimePickerProps, 'size'>({
                    component: 'TimePicker',
                    propName: 'size',
                    propValue: props.size,
                    propValueUseInstead: '42',
                    condition: () => ['48'].indexOf(props.size) !== -1,
                });
            }
        }
        return (
            <TextInput
                { ...inputProps }
                onClick={ null }
                size={ props.size || '36' }
                isDisabled={ props.isDisabled }
                isReadonly={ props.isReadonly }
                isInvalid={ props.isInvalid }
                cx={ [css.root, css.timepickerInput, props.inputCx] }
                value={ state.value }
                onValueChange={ handleInputChange }
                onCancel={ onClear }
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
        const { forwardedRef, ...timePickerBodyProps } = props;

        return (
            !props.isDisabled && !props.isReadonly && (
                <DropdownContainer { ...bodyProps } focusLock={ false }>
                    <TimePickerBody
                        { ...timePickerBodyProps }
                        value={ props.value !== null ? props.value : { hours: null, minutes: null } }
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
