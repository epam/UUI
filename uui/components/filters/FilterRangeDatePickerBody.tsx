import React, { Fragment } from 'react';
import { IDropdownBodyProps, useUuiContext } from '@epam/uui-core';
import {
    FlexRow, FlexSpacer, FlexCell,
} from '../layout';
import { LinkButton } from '../buttons';
import { i18n } from '../../i18n';
import { RangeDatePickerInput } from '../datePickers/RangeDatePickerInput';
import { defaultFormat, defaultRangeValue } from '../datePickers/helpers';
import { RangeDatePickerProps } from '../datePickers/types';
import { RangeDatePickerBody } from '../datePickers';
import { useRangeDatePickerState } from '../datePickers/useRangeDatePickerState';

export interface FilterRangeDatePickerProps extends RangeDatePickerProps, IDropdownBodyProps {}

export function FilterRangeDatePickerBody(props: FilterRangeDatePickerProps) {
    const { value: _value, format = defaultFormat } = props;
    const value = _value || defaultRangeValue; // also handles null in comparison to default value
    const context = useUuiContext();

    const {
        inputValue,
        inFocus,
        setInputValue,
        setInFocus,
        onValueChange,
        onBodyValueChange,
    } = useRangeDatePickerState({
        value,
        format,
        inFocusInitial: 'from',
        onValueChange: (newValue) => {
            props.onValueChange(newValue);
            if (props.getValueChangeAnalyticsEvent) {
                const event = props.getValueChangeAnalyticsEvent(newValue, value);
                context.uuiAnalytics.sendEvent(event);
            }
        },
        onOpenChange: (newIsOpen: boolean) => {
            if (!newIsOpen) {
                props.onClose?.();
            }
            props.onOpenChange?.(newIsOpen);
        },
    });

    return (
        <Fragment>
            <FlexRow borderBottom={ true }>
                <RangeDatePickerBody
                    value={ {
                        selectedDate: value,
                        inFocus,
                    } }
                    onValueChange={ onBodyValueChange }
                    filter={ props.filter }
                    presets={ props.presets }
                />
            </FlexRow>
            <FlexCell alignSelf="stretch">
                <FlexRow
                    padding="24"
                    vPadding="12"
                >
                    <RangeDatePickerInput
                        size="30"
                        disableClear={ props.disableClear }
                        inFocus={ inFocus }
                        format={ format }
                        value={ inputValue }
                        onValueChange={ setInputValue }
                        onInputFocus={ (event, inputType) => {
                            if (props.onFocus) {
                                props.onFocus(event, inputType);
                            }
                            setInFocus(inputType);
                        } }
                        onInputBlur={ (event, inputType, v) => {
                            if (props.onBlur) {
                                props.onBlur(event, inputType);
                            }
                            setInputValue(v.inputValue);
                            onValueChange(v.selectedDate);
                        } }
                        onClear={ onValueChange }
                    />
                    <FlexSpacer />
                    <LinkButton
                        isDisabled={ !inputValue.from && !inputValue.to }
                        caption={ i18n.pickerModal.clearAllButton }
                        onClick={ () => onValueChange(defaultRangeValue) }
                    />
                </FlexRow>
            </FlexCell>
        </Fragment>
    );
}
