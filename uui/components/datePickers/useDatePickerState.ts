import dayjs, { Dayjs } from 'dayjs';
import { useReducer, useEffect } from 'react';
import { DatePickerState, PickerBodyValue, valueFormat } from '@epam/uui-components';
import { IHasEditMode, SizeMod } from '../types';
import { DatePickerCoreProps, useUuiContext } from '@epam/uui-core';

/** Represents the properties of the DatePicker component. */
export interface DatePickerProps extends DatePickerCoreProps, SizeMod, IHasEditMode {
    /**
    * HTML ID attribute for the toggler input
    */
    id?: string;
}

type DatePickerStateReducer = (prev: DatePickerState, newState: Partial<DatePickerState>) => DatePickerState;

const getNewMonth = (value: string | Dayjs) => {
    return dayjs(value, valueFormat).isValid() ? dayjs(value, valueFormat) : dayjs().startOf('day');
};

export const useDatePickerState = (props: DatePickerProps) => {
    const { value } = props;
    const context = useUuiContext();

    const [state, setState] = useReducer<DatePickerStateReducer>((prev, newState) => {
        return { ...prev, ...newState };
    }, {
        isOpen: false,
        view: 'DAY_SELECTION',
        month: getNewMonth(value),
    });

    useEffect(() => {
        setState({ month: getNewMonth(value) });
    }, [value, setState]);

    const onValueChange = (newValue: Partial<PickerBodyValue<string>>) => {
        if (newValue.selectedDate) {
            props.onValueChange(newValue.selectedDate || value);
            if (props.getValueChangeAnalyticsEvent) {
                const event = props.getValueChangeAnalyticsEvent(newValue.selectedDate, value);
                context.uuiAnalytics.sendEvent(event);
            }
        }

        if (newValue.month) {
            setState({ month: getNewMonth(newValue.month) });
        }
        if (newValue.view) {
            setState({ view: newValue.view });
        }
    };

    const handleValueChange = (newValue: string | null) => {
        props.onValueChange(newValue);
        setState({ month: getNewMonth(value) });

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(newValue, value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    const handleCancel = () => {
        handleValueChange(null);
    };

    const handleToggle = (open: boolean) => {
        if (open) {
            setState({
                isOpen: open,
                view: 'DAY_SELECTION',
                month: value ? dayjs(value) : dayjs(),
            });
        } else {
            setState({ isOpen: open });
            props.onBlur?.();
        }
    };

    return {
        ...state,
        onValueChange,
        handleCancel,
        handleToggle,
        handleValueChange,
    };
};
