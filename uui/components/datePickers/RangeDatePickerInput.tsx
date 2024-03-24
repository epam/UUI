import React, { Fragment, useEffect } from 'react';
import dayjs from 'dayjs';
import {
    IEditable, devLogger, cx, uuiMod,
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

export interface RangeDatePickerInputProps extends IEditable<RangeDatePickerValue>,
    SizeMod,
    Pick<RangeDatePickerProps, 'getPlaceholder' | 'disableClear' | 'filter' | 'id' | 'format' | 'rawProps'> {
    inFocus: RangeDatePickerInputType,
    onFocus: (event: React.FocusEvent<HTMLInputElement>, inputType: RangeDatePickerInputType) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>, inputType: RangeDatePickerInputType, newValues: {
        selectedDate: RangeDatePickerValue;
        inputValue: RangeDatePickerValue;
    }) => void;
    onClear: (value: RangeDatePickerValue) => void;
}

export function RangeDatePickerInput({
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
    onFocus,
    onBlur,
    onClear,
    getPlaceholder,
    filter,
    id,
}: RangeDatePickerInputProps): JSX.Element {
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
        onFocus(event, inputType);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>, inputType: 'from' | 'to') => {
        const selectedDate = toValueDateRangeFormat(inputValue, format);

        if (isValidRange(selectedDate) && (!filter || filter(dayjs(selectedDate[inputType])))) {
            onBlur(event, inputType, {
                inputValue: toCustomDateRangeFormat(selectedDate, format),
                selectedDate,
            });
        } else {
            onBlur(event, inputType, {
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
        <Fragment>
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
        </Fragment>
    );
}
