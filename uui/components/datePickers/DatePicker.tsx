import React, { useEffect, useState } from 'react';
import {
    DropdownBodyProps, IDropdownToggler, cx, useUuiContext, uuiMod,
} from '@epam/uui-core';
import { Dropdown } from '@epam/uui-components';
import { TextInput, TextInputProps } from '../inputs';
import { EditMode } from '../types';
import { DropdownContainer } from '../overlays';
import { DatePickerBody } from './DatePickerBody';
import { DatePickerProps } from './types';
import {
    defaultFormat, isValidDate, toCustomDateFormat, toValueDateFormat,
} from './helpers';
import { settings } from '../../settings';

const defaultMode = EditMode.FORM;
const modifiers = [{
    name: 'offset',
    options: { offset: [0, 6] },
}];

export function DatePicker(props: DatePickerProps & React.RefAttributes<HTMLElement>) {
    const { format = defaultFormat, value, size = settings.datePicker.sizes.input } = props;
    const context = useUuiContext();
    const [inputValue, setInputValue] = useState(toCustomDateFormat(value, format));
    const [isBodyOpen, setBodyIsOpen] = useState(false);

    useEffect(() => {
        setInputValue(toCustomDateFormat(value, format));
    }, [value, setInputValue]);

    const onValueChange = (newValue: string | null) => {
        if (value !== newValue) {
            props.onValueChange(newValue);

            if (props.getValueChangeAnalyticsEvent) {
                const event = props.getValueChangeAnalyticsEvent(newValue, value);
                context.uuiAnalytics.sendEvent(event);
            }
        }
    };

    const onBodyValueChange = (newValue: string | null) => {
        setInputValue(toCustomDateFormat(newValue, format));
        onValueChange(newValue);
        setBodyIsOpen(false);
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        props.onBlur?.(e);

        if (isValidDate(inputValue, format, props.filter)) {
            setInputValue(toCustomDateFormat(inputValue, format));
            onValueChange(toValueDateFormat(inputValue, format));
        } else {
            setInputValue(null);
            onValueChange(null);
        }
    };

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setBodyIsOpen(true);
            e.preventDefault();
        }
    };

    const renderInput = (renderProps: IDropdownToggler & { cx?: any }) => {
        const allowClear = !props.disableClear && !!inputValue;
        return (
            <TextInput
                { ...renderProps }
                isDropdown={ false }
                cx={ cx(props.inputCx, isBodyOpen && uuiMod.focus) }
                icon={ props.mode !== EditMode.CELL ? settings.datePicker.icons.input.calendarIcon : undefined }
                iconPosition={ props.iconPosition || 'left' }
                placeholder={ props.placeholder ? props.placeholder : format }
                size={ size as TextInputProps['size'] }
                value={ inputValue || undefined }
                onValueChange={ (v) => {
                    setInputValue(v || '');
                } }
                onCancel={ allowClear ? () => {
                    if (!props.disableClear && !!inputValue) {
                        onValueChange(null);
                    }
                } : undefined }
                isInvalid={ props.isInvalid }
                isDisabled={ props.isDisabled }
                isReadonly={ props.isReadonly }
                tabIndex={ props.isReadonly || props.isDisabled ? -1 : 0 }
                onFocus={ (e) => {
                    props.onFocus?.(e);
                } }
                onKeyDown={ onInputKeyDown }
                onBlur={ onBlur }
                mode={ props.mode || defaultMode }
                rawProps={ props.rawProps?.input }
                id={ props.id }
            />
        );
    };

    const renderBody = (renderProps: DropdownBodyProps) => {
        return (
            <DropdownContainer { ...renderProps }>
                <DatePickerBody
                    value={ value }
                    onValueChange={ onBodyValueChange }
                    cx={ cx(props.bodyCx) }
                    filter={ props.filter }
                    isHoliday={ props.isHoliday }
                    renderDay={ props.renderDay }
                    rawProps={ props.rawProps?.body }
                />
                {props.renderFooter?.()}
            </DropdownContainer>
        );
    };

    return (
        <Dropdown
            value={ isBodyOpen }
            modifiers={ modifiers }
            placement={ props.placement }
            forwardedRef={ props.ref }
            onValueChange={ (v) => {
                setBodyIsOpen(v);
            } }
            renderTarget={ (renderProps) => {
                return props.renderTarget?.(renderProps) || renderInput(renderProps);
            } }
            renderBody={ (renderProps) => {
                return renderBody(renderProps);
            } }
        />
    );
}
