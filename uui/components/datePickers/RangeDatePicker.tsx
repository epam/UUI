import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import {
    uuiMod, DropdownBodyProps, withMods, useUuiContext, RangeDatePickerInputType, RangeDatePickerValue,
} from '@epam/uui-core';
import {
    Dropdown, RangePickerBodyValue, ViewType, defaultFormat, toCustomDateRangeFormat, valueFormat,
} from '@epam/uui-components';
import { DropdownContainer } from '../overlays';
import { FlexRow } from '../layout';
import { RangeDatePickerBody } from './RangeDatePickerBody';
import css from './RangeDatePicker.module.scss';
import { RangeDatePickerProps } from './types';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { defaultRangeValue, getMonthOnOpening } from './helpers';
import { RangeDatePickerInput } from './RangeDatePickerInput';

dayjs.extend(customParseFormat);

const modifiers = [{
    name: 'offset',
    options: { offset: [0, 6] },
}];

function RangeDatePickerComponent(props: RangeDatePickerProps): JSX.Element {
    const { value: _value, format = defaultFormat } = props;
    const value = _value || defaultRangeValue;
    const context = useUuiContext();

    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState<RangeDatePickerValue>(
        toCustomDateRangeFormat(value, format),
    );

    useEffect(() => {
        setInputValue(toCustomDateRangeFormat(value, format));
    }, [format, value, setInputValue]);

    const [bodyState, setBodyState] = useState<{
        view: ViewType;
        month: Dayjs;
        inFocus: RangeDatePickerInputType
    }>({
        view: 'DAY_SELECTION',
        month: dayjs(value.from, valueFormat).isValid() ? dayjs(value.from, valueFormat) : dayjs().startOf('day'),
        inFocus: null,
    });

    const onValueChange = (newValue: RangeDatePickerValue) => {
        const fromChanged = value.from !== newValue.from;
        const toChanged = value.to !== newValue.to;
        if (fromChanged || toChanged) {
            props.onValueChange(newValue);

            if (props.getValueChangeAnalyticsEvent) {
                const event = props.getValueChangeAnalyticsEvent(newValue, value);
                context.uuiAnalytics.sendEvent(event);
            }
        }
    };

    const onBodyValueChange = (newValue: RangePickerBodyValue<RangeDatePickerValue>) => {
        setInputValue(toCustomDateRangeFormat(newValue.selectedDate, format));
        setBodyState((prev) => ({
            view: newValue.view ?? prev.view,
            month: newValue.month ?? prev.month,
            inFocus: newValue.inFocus ?? prev.inFocus,
        }));
        onValueChange(newValue.selectedDate);

        const toChanged = value.to !== newValue.selectedDate.to;
        const closeBody = newValue.selectedDate.from
         && newValue.selectedDate.to
          && bodyState.inFocus === 'to'
           && toChanged;
        if (closeBody) {
            toggleIsOpen(false);
        }
    };

    const toggleIsOpen = (newIsOpen: boolean, focus?: RangeDatePickerInputType) => {
        if (!props.isReadonly && !props.isDisabled) {
            setBodyState({
                view: 'DAY_SELECTION',
                month: getMonthOnOpening(focus, value),
                inFocus: newIsOpen ? focus : null,
            });
            setIsOpen(newIsOpen);
            props.onOpenChange?.(newIsOpen);
        }
    };

    const renderBody = (renderProps: DropdownBodyProps): JSX.Element => {
        return (
            <DropdownContainer
                { ...renderProps }
                cx={ cx(css.dropdownContainer) }
                focusLock={ false }
            >
                <FlexRow>
                    <RangeDatePickerBody
                        cx={ cx(props.bodyCx) }
                        value={ {
                            selectedDate: value,
                            month: bodyState.month,
                            view: bodyState.view,
                            inFocus: bodyState.inFocus,
                        } }
                        onValueChange={ onBodyValueChange }
                        filter={ props.filter }
                        presets={ props.presets }
                        renderDay={ props.renderDay }
                        renderFooter={ () => {
                            return props.renderFooter?.(value);
                        } }
                        isHoliday={ props.isHoliday }
                        rawProps={ props.rawProps?.body }
                    />
                </FlexRow>
            </DropdownContainer>
        );
    };

    return (
        <Dropdown
            renderTarget={ (renderProps) => {
                return props.renderTarget?.(renderProps) || (
                    <RangeDatePickerInput
                        ref={ renderProps.ref }
                        cx={ [
                            props.inputCx,
                            css.dateInputGroup,
                            props.isDisabled && uuiMod.disabled,
                            props.isReadonly && uuiMod.readonly,
                            props.isInvalid && uuiMod.invalid,
                            bodyState.inFocus && uuiMod.focus,
                        ] }
                        isDisabled={ props.isDisabled }
                        isInvalid={ props.isInvalid }
                        isReadonly={ props.isReadonly }
                        size={ props.size }
                        getPlaceholder={ props.getPlaceholder }
                        disableClear={ props.disableClear }
                        rawProps={ props.rawProps }
                        inFocus={ bodyState.inFocus }
                        onClick={ (event) => {
                            if (!props.isDisabled) {
                                renderProps.onClick(event);
                            }
                        } }
                        value={ inputValue }
                        format={ format }
                        onValueChange={ setInputValue }
                        onFocus={ (event, inputType) => {
                            if (props.onFocus) {
                                props.onFocus(event, inputType);
                            }
                            toggleIsOpen(true, inputType);
                        } }
                        onBlur={ (event, inputType, v) => {
                            if (props.onBlur) {
                                props.onBlur(event, inputType);
                            }

                            setInputValue(v.inputValue);
                            onValueChange(v.selectedDate);
                        } }
                        onClear={ onValueChange }
                    />
                );
            } }
            renderBody={ (renderProps) => renderBody(renderProps) }
            onValueChange={ toggleIsOpen }
            value={ isOpen }
            modifiers={ modifiers }
            placement={ props.placement }
            forwardedRef={ props.forwardedRef }
        />
    );
}

export const RangeDatePicker = withMods(RangeDatePickerComponent);
