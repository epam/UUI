import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useReducer } from 'react';
import { DatePickerState, PickerBodyValue, supportedDateFormats, valueFormat } from '@epam/uui-components';
import { useUuiContext } from '@epam/uui-core';
import { DatePickerProps } from './types';

type DatePickerStateReducer = (prev: DatePickerState, newState: Partial<DatePickerState>) => DatePickerState;

export const getNewMonth = (value: string | Dayjs) => {
    return dayjs(value, valueFormat).isValid() ? dayjs(value, valueFormat) : dayjs().startOf('day');
};

export const isValidDate = (input: string, format: string, filter?:(day: dayjs.Dayjs) => boolean): boolean | undefined => {
    if (!input) {
        return false;
    }

    const parsedDate = dayjs(input, supportedDateFormats(format), true);
    return parsedDate.isValid() ?? filter?.(parsedDate) ?? true;
};

export const useDatePickerState = (props: DatePickerProps) => {
    const { value } = props;
    const context = useUuiContext();

    const [state, setState] = useReducer<DatePickerStateReducer>((prev, newState) => {
        return {
            isOpen: newState.isOpen ?? prev.isOpen,
            view: newState.view ?? prev.view,
            month: newState.month ?? prev.month,
        };
    }, {
        isOpen: false,
        view: 'DAY_SELECTION',
        month: getNewMonth(value),
    });

    useEffect(() => {
        setState({ month: getNewMonth(value) });
    }, [value]);

    const handleValueChange = (newValue: string | null) => {
        props.onValueChange(newValue);

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(newValue, value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    const handleBodyChange = (newValue: Partial<PickerBodyValue<string>>) => {
        if (newValue.selectedDate && value !== newValue.selectedDate) {
            handleValueChange(newValue.selectedDate);
        }

        setState({
            month: getNewMonth(newValue.month),
            view: newValue.view,
        });
    };

    return {
        ...state,
        setState,
        handleBodyChange,
        handleValueChange,
    };
};
