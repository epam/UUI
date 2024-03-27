import { useState } from 'react';
import {
    RangeDatePickerValue, RangeDatePickerProps, RangeDatePickerInputType, RangeDatePickerBodyValue,
} from './types';

export type UseRangeDatePickerState =
    Pick<RangeDatePickerProps, 'format' | 'onOpenChange' | 'onValueChange'> & {
        value: NonNullable<RangeDatePickerProps['value']>;
        inFocusInitial?: RangeDatePickerInputType;
    };

export const useRangeDatePickerState = (props: UseRangeDatePickerState) => {
    const { value, inFocusInitial = null } = props;
    const [inFocus, setInFocus] = useState<RangeDatePickerInputType>(inFocusInitial);

    const onValueChange = (newValue: RangeDatePickerValue) => {
        const fromChanged = value?.from !== newValue?.from;
        const toChanged = value?.to !== newValue?.to;
        if (fromChanged || toChanged) {
            props.onValueChange(newValue);
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
            props.onOpenChange?.(false);
        }
    };

    return {
        inFocus,
        setInFocus,
        onBodyValueChange,
        onValueChange,
    };
};
