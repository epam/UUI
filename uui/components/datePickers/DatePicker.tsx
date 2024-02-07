import React, { useCallback, useEffect, useState } from 'react';
import { DatePickerState, Dropdown, PickerBodyValue, defaultFormat, supportedDateFormats, toCustomDateFormat, toValueDateFormat, valueFormat } from '@epam/uui-components';
import { DatePickerCoreProps, DropdownBodyProps, IDropdownToggler, cx, devLogger, isFocusReceiverInsideFocusLock, useUuiContext, uuiMod, withMods } from '@epam/uui-core';
import { TextInput } from '../inputs';
import { EditMode, IHasEditMode, SizeMod } from '../types';
import { systemIcons } from '../../icons/icons';
import { DropdownContainer } from '../overlays';
import { DatePickerBody } from './DatePickerBody';
import dayjs from 'dayjs';

const defaultMode = EditMode.FORM;

/** Represents the properties of the DatePicker component. */
export interface DatePickerProps extends DatePickerCoreProps, SizeMod, IHasEditMode {
    /**
    * HTML ID attribute for the toggler input
    */
    id?: string;
}

export function DatePickerComponent(props: DatePickerProps) {
    const { format = defaultFormat, value } = props;
    const inputValue = toCustomDateFormat(value, format || defaultFormat) || value;
    const context = useUuiContext();

    const [{ isOpen, view, month }, setState] = useState<DatePickerState>({
        isOpen: false,
        view: 'DAY_SELECTION',
        month: dayjs(value, valueFormat).isValid() ? dayjs(value, valueFormat) : dayjs().startOf('day'),
    });

    const updateState = useCallback((newState: Partial<DatePickerState>) => {
        setState((prev) => ({ ...prev, ...newState }));
    }, [setState]);

    useEffect(() => {
        updateState({
            month: dayjs(value, valueFormat).isValid() ? dayjs(value, valueFormat) : dayjs().startOf('day'),
        });
    }, [value]);

    const onValueChange = (newValue: Partial<PickerBodyValue<string>>) => {
        let newState: Partial<PickerBodyValue<string>> = {};

        if (newValue.selectedDate) {
            props.onValueChange(newValue.selectedDate || value);
            if (props.getValueChangeAnalyticsEvent) {
                const event = props.getValueChangeAnalyticsEvent(newValue.selectedDate, value);
                context.uuiAnalytics.sendEvent(event);
            }
        }

        if (newValue.month) {
            newState = {
                ...newState,
                month: dayjs(newValue.month, valueFormat).isValid()
                    ? dayjs(newValue.month, valueFormat)
                    : dayjs().startOf('day'),
            };
        }
        if (newValue.view) {
            newState = { ...newState, view: newValue.view };
        }
        updateState(newState);
    };

    const handleValueChange = (newValue: string | null) => {
        props.onValueChange(newValue);
        updateState({
            month: dayjs(newValue, valueFormat).isValid() ? dayjs(newValue, valueFormat) : dayjs().startOf('day'),
        });

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(newValue, value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    const handleInputChange = (input: string) => {
        const resultValue = toValueDateFormat(input, format);
        if (getIsValidDate(input)) {
            handleValueChange(resultValue);
        } else {
            handleValueChange(input);
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        handleToggle(true);
        props.onFocus?.(e);
    };

    const getIsValidDate = (input: string) => {
        if (!input) {
            return false;
        }

        const parsedDate = dayjs(input, supportedDateFormats(format), true);
        const isValidDate = parsedDate.isValid();
        if (!isValidDate) {
            return false;
        }

        return props.filter ? props.filter(parsedDate) : true;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isFocusReceiverInsideFocusLock(e)) return;
        handleToggle(false);
        if (!getIsValidDate(inputValue)) {
            handleValueChange(null);
        }
    };

    const handleCancel = () => {
        handleValueChange(null);
    };

    const handleToggle = (open: boolean) => {
        if (open) {
            updateState({
                isOpen: open,
                view: 'DAY_SELECTION',
                month: value ? dayjs(value) : dayjs(),
            });
        } else {
            updateState({ isOpen: open });
            props.onBlur?.();
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
                onValueChange={ handleInputChange }
                onCancel={ props.disableClear || !inputValue ? undefined : handleCancel }
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
        return (
            <DropdownContainer { ...renderProps } focusLock={ false }>
                <DatePickerBody
                    value={ {
                        selectedDate: value,
                        month,
                        view,
                    } }
                    onValueChange={ onValueChange }
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
            onValueChange={ !props.isDisabled && !props.isReadonly ? handleToggle : null }
            value={ isOpen }
            modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
            placement={ props.placement }
            forwardedRef={ props.forwardedRef }
        />
    );
}

export const DatePicker = withMods(DatePickerComponent);
