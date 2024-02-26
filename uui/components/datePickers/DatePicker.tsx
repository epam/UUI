import React from 'react';
import { Dropdown, PickerBodyValue, defaultFormat, toCustomDateFormat, toValueDateFormat } from '@epam/uui-components';
import { DatePickerCoreProps, DropdownBodyProps, IDropdownToggler, cx, devLogger, isFocusReceiverInsideFocusLock, uuiMod, withMods } from '@epam/uui-core';
import { TextInput } from '../inputs';
import { EditMode, IHasEditMode, SizeMod } from '../types';
import { systemIcons } from '../../icons/icons';
import { DropdownContainer } from '../overlays';
import { DatePickerBody } from './DatePickerBody';
import dayjs from 'dayjs';
import { isValidDate, useDatePickerState } from './useDatePickerState';
import utc from 'dayjs/plugin/utc.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const defaultMode = EditMode.FORM;
const modifiers = [{
    name: 'offset',
    options: { offset: [0, 6] },
}];

/** Represents the properties of the DatePicker component. */
export interface DatePickerProps extends DatePickerCoreProps, SizeMod, IHasEditMode {
    /**
    * HTML ID attribute for the toggler input
    */
    id?: string;
}

export function DatePickerComponent(props: DatePickerProps) {
    const { format = defaultFormat, value } = props;
    const inputValue = toCustomDateFormat(value, format) || value;

    const {
        isOpen,
        view,
        month,
        handleBodyChange,
        handleValueChange,
        toggleIsOpen,
    } = useDatePickerState(props);

    const onInputChange = (input: string) => {
        const resultValue = toValueDateFormat(input, format);
        if (isValidDate(input, format, props.filter)) {
            handleValueChange(resultValue);
        } else {
            handleValueChange(input);
        }
    };

    const onBodyValueChange = (v: PickerBodyValue<string>) => {
        handleBodyChange(v);
        if (isValidDate(value, format, props.filter) && value !== v.selectedDate) {
            toggleIsOpen(false);
        }
    };

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        toggleIsOpen(true);
        props.onFocus?.(e);
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isFocusReceiverInsideFocusLock(e)) return;
        toggleIsOpen(false);

        if (!isValidDate(inputValue, format, props.filter)) {
            handleValueChange(null);
        }
    };

    const onCancel = () => {
        handleValueChange(null);
        toggleIsOpen(false);
    };

    const onDropDownChange = (newValue: boolean) => {
        if (!props.isDisabled && !props.isReadonly) {
            toggleIsOpen(newValue);
        }
    };

    const renderInput = (renderProps: IDropdownToggler & { cx?: any }) => {
        if (__DEV__) {
            if (props.size === '48') {
                devLogger.warnAboutDeprecatedPropValue<DatePickerProps, 'size'>({
                    component: 'DatePicker',
                    propName: 'size',
                    propValue: props.size,
                    propValueUseInstead: '42',
                    condition: () => ['48'].indexOf(props.size) !== -1,
                });
            }
        }
        return (
            <TextInput
                { ...renderProps }
                onClick={ null }
                isDropdown={ false }
                cx={ cx(props.inputCx, isOpen && uuiMod.focus) }
                icon={ props.mode !== EditMode.CELL && systemIcons[props.size || '36'].calendar }
                iconPosition={ props.iconPosition || 'left' }
                placeholder={ props.placeholder ? props.placeholder : format }
                size={ props.size || '36' }
                value={ inputValue }
                onValueChange={ onInputChange }
                onCancel={ props.disableClear || !inputValue ? undefined : onCancel }
                isInvalid={ props.isInvalid }
                isDisabled={ props.isDisabled }
                isReadonly={ props.isReadonly }
                tabIndex={ props.isReadonly || props.isDisabled ? -1 : 0 }
                onFocus={ onFocus }
                onBlur={ onBlur }
                mode={ props.mode || defaultMode }
                rawProps={ props.rawProps?.input }
                id={ props.id }
            />
        );
    };

    const renderBody = (renderProps: DropdownBodyProps) => {
        return (
            <DropdownContainer { ...renderProps } focusLock={ false }>
                <DatePickerBody
                    value={ {
                        selectedDate: isValidDate(value, format, props.filter) ? value : null,
                        month,
                        view,
                    } }
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
            renderTarget={ (renderProps) => (props.renderTarget ? props.renderTarget?.(renderProps) : renderInput(renderProps)) }
            renderBody={ (renderProps) => !props.isDisabled && !props.isReadonly && renderBody(renderProps) }
            onValueChange={ onDropDownChange }
            value={ isOpen }
            modifiers={ modifiers }
            placement={ props.placement }
            forwardedRef={ props.forwardedRef }
        />
    );
}

export const DatePicker = withMods(DatePickerComponent);
