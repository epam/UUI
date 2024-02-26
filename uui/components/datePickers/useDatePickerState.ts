import dayjs, { Dayjs } from 'dayjs';
import { useReducer, useEffect } from 'react';
import { DatePickerState, PickerBodyValue, defaultFormat, supportedDateFormats, valueFormat } from '@epam/uui-components';
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

export const isValidDate = (input: string, format: string, filter?:(day: dayjs.Dayjs) => boolean): boolean | undefined => {
    if (!input) {
        return false;
    }

    const parsedDate = dayjs(input, supportedDateFormats(format), true);
    return parsedDate.isValid() ?? filter?.(parsedDate) ?? true;
};

export const useDatePickerState = (props: DatePickerProps) => {
    const { format = defaultFormat, value } = props;
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
        if (isValidDate(value, format, props.filter)) {
            setState({ month: getNewMonth(value) });
        }
    }, [value, setState]);

    const handleValueChange = (newValue: string | null) => {
        props.onValueChange(newValue);

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(newValue, value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    const handleBodyChange = (newValue: Partial<PickerBodyValue<string>>) => {
        if (newValue.selectedDate) {
            handleValueChange(newValue.selectedDate);
        }

        setState({
            month: getNewMonth(newValue.month),
            view: newValue.view,
        });
    };

    const toggleIsOpen = (open: boolean) => {
        if (open) {
            setState({
                isOpen: open,
                view: 'DAY_SELECTION',
            });
        } else {
            setState({ isOpen: open });
            props.onBlur?.();
        }
    };

    return {
        ...state,
        handleBodyChange,
        handleValueChange,
        toggleIsOpen,
    };
};
