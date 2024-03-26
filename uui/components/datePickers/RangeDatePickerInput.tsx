import React, { forwardRef, useEffect } from 'react';
import dayjs from 'dayjs';
import {
    IEditable, devLogger, cx, uuiMod, IHasCX, IClickable,
} from '@epam/uui-core';
import { TextInput } from '../inputs';
import { SizeMod } from '../types';
import {
    RangeDatePickerInputType, RangeDatePickerProps, RangeDatePickerValue,
} from './types';
import { systemIcons } from '../../icons/icons';
import { i18n } from '../../i18n';
import css from './RangeDatePicker.module.scss';
import {
    defaultRangeValue, isValidRange, toCustomDateRangeFormat, toValueDateRangeFormat,
} from './helpers';

/**
 * Represents RangeDatePickerInputProps
 */
export interface RangeDatePickerInputProps
    extends IEditable<RangeDatePickerValue>,
    IHasCX,
    SizeMod,
    IClickable,
    Pick<RangeDatePickerProps, 'getPlaceholder' | 'disableClear' | 'filter' | 'id' | 'format' | 'rawProps'> {
    /**
     * Currently setting date
     */
    inFocus: RangeDatePickerInputType,
    /**
     * Handles blur event on input wrapper element
    */
    onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
    /**
    * Handles focus event on input element
    */
    onInputFocus: (event: React.FocusEvent<HTMLInputElement>, inputType: RangeDatePickerInputType) => void;
    /**
    * Handles blur event on input element
     */
    onInputBlur: (event: React.FocusEvent<HTMLInputElement>, inputType: RangeDatePickerInputType, newValues: {
        selectedDate: RangeDatePickerValue;
        inputValue: RangeDatePickerValue;
    }) => void;
    /**
     * Clears inputs
     */
    onClear: (value: RangeDatePickerValue) => void;
}

export const RangeDatePickerInput = forwardRef<HTMLDivElement, RangeDatePickerInputProps>(({
    isDisabled,
    isInvalid,
    isReadonly,
    size,
    disableClear,
    rawProps,
    value: inputValue,
    inFocus,
    format,
    onValueChange,
    onBlur,
    onInputFocus,
    onInputBlur,
    onClick,
    onClear,
    getPlaceholder,
    filter,
    id,
    cx: classes,
}, ref): JSX.Element => {
    useEffect(() => {
        if (__DEV__) {
            if (size === '48') {
                devLogger.warnAboutDeprecatedPropValue<RangeDatePickerProps, 'size'>({
                    component: 'RangeDatePicker',
                    propName: 'size',
                    propValue: size,
                    propValueUseInstead: '42',
                    condition: () => ['48'].indexOf(size) !== -1,
                });
            }
        }
    }, [size]);

    const onInputChange = (newValue: string, inputType: 'from' | 'to') => {
        const newInputValue = {
            ...inputValue,
            [inputType]: newValue,
        };

        onValueChange(newInputValue);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>, inputType: RangeDatePickerInputType) => {
        onInputFocus(event, inputType);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>, inputType: 'from' | 'to') => {
        const selectedDate = toValueDateRangeFormat(inputValue, format);

        if (isValidRange(selectedDate) && (!filter || filter(dayjs(selectedDate[inputType])))) {
            onInputBlur(event, inputType, {
                inputValue: toCustomDateRangeFormat(selectedDate, format),
                selectedDate,
            });
        } else {
            onInputBlur(event, inputType, {
                inputValue: {
                    ...inputValue,
                    [inputType]: null,
                },
                selectedDate: {
                    ...selectedDate,
                    [inputType]: null,
                },
            });
        }
    };

    const clearAllowed = !disableClear && inputValue.from && inputValue.to;

    return (
        <div
            ref={ ref }
            className={ cx(
                classes,
                css.dateInputGroup,
                isDisabled && uuiMod.disabled,
                isReadonly && uuiMod.readonly,
                isInvalid && uuiMod.invalid,
                inFocus && uuiMod.focus,
            ) }
            onClick={ (event) => {
                if (!isDisabled) {
                    onClick?.(event);
                }
            } }
            onBlur={ onBlur }
        >
            <TextInput
                icon={ systemIcons.calendar }
                cx={ cx(css.dateInput, css['size-' + (size || 36)], inFocus === 'from' && uuiMod.focus) }
                size={ size || '36' }
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
                id={ id }
            />
            <div className={ css.separator } />
            <TextInput
                cx={ cx(css.dateInput, css['size-' + (size || 36)], inFocus === 'to' && uuiMod.focus) }
                placeholder={ getPlaceholder ? getPlaceholder('to') : i18n.rangeDatePicker.pickerPlaceholderTo }
                size={ size || '36' }
                value={ inputValue.to || undefined }
                onCancel={ () => {
                    if (clearAllowed) {
                        onClear(defaultRangeValue);
                    }
                } }
                onValueChange={ (v) => onInputChange(v || '', 'to') }
                onFocus={ (e) => handleFocus(e, 'to') }
                onBlur={ (e) => handleBlur(e, 'to') }
                isInvalid={ isInvalid }
                isDisabled={ isDisabled }
                isReadonly={ isReadonly }
                isDropdown={ false }
                rawProps={ rawProps?.to }
            />
        </div>
    );
});
