import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import {
    IEditable, IHasCX, IClickable, RangeDatePickerInputType, devLogger, cx, uuiMod,
} from '@epam/uui-core';
import { toCustomDateRangeFormat, toValueDateRangeFormat } from '@epam/uui-components';
import { TextInput } from '../inputs';
import { SizeMod } from '../types';
import {
    InputType, RangeDatePickerProps, RangeDatePickerValue,
} from './types';
import { systemIcons } from '../../icons/icons';
import { i18n } from '../../i18n';
import css from './RangeDatePicker.module.scss';
import { defaultRangeValue, isValidRange } from './helpers';

interface RangeDatePickerInputProps extends IEditable<RangeDatePickerValue>,
    IHasCX,
    IClickable,
    SizeMod,
    Pick<RangeDatePickerProps, 'getPlaceholder' | 'disableClear' | 'filter' | 'id' | 'format' | 'rawProps'> {
    inFocus: RangeDatePickerInputType,
    onFocus: (event: React.FocusEvent<HTMLInputElement>, inputType: InputType) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>, inputType: InputType, newValues: {
        selectedDate: RangeDatePickerValue;
        inputValue: RangeDatePickerValue;
    }) => void;
    onClear: (value: RangeDatePickerValue) => void;
}

export const RangeDatePickerInput = React.forwardRef<HTMLDivElement, RangeDatePickerInputProps>(({
    cx: classes,
    isDisabled,
    isInvalid,
    isReadonly,
    size,
    disableClear,
    rawProps,
    value: inputValue,
    inFocus,
    format,
    onClick,
    onValueChange,
    onFocus,
    onBlur,
    onClear,
    getPlaceholder,
    filter,
    id,
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

    const onInputChange = (newValue: string, inputType: InputType) => {
        const newInputValue = {
            ...inputValue,
            [inputType]: newValue,
        };

        onValueChange(newInputValue);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>, inputType: InputType) => {
        onFocus(event, inputType);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>, inputType: InputType) => {
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
        <div
            ref={ ref }
            className={ cx(classes) }
            onClick={ onClick }
        >
            <TextInput
                icon={ systemIcons.calendar }
                cx={ cx(css.dateInput, css['size-' + (size || 36)], inFocus === 'from' && uuiMod.focus) }
                size={ size || '36' }
                placeholder={ getPlaceholder ? getPlaceholder('from') : i18n.rangeDatePicker.pickerPlaceholderFrom }
                value={ inputValue.from }
                onValueChange={ (v) => onInputChange(v, 'from') }
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
                value={ inputValue.to }
                onCancel={ () => {
                    if (clearAllowed) {
                        onClear(defaultRangeValue);
                    }
                } }
                onValueChange={ (v) => onInputChange(v, 'to') }
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
