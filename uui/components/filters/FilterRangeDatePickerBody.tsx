import React, { Fragment, useState } from 'react';
import { IDropdownBodyProps, useUuiContext, RangeDatePickerInputType, RangeDatePickerValue } from '@epam/uui-core';
import {
    FlexRow, FlexSpacer, FlexCell,
} from '../layout';
import { LinkButton } from '../buttons';
import { i18n } from '../../i18n';
import { RangeDatePickerInput } from '../datePickers/RangeDatePickerInput';
import { defaultFormat, defaultRangeValue } from '../datePickers/helpers';
import type {
    RangeDatePickerBodyValue, RangeDatePickerProps,
} from '../datePickers';
import { RangeDatePickerBody } from '../datePickers';
import { settings } from '../../settings';

export interface FilterRangeDatePickerProps extends RangeDatePickerProps, IDropdownBodyProps {}

export function FilterRangeDatePickerBody(props: FilterRangeDatePickerProps) {
    const { value: _value, format = defaultFormat } = props;
    const value = _value || defaultRangeValue; // also handles null in comparison to default value
    const context = useUuiContext();

    const onOpenChange = (newIsOpen: boolean) => {
        if (!newIsOpen) {
            props.onClose?.();
        }
        props.onOpenChange?.(newIsOpen);
    };

    const [inFocus, setInFocus] = useState<RangeDatePickerInputType>('from');

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

    const onClear = () => {
        const newValue = {
            from: props.preventEmptyFromDate ? value.from : null,
            to: props.preventEmptyToDate ? value.to : null,
        };

        onValueChange(newValue);
    };

    const shouldShowClearButton = !props.preventEmptyToDate || !props.preventEmptyFromDate;

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
                        size={ settings.filtersPanel.sizes.rangeDatePickerInput }
                        disableClear={ props.disableClear }
                        inFocus={ inFocus }
                        format={ format }
                        value={ value }
                        onValueChange={ onValueChange }
                        onFocusInput={ (event, inputType) => {
                            if (props.onFocus) {
                                props.onFocus(event, inputType);
                            }
                            setInFocus(inputType);
                        } }
                        onBlurInput={ props.onBlur }
                        preventEmptyFromDate={ props.preventEmptyFromDate }
                        preventEmptyToDate={ props.preventEmptyToDate }
                    />
                    <FlexSpacer />
                    { shouldShowClearButton && (
                        <LinkButton
                            isDisabled={ !value.from && !value.to }
                            caption={ i18n.filterToolbar.rangeDatePicker.clearCaption }
                            onClick={ onClear }
                        />
                    ) }
                </FlexRow>
            </FlexCell>
        </Fragment>
    );
}
