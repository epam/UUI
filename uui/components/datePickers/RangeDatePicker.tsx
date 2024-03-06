import React, { useState } from 'react';
import cx from 'classnames';
import {
    uuiMod, DropdownBodyProps, withMods, isFocusReceiverInsideFocusLock,
} from '@epam/uui-core';
import { Dropdown } from '@epam/uui-components';
import { DropdownContainer } from '../overlays';
import { FlexRow } from '../layout';
import { RangeDatePickerBody } from './RangeDatePickerBody';
import css from './RangeDatePicker.module.scss';
import { RangeDatePickerInputType, RangeDatePickerProps } from './types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import {
    defaultFormat, defaultRangeValue, getMonthOnOpening,
} from './helpers';
import { RangeDatePickerInput } from './RangeDatePickerInput';
import { useRangeDatePickerState } from './useRangeDatePickerState';

dayjs.extend(customParseFormat);

const modifiers = [{
    name: 'offset',
    options: { offset: [0, 6] },
}];

function RangeDatePickerComponent(props: RangeDatePickerProps): JSX.Element {
    const { value: _value, format = defaultFormat } = props;
    const value = _value || defaultRangeValue;

    const [isOpen, setIsOpen] = useState(false);

    const {
        inputValue,
        month,
        view,
        inFocus,
        setInputValue,
        setBodyState,
        onValueChange,
        onBodyValueChange,
    } = useRangeDatePickerState({
        value,
        format,
        getValueChangeAnalyticsEvent: props.getValueChangeAnalyticsEvent,
        onValueChange: props.onValueChange,
        onOpenChange: (newIsOpen: boolean) => {
            toggleIsOpen(newIsOpen);
            props.onOpenChange?.(newIsOpen);
        },
    });

    const toggleIsOpen = (newIsOpen: boolean, focus?: RangeDatePickerInputType) => {
        setBodyState({
            view: 'DAY_SELECTION',
            month: getMonthOnOpening(focus, value),
            inFocus: newIsOpen ? focus : null,
        });
        setIsOpen(newIsOpen);
        props.onOpenChange?.(newIsOpen);
    };

    // mainly for closing body on tab
    const onInputWrapperBlur: React.FocusEventHandler<HTMLDivElement> = (event) => {
        if (isFocusReceiverInsideFocusLock(event)) {
            return;
        }
        toggleIsOpen(false);
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
                            month,
                            view,
                            inFocus,
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
                    <div
                        ref={ renderProps.ref }
                        className={ cx(
                            props.inputCx,
                            css.dateInputGroup,
                            props.isDisabled && uuiMod.disabled,
                            props.isReadonly && uuiMod.readonly,
                            props.isInvalid && uuiMod.invalid,
                            inFocus && uuiMod.focus,
                        ) }
                        onClick={ (event) => {
                            if (!props.isDisabled) {
                                renderProps.onClick(event);
                            }
                        } }
                        onBlur={ onInputWrapperBlur }
                    >
                        <RangeDatePickerInput
                            isDisabled={ props.isDisabled }
                            isInvalid={ props.isInvalid }
                            isReadonly={ props.isReadonly }
                            size={ props.size }
                            getPlaceholder={ props.getPlaceholder }
                            disableClear={ props.disableClear }
                            rawProps={ props.rawProps }
                            inFocus={ inFocus }
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
                    </div>
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
