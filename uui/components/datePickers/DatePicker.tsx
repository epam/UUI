import React from 'react';
import { Dropdown, supportedDateFormats, toCustomDateFormat, toValueDateFormat } from '@epam/uui-components';
import { DatePickerCoreProps, DropdownBodyProps, IDropdownToggler, cx, devLogger, isFocusReceiverInsideFocusLock, uuiMod, withMods } from '@epam/uui-core';
import { TextInput } from '../inputs';
import { EditMode, IHasEditMode, SizeMod } from '../types';
import { systemIcons } from '../../icons/icons';
import { DropdownContainer } from '../overlays';
import { DatePickerBody } from './DatePickerBody';
import { useDatePickerState } from './useDatePickerState';
import dayjs from 'dayjs';

const defaultMode = EditMode.FORM;

/** Represents the properties of the DatePicker component. */
export interface DatePickerProps extends DatePickerCoreProps, SizeMod, IHasEditMode {
    /**
    * HTML ID attribute for the toggler input
    */
    id?: string;
}

export function DatePickerComponent(allProps: DatePickerProps) {
    const {
        filter,
        renderDay,
        isHoliday,
        renderFooter,
        ...props
    } = allProps;

    const {
        state,
        handleValueChange,
        setState,
        onToggle,
        getValue,
        setSelectedDate,
        setDisplayedDateAndView,
        getFormat,
    } = useDatePickerState(allProps);

    const handleInputChange = (inputValue: string) => {
        const resultValue = toValueDateFormat(inputValue, getFormat());
        if (getIsValidDate(inputValue)) {
            handleValueChange(resultValue);
            setState({ inputValue });
        } else {
            setState({ inputValue });
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        onToggle(true);
        props.onFocus?.(e);
    };

    const getIsValidDate = (inputValue: string) => {
        if (!inputValue) return false;
        const parsedDate = dayjs(inputValue, supportedDateFormats(getFormat()), true);
        const isValidDate = parsedDate.isValid();
        if (!isValidDate) return false;
        return filter ? filter(parsedDate) : true;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isFocusReceiverInsideFocusLock(e)) return;
        onToggle(false);
        if (getIsValidDate(state.inputValue)) {
            setState({ inputValue: toCustomDateFormat(state.inputValue, getFormat()) });
        } else {
            if (state.inputValue !== '' && state.inputValue != null) {
                handleValueChange(null);
                setState({ inputValue: null, selectedDate: null });
            }
        }
    };

    const handleCancel = () => {
        handleValueChange(null);
        setState({ inputValue: null, selectedDate: null });
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
                cx={ cx(props.inputCx, state.isOpen && uuiMod.focus) }
                icon={ props.mode !== EditMode.CELL && systemIcons[props.size || '36'].calendar }
                iconPosition={ props.iconPosition || 'left' }
                placeholder={ props.placeholder ? props.placeholder : getFormat() }
                size={ props.size || '36' }
                value={ state.inputValue }
                onValueChange={ handleInputChange }
                onCancel={ props.disableClear || !state.inputValue ? undefined : handleCancel }
                isInvalid={ props.isInvalid }
                isDisabled={ props.isDisabled }
                isReadonly={ props.isReadonly }
                tabIndex={ props.isReadonly || props.isDisabled ? -1 : 0 }
                onFocus={ handleFocus }
                onBlur={ handleBlur }
                mode={ props.mode || defaultMode }
                rawProps={ props.rawProps?.input }
            />
        );
    };

    const renderBody = (renderProps: DropdownBodyProps) => {
        return (
            <DropdownContainer { ...renderProps } focusLock={ false }>
                <DatePickerBody
                    cx={ cx(props.bodyCx) }
                    filter={ filter }
                    value={ getValue() }
                    setSelectedDate={ setSelectedDate }
                    setDisplayedDateAndView={ setDisplayedDateAndView }
                    changeIsOpen={ onToggle }
                    renderDay={ renderDay }
                    isHoliday={ isHoliday }
                    rawProps={ props.rawProps?.body }
                />
                {renderFooter?.()}
            </DropdownContainer>
        );
    };

    return (
        <Dropdown
            renderTarget={ (renderProps) => (props.renderTarget ? props.renderTarget?.(renderProps) : renderInput(renderProps)) }
            renderBody={ (renderProps) => !props.isDisabled && !props.isReadonly && renderBody(renderProps) }
            onValueChange={ !props.isDisabled && !props.isReadonly ? onToggle : null }
            value={ state.isOpen }
            modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
            placement={ props.placement }
            forwardedRef={ props.forwardedRef }
        />
    );
}

export const DatePicker = withMods(DatePickerComponent);
