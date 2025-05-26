import React, { useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { offset } from '@floating-ui/react';
import {
    DatePickerProps as CoreDatePickerProps, DropdownBodyProps, cx, useUuiContext, uuiMod, IDropdownTogglerProps, Overwrite,
} from '@epam/uui-core';
import { Dropdown } from '@epam/uui-components';
import { TextInput, TextInputProps } from '../inputs';
import { EditMode, IHasEditMode } from '../types';
import { DropdownContainer } from '../overlays';
import { DatePickerBody } from './DatePickerBody';
import {
    defaultFormat, isValidDate, toCustomDateFormat, toValueDateFormat,
} from './helpers';
import { settings } from '../../settings';

const defaultMode = EditMode.FORM;

type DatePickerMods = {
    /**
     * Defines component size.
     * @default '36'
     */
    size?: '24' | '30' | '36' | '42' | '48';
};

export interface DatePickerModsOverride {}

/**
 * Represents the properties of the DatePicker component
 */
export interface DatePickerProps extends CoreDatePickerProps, IHasEditMode, Overwrite<DatePickerMods, DatePickerModsOverride> {}

export function DatePickerComponent(props: DatePickerProps, ref: React.ForwardedRef<HTMLElement>) {
    const { format = defaultFormat, value, size = settings.datePicker.sizes.input } = props;
    const context = useUuiContext();
    const [inputValue, setInputValue] = useState(toCustomDateFormat(value, format));
    const [isBodyOpen, setBodyIsOpen] = useState(false);
    const targetRef = React.useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => targetRef.current);

    const onOpenChange = (isOpen: boolean) => {
        setBodyIsOpen(isOpen);
        if (isOpen && targetRef.current) {
            const inputElement = targetRef.current.querySelector<HTMLInputElement>('.uui-input');
            inputElement?.focus();
        }
    };

    const onInputChange = (newValue: string | null) => {
        if (isValidDate(newValue, format, props.filter)) {
            const newDateValue = toValueDateFormat(newValue, format);
            if (value !== newDateValue) {
                setInputValue(toCustomDateFormat(newDateValue, format));
                onValueChange(newDateValue);
            }
        } else {
            setInputValue(newValue || '');
        }
    };

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
        onOpenChange(false);
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        props.onBlur?.(e);

        if (isValidDate(inputValue, format, props.filter)) {
            setInputValue(toCustomDateFormat(inputValue, format));
            onValueChange(toValueDateFormat(inputValue, format));
        } else {
            const newValue = props.preventEmpty ? value : null;
            setInputValue(toCustomDateFormat(newValue, format));
            onValueChange(newValue);
        }
    };

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onOpenChange(true);
            e.preventDefault();
        }
    };

    const renderInput = (renderProps: IDropdownTogglerProps & { cx?: any }) => {
        const allowClear = !props.disableClear && !!inputValue && !props.preventEmpty;
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
                onValueChange={ onInputChange }
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
                ref={ (node) => { (renderProps as any).ref(node); targetRef.current = node; } }
                onClick={ () => renderProps.toggleDropdownOpening(true) }
            />
        );
    };

    const renderBody = useMemo(() => function (renderProps: DropdownBodyProps) {
        return (
            <DropdownContainer
                { ...renderProps }
                returnFocus={ true }
                shards={ [targetRef] }
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
    }, [value, onBodyValueChange]);

    return (
        <Dropdown
            ref={ ref }
            value={ isBodyOpen }
            onValueChange={ (v) => onOpenChange(v) }
            middleware={ [offset(6)] }
            placement={ props.placement }
            renderTarget={ (renderProps) => {
                return props.renderTarget?.(renderProps) || renderInput(renderProps);
            } }
            renderBody={ renderBody }
        />
    );
}

export const DatePicker = React.forwardRef(DatePickerComponent) as
    (props: DatePickerProps & { ref?: React.ForwardedRef<HTMLElement> }) => ReturnType<typeof DatePickerComponent>;
