import { useState, useEffect } from 'react';
import { useUuiContext } from '@epam/uui-core';
import { getMonthOnOpen, toCustomDateRangeFormat } from './helpers';
import {
    RangeDatePickerValue, RangeDatePickerProps, RangeDatePickerInputType, RangeDatePickerBodyValue,
} from './types';

export type UseRangeDatePickerState =
    Pick<RangeDatePickerProps, 'format' | 'onOpenChange' | 'getValueChangeAnalyticsEvent' | 'onValueChange'> & {
        value: NonNullable<RangeDatePickerProps['value']>;
        inFocusInitial?: RangeDatePickerInputType;
    };

export const useRangeDatePickerState = (props: UseRangeDatePickerState) => {
    const {
        value, format, inFocusInitial = null,
    } = props;
    const context = useUuiContext();

    const [inputValue, setInputValue] = useState<RangeDatePickerValue>(
        toCustomDateRangeFormat(value, format),
    );
    const [inFocus, setInFocus] = useState<RangeDatePickerInputType>(inFocusInitial);
    const [month, setMonth] = useState(getMonthOnOpen(value, inFocus));
    // console.log('month', month);

    /**
     * Remove sync when text input will be uncontrolled.
     * Currently it handles value comp prop updates and any value set.
     */
    useEffect(() => {
        setInputValue(toCustomDateRangeFormat(value, format));
    }, [format, value, setInputValue]);

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
        setInputValue(toCustomDateRangeFormat(newValue.selectedDate, format));
        setInFocus(newValue.inFocus ?? inFocus);
        setMonth(newValue.month);
        onValueChange(newValue.selectedDate);

        const toChanged = value.to !== newValue.selectedDate.to;
        const closeBody = newValue.selectedDate.from && newValue.selectedDate.to
         && inFocus === 'to'
           && toChanged;

        // console.log('toChanged', toChanged, 'inFocus', inFocus);
        if (closeBody) {
            props.onOpenChange?.(false);
        }
    };

    return {
        month,
        inputValue,
        inFocus,
        setMonth,
        setInputValue,
        setInFocus,
        onValueChange,
        onBodyValueChange,
    };
};
