import React from 'react';
import { Dropdown, defaultFormat } from '@epam/uui-components';
import { DatePickerCoreProps, DropdownBodyProps, IDropdownToggler, cx, devLogger, uuiMod, withMods } from '@epam/uui-core';
import { TextInput } from '../inputs';
import { EditMode, IHasEditMode, SizeMod } from '../types';
import { systemIcons } from '../../icons/icons';
import { DropdownContainer } from '../overlays';
import { DatePickerBody } from './DatePickerBody';
import { useDatePickerState } from './useDatePickerState';

const defaultMode = EditMode.FORM;

/** Represents the properties of the DatePicker component. */
export interface DatePickerProps extends DatePickerCoreProps, SizeMod, IHasEditMode {
    /**
    * HTML ID attribute for the toggler input
    */
    id?: string;
}

export function DatePickerComponent(props: DatePickerProps) {
    const { format = defaultFormat } = props;
    const {
        state,
        handleInputChange,
        handleFocus,
        handleBlur,
        handleCancel,
        handleToggle,
        setDisplayedDateAndView,
        setSelectedDate,
    } = useDatePickerState(props);

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
                placeholder={ props.placeholder ? props.placeholder : format }
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
                id={ props.id }
            />
        );
    };

    const renderBody = (renderProps: DropdownBodyProps) => {
        const value = {
            selectedDate: state.selectedDate,
            displayedDate: state.displayedDate,
            view: state.view,
        };

        return (
            <DropdownContainer { ...renderProps } focusLock={ false }>
                <DatePickerBody
                    cx={ cx(props.bodyCx) }
                    filter={ props.filter }
                    isHoliday={ props.isHoliday }
                    renderDay={ props.renderDay }
                    rawProps={ props.rawProps?.body }
                    value={ value }
                    changeIsOpen={ handleToggle }
                    setDisplayedDateAndView={ setDisplayedDateAndView }
                    setSelectedDate={ setSelectedDate }
                />
                {props.renderFooter?.()}
            </DropdownContainer>
        );
    };

    return (
        <Dropdown
            renderTarget={ (renderProps) => (props.renderTarget ? props.renderTarget?.(renderProps) : renderInput(renderProps)) }
            renderBody={ (renderProps) => !props.isDisabled && !props.isReadonly && renderBody(renderProps) }
            onValueChange={ !props.isDisabled && !props.isReadonly ? handleToggle : null }
            value={ state.isOpen }
            modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
            placement={ props.placement }
            forwardedRef={ props.forwardedRef }
        />
    );
}

export const DatePicker = withMods(DatePickerComponent);
