import { RangeDatePickerInputType, RangeDatePickerValue, useUuiContext } from '@epam/uui-core';
import { PickerBodyValue, defaultFormat, supportedDateFormats, toCustomDateRangeFormat, toValueDateRangeFormat, valueFormat } from '@epam/uui-components';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { InputType, RangeDatePickerProps } from './types';

interface UseRangeDatePickerStateProps extends RangeDatePickerProps {
    initialInFocus?: RangeDatePickerInputType;
    onClose?: () => void;
}

interface RangeDatePickerState extends PickerBodyValue<RangeDatePickerValue> {
    isOpen: boolean;
    inputValue: RangeDatePickerValue;
    inFocus: RangeDatePickerInputType;
}

type DatePickerStateReducer = (prev: RangeDatePickerState, newState: Partial<RangeDatePickerState>) => RangeDatePickerState;

/*
* Defines input type.
*/
export const defaultValue: RangeDatePickerValue = {
    from: null,
    to: null,
};

const getDefaultValue = () => {
    return {
        inputValue: defaultValue,
        selectedDate: defaultValue,
        month: dayjs().startOf('day'),
    };
};

const getStateFromValue = (value: RangeDatePickerValue, format: string) => {
    if (!value) {
        return getDefaultValue();
    }
    return {
        inputValue: toCustomDateRangeFormat(value, format),
        selectedDate: value,
        month: dayjs(value.from, valueFormat).isValid() ? dayjs(value.from, valueFormat) : dayjs().startOf('day'),
    };
};

export const useRangeDatePickerState = (props: UseRangeDatePickerStateProps) => {
    const { format = defaultFormat } = props;
    const context = useUuiContext();

    const [state, setState] = React.useReducer<DatePickerStateReducer>((prev, newState) => {
        return {
            ...prev,
            ...newState,
        };
    }, {
        isOpen: false,
        view: 'DAY_SELECTION',
        inFocus: props.initialInFocus || null,
        ...getStateFromValue(props.value, format),
    });

    useEffect(() => {
        setState({
            inputValue: props.value ? toCustomDateRangeFormat(props.value, format) : defaultValue,
        });
    }, [format, props.value, setState]);

    const handleValueChange = (newValue: RangeDatePickerValue) => {
        const fromChanged = props.value?.from !== newValue.from;
        const toChanged = props.value?.to !== newValue.to;
        if (fromChanged || toChanged) {
            props.onValueChange(newValue);

            if (props.getValueChangeAnalyticsEvent) {
                const event = props.getValueChangeAnalyticsEvent(newValue, props.value);
                context.uuiAnalytics.sendEvent(event);
            }
        }
    };

    const setValue = (value: PickerBodyValue<RangeDatePickerValue>) => {
        const fromChanged = props.value?.from !== value.selectedDate?.from;
        const toChanged = props.value?.to !== value.selectedDate?.to;
        if (fromChanged || toChanged) {
            handleValueChange(value.selectedDate);
        }

        const formatInputValue = toCustomDateRangeFormat(value.selectedDate, format);
        setState({
            inputValue: formatInputValue,
            ...value,
        });
    };

    const onRangeChange = (value: PickerBodyValue<RangeDatePickerValue>) => {
        const fromChanged = props.value.from !== value.selectedDate.from;
        const toChanged = props.value.to !== value.selectedDate.to;

        if (state.inFocus === 'from' && fromChanged) {
            setState({ inFocus: 'to' });
            setValue(value);
        } else if (state.inFocus === 'to' && toChanged) {
            setState({ inFocus: 'from' });
            setValue(value);
            if (value.selectedDate.from && value.selectedDate.to) {
                toggleIsOpen(false);
            }
        } else {
            setValue(value);
        }
    };

    // why we need this? we close body on range change
    // const handleWrapperBlur = (event: React.FocusEvent<HTMLElement, Element>) => {
    // if (isFocusReceiverInsideFocusLock(event)) {
    //     return;
    // }
    // toggleIsOpen(false);
    // if (!state.isOpen && state.inFocus) {
    //     setState((prev) => ({ ...prev, inFocus: null }));
    // }
    // };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>, inputType: InputType) => {
        toggleIsOpen(true, inputType);

        if (props.onFocus) {
            props.onFocus(event, inputType);
        }
    };

    const getValueOfDate = (value: string) => {
        return dayjs(value, supportedDateFormats(format), true).valueOf();
    };

    const valueIsValid = (value: string, inputType: RangeDatePickerInputType) => {
        const isValidDate = dayjs(value, supportedDateFormats(format), true).isValid();
        const valueOfDate = getValueOfDate(value);
        const valueOfDateTo = getValueOfDate(state.inputValue.to);
        const valueOfDateFrom = getValueOfDate(state.inputValue.from);

        if (isValidDate) {
            if (inputType === 'from') {
                return state.inputValue.to ? valueOfDate <= valueOfDateTo : true;
            } else {
                return state.inputValue.from ? valueOfDateFrom <= valueOfDate : true;
            }
        }
        return false;
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>, inputType: InputType) => {
        if (props.onBlur) {
            props.onBlur(event, inputType);
        }

        if (!valueIsValid(state.inputValue[inputType], inputType) || (props.filter && !props.filter(dayjs(props.value[inputType])))) {
            switch (inputType) {
                case 'from':
                    handleValueChange({
                        ...props.value,
                        from: null,
                    });
                    getChangeHandler('from')(null);
                    break;
                case 'to':
                    handleValueChange({
                        ...props.value,
                        to: null,
                    });
                    getChangeHandler('to')(null);
                    break;
            }
        } else {
            const formatInputValue = toCustomDateRangeFormat(state.inputValue, format);
            setState({ inputValue: formatInputValue });
        }
    };

    const getChangeHandler = (inputType: InputType) => (value: string) => {
        const inputValue = {
            ...state.inputValue,
            [inputType]: value,
        };
        if (valueIsValid(value, inputType) && (!props.filter || props.filter(dayjs(value)))) {
            setValue({
                selectedDate: toValueDateRangeFormat(inputValue, format),
                month: dayjs(value, supportedDateFormats(format)),
                view: state.view,
            });
        } else {
            switch (inputType) {
                case 'from':
                    setValue({
                        ...state,
                        selectedDate: {
                            from: null,
                            to: state.selectedDate.to,
                        },
                    });
                    break;
                case 'to':
                    setValue({
                        ...state,
                        selectedDate: {
                            from: state.selectedDate.from,
                            to: null,
                        },
                    });
                    break;
            }
        }

        setState({ inputValue });
    };

    const clearRange = () => {
        handleValueChange({
            from: null,
            to: null,
        });
        const defaultVal = getDefaultValue();
        setState({
            isOpen: true,
            view: 'DAY_SELECTION',
            inFocus: 'to',
            selectedDate: defaultVal.selectedDate,
            inputValue: defaultVal.inputValue,
        });
    };

    const getMonthOnOpening = (focus: RangeDatePickerInputType) => {
        if (state.selectedDate?.from && state.selectedDate?.to) {
            return dayjs(state.selectedDate[focus]);
        } else if (state.selectedDate?.from) {
            return dayjs(state.selectedDate?.from);
        } else if (state.selectedDate?.to) {
            return dayjs(state.selectedDate?.to);
        } else {
            return dayjs();
        }
    };

    const toggleIsOpen = (value: boolean, focus?: RangeDatePickerInputType) => {
        if (!props.isReadonly && !props.isDisabled) {
            const newState: Partial<RangeDatePickerState> = {
                isOpen: value,
                view: 'DAY_SELECTION',
                inFocus: value ? focus : null,
            };
            if (value) {
                setState({
                    ...newState,
                    month: getMonthOnOpening(focus),
                });
            } else {
                setState(newState);
                props.onClose?.();
            }

            props?.onOpenChange?.(value);

            // if (props.getValueChangeAnalyticsEvent) {
            //     const event = props.getValueChangeAnalyticsEvent(value, state.isOpen);
            //     context.uuiAnalytics.sendEvent(event);
            // }
        }
    };

    return {
        state,
        onRangeChange,
        clearRange,
        handleBlur,
        handleFocus,
        toggleIsOpen,
        getChangeHandler,
    };
};
