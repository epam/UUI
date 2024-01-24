import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from 'react';
import { defaultFormat, toCustomDateFormat, valueFormat, PickerBodyValue, ViewType } from '@epam/uui-components';
import { DatePickerCoreProps, useUuiContext } from '@epam/uui-core';
import { SizeMod, IHasEditMode } from '../types';

const getStateFromValue = (value: string | null, format: string) => {
    if (!value) {
        return {
            inputValue: '',
            selectedDate: value,
            displayedDate: dayjs().startOf('day'),
        };
    }

    const inputFormat = format || defaultFormat;
    const inputValue = toCustomDateFormat(value, inputFormat);

    return {
        inputValue,
        selectedDate: value,
        displayedDate: dayjs(value, valueFormat).isValid() ? dayjs(value, valueFormat) : dayjs().startOf('day'),
    };
};

interface DatePickerState extends PickerBodyValue<string> {
    isOpen: boolean;
    inputValue: string | null;
}

/** Represents the properties of the DatePicker component. */
export interface DatePickerProps extends DatePickerCoreProps, SizeMod, IHasEditMode {
    /**
    * HTML ID attribute for the toggler input
    */
    id?: string;
}

export const useDatePickerState = ({
    value,
    format,
    onValueChange,
    filter,
    renderDay,
    renderFooter,
    ...props
}: DatePickerProps) => {
    const context = useUuiContext();
    const [state, _setState] = useState<DatePickerState>({
        isOpen: false,
        view: 'DAY_SELECTION',
        ...getStateFromValue(value, format),
    });

    const getFormat = () => {
        return format || defaultFormat;
    };

    useEffect(() => {
        onChange(value);
        setState({
            selectedDate: value,
            inputValue: toCustomDateFormat(value, getFormat()),
        });
    }, [value]);

    const setState = (newState: Partial<DatePickerState>) => {
        _setState((prev) => ({ ...prev, ...newState }));
    };

    const onChange = (newValue: string | null) => {
        setState({
            selectedDate: newValue,
            displayedDate: dayjs(newValue, valueFormat).isValid() ? dayjs(newValue, valueFormat) : dayjs().startOf('day'),
        });

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(newValue, value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    const handleValueChange = (newValue: string | null) => {
        onValueChange(newValue);
        onChange(newValue);
    };

    const onToggle = (inputValue: boolean) => {
        _setState((prev) => ({
            ...prev,
            isOpen: inputValue,
            view: 'DAY_SELECTION',
            displayedDate: prev.selectedDate ? dayjs(prev.selectedDate) : dayjs(),
        }));
        if (!inputValue) {
            props.onBlur?.();
        }
    };

    const getValue = (): PickerBodyValue<string> => {
        return {
            selectedDate: value,
            displayedDate: state.displayedDate,
            view: state.view,
        };
    };

    const setSelectedDate = (inputValue: string) => {
        if (inputValue !== value) { // ?
            handleValueChange(inputValue);
        }

        setState({
            selectedDate: inputValue,
            inputValue: toCustomDateFormat(inputValue, getFormat()),
        });
    };

    const setDisplayedDateAndView = (displayedDate: Dayjs, view: ViewType) => {
        setState({ displayedDate, view });
    };

    return {
        state,
        handleValueChange,
        setState,
        onToggle,
        getValue,
        setSelectedDate,
        setDisplayedDateAndView,
        getFormat,
    };
};
