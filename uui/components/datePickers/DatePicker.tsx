import React, { useEffect, useState } from 'react';
import {
    Dropdown, PickerBodyValue, ViewType, defaultFormat, supportedDateFormats, toCustomDateFormat, toValueDateFormat,
} from '@epam/uui-components';
import {
    DropdownBodyProps, IDropdownToggler, cx, devLogger, isFocusReceiverInsideFocusLock, useUuiContext, uuiMod, withMods,
} from '@epam/uui-core';
import { TextInput } from '../inputs';
import { EditMode } from '../types';
import { systemIcons } from '../../icons/icons';
import { DropdownContainer } from '../overlays';
import { DatePickerBody } from './DatePickerBody';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { DatePickerProps } from './types';
import { getNewMonth } from './helpers';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const defaultMode = EditMode.FORM;
const modifiers = [{
    name: 'offset',
    options: { offset: [0, 6] },
}];

export const isValidDate = (input: string, format: string, filter?:(day: dayjs.Dayjs) => boolean): boolean | undefined => {
    if (!input) {
        return false;
    }

    const parsedDate = dayjs(input, supportedDateFormats(format), true);
    return parsedDate.isValid() ?? filter?.(parsedDate) ?? true;
};

export interface DatePickerState {
    isOpen: boolean;
    month: Dayjs;
    view: ViewType;
}

export function DatePickerComponent(props: DatePickerProps) {
    const { format = defaultFormat, value } = props;
    const context = useUuiContext();
    const [inputValue, setInputValue] = useState(toCustomDateFormat(value, format));

    const [{
        isOpen,
        view,
        month,
    }, setState] = useState<DatePickerState>({
        isOpen: false,
        view: 'DAY_SELECTION',
        month: getNewMonth(value),
    });

    useEffect(() => {
        setInputValue(toCustomDateFormat(value, format));
        setState((prev) => ({
            ...prev,
            month: getNewMonth(value),
        }));
    }, [value]);

    const onInputChange = (input: string) => {
        const resultValue = toValueDateFormat(input, format);
        if (isValidDate(input, format, props.filter)) {
            handleValueChange(resultValue);
            setInputValue(input);
        } else {
            setInputValue(input);
        }
    };

    const toggleIsOpen = (open: boolean) => {
        if (open) {
            setState({
                isOpen: open,
                view: 'DAY_SELECTION',
                month: getNewMonth(value),
            });
        } else {
            setState((prev) =>({
                ...prev,
                isOpen: open,
            }));
            props.onBlur?.();
        }
    };

    const handleValueChange = (newValue: string | null) => {
        props.onValueChange(newValue);

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(newValue, value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    const onBodyValueChange = (newValue: PickerBodyValue<string>) => {
        if (newValue.selectedDate && value !== newValue.selectedDate) {
            handleValueChange(newValue.selectedDate);
            toggleIsOpen(false);
        }

        setState((prev) => ({
            ...prev,
            month: getNewMonth(newValue.month),
            view: newValue.view,
        }));
        setInputValue(toCustomDateFormat(newValue.selectedDate, format));
    };

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        toggleIsOpen(true);
        props.onFocus?.(e);
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isFocusReceiverInsideFocusLock(e)) return;
        toggleIsOpen(false);

        if (isValidDate(inputValue, format, props.filter)) {
            setInputValue(toCustomDateFormat(inputValue, format));
        } else if (inputValue !== '' && inputValue !== null) {
            handleValueChange(null);
            setInputValue(null);
        }
    };

    const onCancel = () => {
        handleValueChange(null);
        setInputValue(null);
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
                icon={ props.mode !== EditMode.CELL && systemIcons.calendar }
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
                        selectedDate: value,
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
