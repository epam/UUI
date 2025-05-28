import React, { Fragment, useState } from 'react';
import { IDropdownBodyProps, useUuiContext, RangeDatePickerInputType, RangeDatePickerValue, RangeDatePickerFilterConfig } from '@epam/uui-core';
import { FlexRow } from '../layout';
import { defaultFormat, defaultRangeValue } from '../datePickers/helpers';
import type {
    RangeDatePickerBodyValue, RangeDatePickerProps,
} from '../datePickers';
import { RangeDatePickerBody } from '../datePickers';
import { FilterRangeDatePickerBodyFooter } from './FilterRangeDatePickerBodyFooter';

export interface FilterRangeDatePickerProps extends
    Omit<RangeDatePickerProps, 'renderFooter'>, IDropdownBodyProps, Pick<RangeDatePickerFilterConfig<any>, 'renderFooter'> {}

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

    function renderFooter() {
        const footerProps = {
            value,
            onValueChange,
            format: format,
            disableClear: props.disableClear,
            preventEmptyFromDate: props.preventEmptyFromDate,
            preventEmptyToDate: props.preventEmptyToDate,
            onFocus: props.onFocus,
            onBlur: props.onBlur,
            inFocus,
            setInFocus,
            onClear,
        };

        return props.renderFooter ? props.renderFooter(footerProps) : <FilterRangeDatePickerBodyFooter { ...footerProps } />;
    }

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
            { renderFooter() }
        </Fragment>
    );
}
