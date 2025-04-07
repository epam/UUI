import React, { ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';
import { offset } from '@floating-ui/react';
import {
    DropdownBodyProps, cx, useUuiContext, uuiMod, IDropdownTogglerProps,
    Overwrite, CommonDatePickerProps, ICanFocus,
    IEditable, IAnalyticableOnChange, IHasPlaceholder, IHasRawProps,
} from '@epam/uui-core';
import { DayProps, Dropdown } from '@epam/uui-components';
import { TextInput, TextInputProps } from '../inputs';
import { EditMode, IHasEditMode } from '../types';
import { DropdownContainer } from '../overlays';
import { DatePickerBody } from './DatePickerBody';
import {
    defaultFormat, isValidDate, toCustomDateFormat, toValueDateFormat,
} from './helpers';
import { settings } from '../../settings';

const defaultMode = EditMode.FORM;

type DatePickerMods = {
    /**
     * Defines component size.
     * @default '36'
     */
    size?: '24' | '30' | '36' | '42' | '48';
};

export interface DatePickerModsOverride {}

/**
 * Represents the properties of the DatePicker component
 */
export interface DatePickerProps extends
    Overwrite<DatePickerMods, DatePickerModsOverride>,
    CommonDatePickerProps,
    IHasEditMode,
    ICanFocus<HTMLInputElement>,
    IEditable<string | null>,
    IAnalyticableOnChange<string>,
    IHasPlaceholder {
    /**
     * Defines where to place calendar icon
     */
    iconPosition?: 'left' | 'right';

    /**
     * Render prop to add a custom footer inside the DatePicker dropdown body
     */
    renderFooter?(): ReactNode;

    /**
     * Overrides rendering of the single day. For example, to highlight certain days
     */
    renderDay?: (renderProps: DayProps) => ReactElement<Element>;

    /**
     * Any HTML attributes (native or 'data-') to put on date picker parts
     */
    rawProps?: {
        /**
         * Any HTML attributes (native or 'data-') to put on date picker input
         */
        input?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        /**
         * Any HTML attributes (native or 'data-') to put on date picker body
         */
        body?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    };
}

export function DatePickerComponent(props: DatePickerProps, ref: React.ForwardedRef<HTMLElement>) {
    const { format = defaultFormat, value, size = settings.datePicker.sizes.input } = props;
    const context = useUuiContext();
    const [inputValue, setInputValue] = useState(toCustomDateFormat(value, format));
    const [isBodyOpen, setBodyIsOpen] = useState(false);

    useEffect(() => {
        setInputValue(toCustomDateFormat(value, format));
    }, [value, setInputValue]);

    const onValueChange = (newValue: string | null) => {
        if (value !== newValue) {
            props.onValueChange(newValue);

            if (props.getValueChangeAnalyticsEvent) {
                const event = props.getValueChangeAnalyticsEvent(newValue, value);
                context.uuiAnalytics.sendEvent(event);
            }
        }
    };

    const onBodyValueChange = (newValue: string | null) => {
        setInputValue(toCustomDateFormat(newValue, format));
        onValueChange(newValue);
        setBodyIsOpen(false);
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        props.onBlur?.(e);

        if (isValidDate(inputValue, format, props.filter)) {
            setInputValue(toCustomDateFormat(inputValue, format));
            onValueChange(toValueDateFormat(inputValue, format));
        } else {
            setInputValue(null);
            onValueChange(null);
        }
    };

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setBodyIsOpen(true);
            e.preventDefault();
        }
    };

    const renderInput = useCallback((renderProps: IDropdownTogglerProps & { cx?: any }) => {
        const allowClear = !props.disableClear && !!inputValue;
        return (
            <TextInput
                { ...renderProps }
                isDropdown={ false }
                cx={ cx(props.inputCx, isBodyOpen && uuiMod.focus) }
                icon={ props.mode !== EditMode.CELL ? settings.datePicker.icons.input.calendarIcon : undefined }
                iconPosition={ props.iconPosition || 'left' }
                placeholder={ props.placeholder ? props.placeholder : format }
                size={ size as TextInputProps['size'] }
                value={ inputValue || undefined }
                onValueChange={ (v) => {
                    setInputValue(v || '');
                } }
                onCancel={ allowClear ? () => {
                    if (!props.disableClear && !!inputValue) {
                        onValueChange(null);
                    }
                } : undefined }
                isInvalid={ props.isInvalid }
                isDisabled={ props.isDisabled }
                isReadonly={ props.isReadonly }
                tabIndex={ props.isReadonly || props.isDisabled ? -1 : 0 }
                onFocus={ (e) => {
                    props.onFocus?.(e);
                } }
                onKeyDown={ onInputKeyDown }
                onBlur={ onBlur }
                mode={ props.mode || defaultMode }
                rawProps={ props.rawProps?.input }
                id={ props.id }
            />
        );
    }, [inputValue, isBodyOpen, props, format, size]);

    const renderBody = useCallback((renderProps: DropdownBodyProps) => {
        return (
            <DropdownContainer { ...renderProps }>
                <DatePickerBody
                    value={ value }
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
    }, [value, onBodyValueChange, props]);

    return (
        <Dropdown
            value={ isBodyOpen }
            middleware={ [offset(6)] }
            placement={ props.placement }
            ref={ ref }
            onValueChange={ (v) => {
                setBodyIsOpen(v);
            } }
            renderTarget={ (renderProps) => {
                return props.renderTarget?.(renderProps) || renderInput(renderProps);
            } }
            renderBody={ renderBody }
        />
    );
}

export const DatePicker = React.forwardRef(DatePickerComponent) as
    (props: DatePickerProps & { ref?: React.ForwardedRef<HTMLElement> }) => ReturnType<typeof DatePickerComponent>;
