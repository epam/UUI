import { useState, useEffect } from 'react';
import { toCustomDateRangeFormat } from './helpers';
import {
    RangeDatePickerValue, RangeDatePickerProps, RangeDatePickerInputType, RangeDatePickerBodyValue,
} from './types';

export type UseRangeDatePickerState =
    Pick<RangeDatePickerProps, 'format' | 'onOpenChange' | 'onValueChange'> & {
        value: NonNullable<RangeDatePickerProps['value']>;
        inFocusInitial?: RangeDatePickerInputType;
    };

export const useRangeDatePickerState = (props: UseRangeDatePickerState) => {
    const {
        value, format, inFocusInitial = null,
    } = props;

    const [inputValue, setInputValue] = useState<RangeDatePickerValue>(
        toCustomDateRangeFormat(value, format),
    );
    const [inFocus, setInFocus] = useState<RangeDatePickerInputType>(inFocusInitial);

    useEffect(() => {
        setInputValue(toCustomDateRangeFormat(value, format));
    }, [format, value, setInputValue]);

    const onValueChange = (newValue: RangeDatePickerValue) => {
        const fromChanged = value?.from !== newValue?.from;
        const toChanged = value?.to !== newValue?.to;
        if (fromChanged || toChanged) {
            props.onValueChange(newValue);
        }
    };

    const onBodyValueChange = (newValue: RangeDatePickerBodyValue<RangeDatePickerValue>) => {
        setInputValue(toCustomDateRangeFormat(newValue.selectedDate, format));
        setInFocus(newValue.inFocus ?? inFocus);
        onValueChange(newValue.selectedDate);

        const toChanged = value.to !== newValue.selectedDate.to;
        const closeBody = newValue.selectedDate.from && newValue.selectedDate.to
         && inFocus === 'to'
           && toChanged;

        if (closeBody) {
            props.onOpenChange?.(false);
        }
    };

    return {
        inputValue,
        inFocus,
        setInputValue,
        setInFocus,
        onBodyValueChange,
        onValueChange,
    };
};
