import React, { forwardRef, useEffect, useState, type JSX } from 'react';
import { IEditable, cx, uuiMod, IHasCX, IClickable, IHasRawProps, RangeDatePickerValue, RangeDatePickerInputType } from '@epam/uui-core';
import { TextInput } from '../inputs';
import { toCustomDateRangeFormat, toValueDateRangeFormat, isValidAndInFilter } from './helpers';
import type { RangeDatePickerProps } from './RangeDatePicker';

import { i18n } from '../../i18n';
import { settings } from '../../settings';

import css from './RangeDatePickerInput.module.scss';

/**
 * Represents RangeDatePickerInputProps
 */
export interface RangeDatePickerInputProps
    extends IEditable<RangeDatePickerValue>,
    IHasCX,
    IClickable,
    Pick<RangeDatePickerProps, 'getPlaceholder' | 'disableClear' | 'filter' | 'id' | 'format' | 'size' | 'preventEmptyFromDate' | 'preventEmptyToDate'> {
    /**
     * rawProps as HTML attributes
     */
    rawProps?: {
        /**
         * Any HTML attributes (native or 'data-') to put on 'from' input
         */
        from?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        /**
         * Any HTML attributes (native or 'data-') to put on 'to' input
         */
        to?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    };
    /**
     * Currently setting date
     */
    inFocus: RangeDatePickerInputType,
    /**
     * Handles focus event on input element
    */
    onFocusInput: (event: React.FocusEvent<HTMLInputElement>, inputType: RangeDatePickerInputType) => void;
    /**
    * Handles blur event on input element
   */
    onBlurInput?: (event: React.FocusEvent<HTMLInputElement, Element>, inputType: RangeDatePickerInputType) => void;

    /** Called on keyDown event.
     Can be used to provide your own handlers.
     */
    onKeyDown?(e: React.KeyboardEvent<HTMLDivElement>): void;
}

export const RangeDatePickerInput = forwardRef<HTMLDivElement, RangeDatePickerInputProps>(({
    isDisabled,
    isInvalid,
    isReadonly,
    size,
    disableClear,
    rawProps,
    value,
    inFocus,
    format,
    onValueChange,
    onFocusInput,
    onBlurInput,
    onClick,
    getPlaceholder,
    filter,
    onKeyDown,
    preventEmptyFromDate,
    preventEmptyToDate,
    id,
    cx: classes,
}, ref): JSX.Element => {
    const [inputValue, setInputValue] = useState<RangeDatePickerValue>(
        toCustomDateRangeFormat(value, format),
    );

    useEffect(() => {
        setInputValue(toCustomDateRangeFormat(value, format));
    }, [format, value, setInputValue]);

    const onInputChange = (newValue: string, inputType: 'from' | 'to') => {
        const updatedInputValue = {
            ...inputValue,
            [inputType]: newValue,
        };

        setInputValue(updatedInputValue);

        const selectedDate = toValueDateRangeFormat(updatedInputValue, format);

        if (isValidAndInFilter(selectedDate, inputType, filter)) {
            onValueChange(selectedDate);
        }
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>, inputType: RangeDatePickerInputType) => {
        onFocusInput(event, inputType);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>, inputType: 'from' | 'to') => {
        onBlurInput?.(event, inputType);

        const canBeEmpty = {
            from: !preventEmptyFromDate,
            to: !preventEmptyToDate,
        };

        const selectedDate = toValueDateRangeFormat(inputValue, format);

        // If the new value is null and the input can't be empty, set the value to the last selected value
        if (selectedDate[inputType] === null && !canBeEmpty[inputType]) {
            selectedDate[inputType] = value[inputType];
        }

        if (isValidAndInFilter(selectedDate, inputType, filter)) {
            setInputValue(toCustomDateRangeFormat(selectedDate, format));
            onValueChange(selectedDate);
        } else {
            const newValue = !canBeEmpty[inputType] ? value[inputType] : null;

            setInputValue({
                ...inputValue,
                [inputType]: newValue,
            });
            onValueChange({
                ...selectedDate,
                [inputType]: newValue,
            });
        }
    };

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onClick();
            e.preventDefault();
        }
    };

    const onClear = () => {
        const newValue = {
            from: preventEmptyFromDate ? value.from : null,
            to: preventEmptyToDate ? value.to : null,
        };

        onValueChange(newValue);
    };

    const clearAllowed = !disableClear && !(preventEmptyFromDate && preventEmptyToDate) && inputValue.from && inputValue.to;
    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            ref={ ref }
            className={ cx(
                `uui-size-${size || settings.rangeDatePicker.sizes.default}`,
                'uui-range-date-picker',
                classes,
                css.root,
                isDisabled && uuiMod.disabled,
                isReadonly && uuiMod.readonly,
                isInvalid && uuiMod.invalid,
                inFocus && uuiMod.focus,
            ) }
            onKeyDown={ onKeyDown }
        >
            <TextInput
                icon={ settings.rangeDatePicker.icons.input.calendarIcon }
                cx={ cx(css.dateInput, inFocus === 'from' && uuiMod.focus) }
                size={ size || settings.rangeDatePicker.sizes.default }
                placeholder={ getPlaceholder ? getPlaceholder('from') : i18n.rangeDatePicker.pickerPlaceholderFrom }
                value={ inputValue.from || undefined }
                onValueChange={ (v) => onInputChange(v || '', 'from') }
                onFocus={ (event) => handleFocus(event, 'from') }
                onBlur={ (event) => handleBlur(event, 'from') }
                isInvalid={ isInvalid }
                isDisabled={ isDisabled }
                isReadonly={ isReadonly }
                isDropdown={ false }
                rawProps={ rawProps?.from }
                onClick={ onClick }
                onKeyDown={ onInputKeyDown }
                id={ id }
            />
            <div className={ css.separator } />
            <TextInput
                cx={ cx(css.dateInput, inFocus === 'to' && uuiMod.focus) }
                placeholder={ getPlaceholder ? getPlaceholder('to') : i18n.rangeDatePicker.pickerPlaceholderTo }
                size={ size || settings.rangeDatePicker.sizes.default }
                value={ inputValue.to || undefined }
                onCancel={ clearAllowed ? onClear : undefined }
                onValueChange={ (v) => onInputChange(v || '', 'to') }
                onFocus={ (e) => handleFocus(e, 'to') }
                onBlur={ (e) => handleBlur(e, 'to') }
                isInvalid={ isInvalid }
                isDisabled={ isDisabled }
                isReadonly={ isReadonly }
                isDropdown={ false }
                rawProps={ rawProps?.to }
                onClick={ onClick }
                onKeyDown={ onInputKeyDown }
            />
        </div>
    );
});
