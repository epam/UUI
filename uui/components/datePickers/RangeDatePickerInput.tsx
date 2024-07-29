import React, {
    forwardRef, useEffect, useState,
} from 'react';
import { uuiDayjs } from '../../helpers/dayJsHelper';
import {
    IEditable, cx, uuiMod, IHasCX, IClickable, IHasRawProps,
} from '@epam/uui-core';
import { TextInput, TextInputProps } from '../inputs';
import {
    RangeDatePickerInputType, RangeDatePickerProps, RangeDatePickerValue,
} from './types';
import { systemIcons } from '../../icons/icons';
import { i18n } from '../../i18n';
import css from './RangeDatePicker.module.scss';
import {
    defaultRangeValue, isValidRange, toCustomDateRangeFormat, toValueDateRangeFormat,
} from './helpers';
import { settings } from '../../settings';

/**
 * Represents RangeDatePickerInputProps
 */
export interface RangeDatePickerInputProps
    extends IEditable<RangeDatePickerValue>,
    IHasCX,
    IClickable,
    Pick<RangeDatePickerProps, 'getPlaceholder' | 'disableClear' | 'filter' | 'id' | 'format'> {
    /**
     * Defines component size.
     */
    size?: '24' | '30' | '36' | '42' | '48';
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
        setInputValue({
            ...inputValue,
            [inputType]: newValue,
        });
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>, inputType: RangeDatePickerInputType) => {
        onFocusInput(event, inputType);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>, inputType: 'from' | 'to') => {
        onBlurInput?.(event, inputType);

        const selectedDate = toValueDateRangeFormat(inputValue, format);
        if (isValidRange(selectedDate) && (!filter || filter(uuiDayjs.dayjs(selectedDate[inputType])))) {
            setInputValue(toCustomDateRangeFormat(selectedDate, format));
            onValueChange(selectedDate);
        } else {
            setInputValue({
                ...inputValue,
                [inputType]: null,
            });
            onValueChange({
                ...selectedDate,
                [inputType]: null,
            });
        }
    };
    
    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onClick(); 
            e.preventDefault();
        }
    };

    const clearAllowed = !disableClear && inputValue.from && inputValue.to;
    return (
        <div
            ref={ ref }
            className={ cx(
                classes,
                css.dateInputGroup,
                'uui-range-date-picker',
                isDisabled && uuiMod.disabled,
                isReadonly && uuiMod.readonly,
                isInvalid && uuiMod.invalid,
                inFocus && uuiMod.focus,
            ) }
        >
            <TextInput
                icon={ systemIcons.calendar }
                cx={ cx(css.dateInput, inFocus === 'from' && uuiMod.focus) }
                size={ size || settings.sizes.defaults.rangeDatePicker as TextInputProps['size'] }
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
                size={ size || settings.sizes.defaults.rangeDatePicker as TextInputProps['size'] }
                value={ inputValue.to || undefined }
                onCancel={ clearAllowed ? () => {
                    onValueChange(defaultRangeValue);
                } : undefined }
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
