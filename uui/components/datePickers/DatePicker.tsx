import React, { useEffect, useState } from 'react';
import { Dropdown } from '@epam/uui-components';
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
import {
    DatePickerProps, DatePickerBodyValue, ViewType,
} from './types';
import {
    defaultFormat, getNewMonth, supportedDateFormats, toCustomDateFormat, toValueDateFormat,
} from './helpers';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const defaultMode = EditMode.FORM;
const modifiers = [{
    name: 'offset',
    options: { offset: [0, 6] },
}];

const isValidDate = (input: string, format: string, filter?:(day: dayjs.Dayjs) => boolean): boolean | undefined => {
    const parsedDate = dayjs(input, supportedDateFormats(format), true);
    return parsedDate.isValid() ?? filter?.(parsedDate);
};

interface DatePickerState {
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

    const onValueChange = (newValue: string | null) => {
        if (value !== newValue) {
            props.onValueChange(newValue);
            toggleIsOpen(false);

            if (props.getValueChangeAnalyticsEvent) {
                const event = props.getValueChangeAnalyticsEvent(newValue, value);
                context.uuiAnalytics.sendEvent(event);
            }
        }
    };

    const onBodyValueChange = (newValue: DatePickerBodyValue<string>) => {
        setState((prev) => ({
            ...prev,
            month: getNewMonth(newValue.month),
            view: newValue.view,
            open: false,
        }));

        setInputValue(toCustomDateFormat(newValue.selectedDate, format));
        onValueChange(newValue.selectedDate);
    };

    const toggleIsOpen = (open: boolean) => {
        setState({
            isOpen: open,
            view: 'DAY_SELECTION',
            month: getNewMonth(value),
        });
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isFocusReceiverInsideFocusLock(e)) return;

        if (isValidDate(inputValue, format, props.filter)) {
            setInputValue(toCustomDateFormat(inputValue, format));
            onValueChange(toValueDateFormat(inputValue, format));
        } else {
            onValueChange(null);
            setInputValue(null);
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
                onValueChange={ setInputValue }
                onCancel={ () => {
                    if (!props.disableClear && !!value) {
                        onValueChange(null);
                        setInputValue(null);
                    }
                } }
                isInvalid={ props.isInvalid }
                isDisabled={ props.isDisabled }
                isReadonly={ props.isReadonly }
                tabIndex={ props.isReadonly || props.isDisabled ? -1 : 0 }
                onFocus={ (e) => {
                    toggleIsOpen(true);
                    props.onFocus?.(e);
                } }
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
            value={ isOpen }
            modifiers={ modifiers }
            placement={ props.placement }
            forwardedRef={ props.forwardedRef }
            onValueChange={ (v) => {
                toggleIsOpen(v);
            } }
            renderTarget={ (renderProps) => {
                return props.renderTarget?.(renderProps) || renderInput(renderProps);
            } }
            renderBody={ (renderProps) => {
                return renderBody(renderProps);
            } }
        />
    );
}

export const DatePicker = withMods(DatePickerComponent);
