import React, { useState } from 'react';
import cx from 'classnames';
import {
    DropdownBodyProps, isFocusReceiverInsideFocusLock, useUuiContext,
} from '@epam/uui-core';
import { Dropdown } from '@epam/uui-components';
import { DropdownContainer } from '../overlays';
import { FlexRow } from '../layout';
import { RangeDatePickerBody } from './RangeDatePickerBody';
import css from './RangeDatePicker.module.scss';
import {
    RangeDatePickerBodyValue, RangeDatePickerInputType, RangeDatePickerProps, RangeDatePickerValue,
} from './types';
import { defaultFormat, defaultRangeValue } from './helpers';
import { RangeDatePickerInput } from './RangeDatePickerInput';

const modifiers = [{
    name: 'offset',
    options: { offset: [0, 6] },
}];

function RangeDatePickerComponent(props: RangeDatePickerProps, ref: React.ForwardedRef<HTMLElement>): JSX.Element {
    const { value: _value, format = defaultFormat } = props;
    const value = _value || defaultRangeValue; // also handles null in comparison to default value

    const context = useUuiContext();
    const [isOpen, setIsOpen] = useState(false);
    const [inFocus, setInFocus] = useState<RangeDatePickerInputType>(null);

    const onValueChange = (newValue: RangeDatePickerValue) => {
        const fromChanged = value?.from !== newValue?.from;
        const toChanged = value?.to !== newValue?.to;
        if (fromChanged || toChanged) {
            props.onValueChange(newValue);
            if (props.getValueChangeAnalyticsEvent) {
                const event = props.getValueChangeAnalyticsEvent(newValue, value);
                context.uuiAnalytics.sendEvent(event);
            }
        }
    };

    const onOpenChange = (newIsOpen: boolean, focus?: RangeDatePickerInputType) => {
        setInFocus(newIsOpen && focus ? focus : null);
        setIsOpen(newIsOpen);
        props.onOpenChange?.(newIsOpen);
    };

    const onBodyValueChange = (newValue: RangeDatePickerBodyValue<RangeDatePickerValue>) => {
        setInFocus(newValue.inFocus ?? inFocus);
        onValueChange(newValue.selectedDate);

        const toChanged = value.to !== newValue.selectedDate.to;
        const closeBody = newValue.selectedDate.from && newValue.selectedDate.to
         && inFocus === 'to'
           && toChanged;

        if (closeBody) {
            onOpenChange(false);
        }
    };

    // mainly for closing body on tab
    const onInputWrapperBlur: React.FocusEventHandler<HTMLDivElement> = (event) => {
        if (isFocusReceiverInsideFocusLock(event)) {
            return;
        }
        onOpenChange(false);
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
                            selectedDate: _value,
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
                    <RangeDatePickerInput
                        ref={ renderProps.ref }
                        cx={ props.inputCx }
                        onClick={ renderProps.onClick }
                        isDisabled={ props.isDisabled }
                        isInvalid={ props.isInvalid }
                        isReadonly={ props.isReadonly }
                        size={ props.size }
                        getPlaceholder={ props.getPlaceholder }
                        disableClear={ props.disableClear }
                        rawProps={ props.rawProps }
                        inFocus={ inFocus }
                        value={ value }
                        format={ format }
                        onValueChange={ onValueChange }
                        onBlur={ onInputWrapperBlur }
                        onFocusInput={ (e, i) => {
                            props.onFocus?.(e, i);
                            onOpenChange(true, i);
                        } }
                        onBlurInput={ props.onBlur }
                    />
                );
            } }
            renderBody={ (renderProps) => renderBody(renderProps) }
            onValueChange={ (v) => onOpenChange(v) }
            value={ isOpen }
            modifiers={ modifiers }
            placement={ props.placement }
            forwardedRef={ ref }
        />
    );
}

export const RangeDatePicker = React.forwardRef(RangeDatePickerComponent);
