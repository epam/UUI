import React, { useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import {
    IEditable, IHasCX, IClickable, IHasRawProps, RangeDatePickerInputType, devLogger, cx, uuiMod,
} from '@epam/uui-core';
import { TextInput } from '../inputs';
import { SizeMod } from '../types';
import { RangeDatePickerValue } from './RangeDatePickerBody';
import { defaultRangeValue } from './helpers';
import { InputType, RangeDatePickerProps } from './types';
import { systemIcons } from '../../icons/icons';
import { i18n } from '../../i18n';
import css from './RangeDatePicker.module.scss';

interface RangeDatePickerInputProps extends IEditable<RangeDatePickerValue>, IHasCX, IClickable, SizeMod {
    getPlaceholder?(type: InputType): string;
    disableClear?: boolean;
    rawPropsFrom?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps']
    rawPropsTo?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps']
    inFocus: RangeDatePickerInputType,
    onFocus: (event: React.FocusEvent<HTMLInputElement>, inputType: InputType) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>, inputType: InputType, newValue: RangeDatePickerValue) => void;
    filter?(day: Dayjs): boolean;
    id?: string;
}

export const RangeDatePickerInput = React.forwardRef<HTMLDivElement, RangeDatePickerInputProps>(({
    cx: classes,
    isDisabled,
    isInvalid,
    isReadonly,
    size,
    disableClear,
    rawPropsFrom,
    rawPropsTo,
    value: inputValue,
    inFocus,
    onClick,
    onValueChange,
    onFocus,
    onBlur,
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
        if (!filter || filter(dayjs(inputValue[inputType]))) {
            onBlur(event, inputType, inputValue);
        } else {
            onBlur(event, inputType, {
                ...inputValue,
                [inputType]: null,
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
                icon={ systemIcons[size || '36'].calendar }
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
                rawProps={ rawPropsFrom }
                id={ id }
            />
            <div className={ css.separator } />
            <TextInput
                cx={ cx(css.dateInput, css['size-' + (size || 36)], inFocus === 'to' && uuiMod.focus) }
                placeholder={ getPlaceholder ? getPlaceholder('to') : i18n.rangeDatePicker.pickerPlaceholderTo }
                size={ size || '36' }
                value={ inputValue.to }
                onCancel={ clearAllowed && (() => onValueChange(defaultRangeValue)) }
                onValueChange={ (v) => onInputChange(v, 'to') }
                onFocus={ (e) => handleFocus(e, 'to') }
                onBlur={ (e) => handleBlur(e, 'to') }
                isInvalid={ isInvalid }
                isDisabled={ isDisabled }
                isReadonly={ isReadonly }
                isDropdown={ false }
                rawProps={ rawPropsTo }
            />
        </div>
    );
});
