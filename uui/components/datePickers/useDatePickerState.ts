import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect, useCallback } from 'react';
import { defaultFormat, toCustomDateFormat, valueFormat, PickerBodyValue, ViewType, toValueDateFormat, supportedDateFormats } from '@epam/uui-components';
import { DatePickerCoreProps, isFocusReceiverInsideFocusLock, useUuiContext } from '@epam/uui-core';
import { SizeMod, IHasEditMode } from '../types';

export const getStateFromValue = (value: string | null, format: string) => {
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

export interface DatePickerState extends PickerBodyValue<string> {
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

    const [state, setState] = useState<DatePickerState>({
        isOpen: false,
        view: 'DAY_SELECTION',
        ...getStateFromValue(value, format),
    });

    const updateState = useCallback((newState: Partial<DatePickerState>) => {
        setState((prev) => ({ ...prev, ...newState }));
    }, [setState]);

    // handles update of value prop
    useEffect(() => {
        updateState({
            selectedDate: value,
            displayedDate: dayjs(value, valueFormat).isValid()
                ? dayjs(value, valueFormat)
                : dayjs().startOf('day'),
            inputValue: toCustomDateFormat(value, format),
        });
    }, [value, format, updateState]);

    const handleValueChange = (newValue: string | null) => {
        onValueChange(newValue);
        updateState({
            selectedDate: newValue,
            displayedDate: dayjs(newValue, valueFormat).isValid() ? dayjs(newValue, valueFormat) : dayjs().startOf('day'),
        });

        if (props.getValueChangeAnalyticsEvent) {
            const event = props.getValueChangeAnalyticsEvent(newValue, value);
            context.uuiAnalytics.sendEvent(event);
        }
    };

    const handleInputChange = (inputValue: string) => {
        const resultValue = toValueDateFormat(inputValue, format);
        if (getIsValidDate(inputValue)) {
            handleValueChange(resultValue);
            updateState({ inputValue });
        } else {
            updateState({ inputValue });
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        handleToggle(true);
        props.onFocus?.(e);
    };

    const getIsValidDate = (inputValue: string) => {
        if (!inputValue) {
            return false;
        }

        const parsedDate = dayjs(inputValue, supportedDateFormats(format), true);
        const isValidDate = parsedDate.isValid();
        if (!isValidDate) {
            return false;
        }

        return filter ? filter(parsedDate) : true;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isFocusReceiverInsideFocusLock(e)) return;
        handleToggle(false);
        if (getIsValidDate(state.inputValue)) {
            updateState({ inputValue: toCustomDateFormat(state.inputValue, format) });
        } else if (state.inputValue !== '' && state.inputValue != null) {
            handleValueChange(null);
            updateState({ inputValue: null, selectedDate: null });
        }
    };

    const handleCancel = () => {
        handleValueChange(null);
        updateState({ inputValue: null, selectedDate: null });
    };

    const handleToggle = (inputValue: boolean) => {
        updateState({
            isOpen: inputValue,
            view: 'DAY_SELECTION',
            displayedDate: state.selectedDate ? dayjs(state.selectedDate) : dayjs(),
        });
        if (!inputValue) {
            props.onBlur?.();
        }
    };

    const setSelectedDate = (inputValue: string) => {
        if (inputValue !== state.selectedDate) {
            handleValueChange(inputValue);
        }

        const cusotmDateFormat = toCustomDateFormat(inputValue, format);

        updateState({
            selectedDate: inputValue,
            inputValue: cusotmDateFormat,
        });
    };

    const setDisplayedDateAndView = (dd: Dayjs, v: ViewType) => {
        updateState({ displayedDate: dd, view: v });
    };

    return {
        state,
        handleInputChange,
        handleFocus,
        handleBlur,
        handleCancel,
        handleToggle,
        setSelectedDate,
        setDisplayedDateAndView,
    };
};
