import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from 'react';
import { IControlled, useUuiContext } from '@epam/uui-core';
import { toCustomDateRangeFormat, valueFormat } from './helpers';
import {
    RangeDatePickerValue, RangeDatePickerProps, ViewType, RangeDatePickerInputType, RangeDatePickerBodyValue,
} from './types';

export type UseRangeDatePickerState =
    IControlled<RangeDatePickerValue> &
    Pick<RangeDatePickerProps, 'format' | 'onOpenChange' | 'getValueChangeAnalyticsEvent'> & {
        inFocusInitial: RangeDatePickerInputType;
    };

export const useRangeDatePickerState = (props: UseRangeDatePickerState) => {
    const {
        value, format, inFocusInitial = null,
    } = props;
    const context = useUuiContext();

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
        inFocus: inFocusInitial,
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

    const onBodyValueChange = (newValue: RangeDatePickerBodyValue<RangeDatePickerValue>) => {
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
            props.onOpenChange?.(false);
        }
    };

    return {
        ...bodyState,
        inputValue,
        setInputValue,
        setBodyState,
        onValueChange,
        onBodyValueChange,
    };
};
