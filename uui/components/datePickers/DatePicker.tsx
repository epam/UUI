import React, { useEffect, useState } from 'react';
import { Dropdown } from '@epam/uui-components';
import {
    DropdownBodyProps, IDropdownToggler, cx, devLogger, isFocusReceiverInsideFocusLock, useUuiContext, uuiMod, withMods,
} from '@epam/uui-core';
import { TextInput } from '../inputs';
import { EditMode } from '../types';
import { systemIcons } from '../../icons/icons';
import { DropdownContainer } from '../overlays';
import { DatePickerProps } from './types';
import {
    defaultFormat, isValidDate, toCustomDateFormat, toValueDateFormat,
} from './helpers';
import { DatePickerBody } from './DatePickerBody';

const defaultMode = EditMode.FORM;
const modifiers = [{
    name: 'offset',
    options: { offset: [0, 6] },
}];

export function DatePickerComponent(props: DatePickerProps) {
    const { format = defaultFormat, value } = props;
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
        if (isFocusReceiverInsideFocusLock(e)) return;
        props.onBlur?.(e);

        if (isValidDate(inputValue, format, props.filter)) {
            setInputValue(toCustomDateFormat(inputValue, format));
            onValueChange(toValueDateFormat(inputValue, format));
        } else {
            setInputValue(null);
            onValueChange(null);
        }
        setBodyIsOpen(false);
    };

    const renderInput = (renderProps: IDropdownToggler & { cx?: any }) => {
        if (__DEV__) {
            if (props.size === '48') {
                devLogger.warnAboutDeprecatedPropValue<DatePickerProps, 'size'>({
                    component: 'DatePicker',
                    propName: 'size',
                    propValue: props.size,
                    propValueUseInstead: '42',
                    condition: () => ['48'].indexOf(props.size || '') !== -1,
                });
            }
        }
        return (
            <TextInput
                { ...renderProps }
                // fixes a bug with body open, it skips unwanted prevent default
                onClick={ () => {} }
                isDropdown={ false }
                cx={ cx(props.inputCx, isBodyOpen && uuiMod.focus) }
                icon={ props.mode !== EditMode.CELL && systemIcons.calendar ? systemIcons.calendar : undefined }
                iconPosition={ props.iconPosition || 'left' }
                placeholder={ props.placeholder ? props.placeholder : format }
                size={ props.size || '36' }
                value={ inputValue || undefined }
                onValueChange={ (v) => {
                    setInputValue(v || '');
                } }
                onCancel={ () => {
                    if (!props.disableClear && !!inputValue) {
                        onValueChange(null);
                    }
                } }
                isInvalid={ props.isInvalid }
                isDisabled={ props.isDisabled }
                isReadonly={ props.isReadonly }
                tabIndex={ props.isReadonly || props.isDisabled ? -1 : 0 }
                onFocus={ (e) => {
                    setBodyIsOpen(true);
                    props.onFocus?.(e);
                } }
                onBlur={ onBlur }
                mode={ props.mode || defaultMode }
                rawProps={ props.rawProps?.input }
                id={ props.id }
            />
        );
    };

    const renderBody = (renderProps: DropdownBodyProps) => {
        return (
            <DropdownContainer
                { ...renderProps }
                focusLock={ false }
            >
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
            forwardedRef={ props.forwardedRef }
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

export const DatePicker = withMods(DatePickerComponent);
