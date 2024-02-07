import * as React from 'react';
import cx from 'classnames';
import {
    BaseRangeDatePickerProps, IDropdownBodyProps, RangeDatePickerInputType, RangeDatePickerValue, useUuiContext, uuiMod,
} from '@epam/uui-core';
import { PickerBodyValue, defaultFormat, supportedDateFormats, toCustomDateRangeFormat, toValueDateRangeFormat, valueFormat } from '@epam/uui-components';
import { FlexRow, FlexSpacer, FlexCell } from '../layout';
import { LinkButton } from '../buttons';
import { TextInput } from '../inputs';
import { InputType, RangeDatePickerBody } from '../datePickers';
import { i18n } from '../../i18n';
import { systemIcons } from '../../icons/icons';
import css from './FilterRangeDatePickerBody.module.scss';
import dayjs from 'dayjs';

interface RangeDatePickerState extends PickerBodyValue<RangeDatePickerValue> {
    isOpen: boolean;
    inputValue: RangeDatePickerValue;
    inFocus: RangeDatePickerInputType;
}

const defaultValue: RangeDatePickerValue = { from: null, to: null };

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

    const inputFormat = format || defaultFormat;
    return {
        inputValue: toCustomDateRangeFormat(value, inputFormat),
        selectedDate: value,
        month: dayjs(value.from, valueFormat).isValid() ? dayjs(value.from, valueFormat) : dayjs().startOf('day'),
    };
};

export interface RangeDatePickerProps extends BaseRangeDatePickerProps, IDropdownBodyProps {}

export function FilterRangeDatePickerBody(props: RangeDatePickerProps) {
    const context = useUuiContext();

    const [state, setState] = React.useState<RangeDatePickerState>({
        isOpen: false,
        view: 'DAY_SELECTION',
        inFocus: 'from', // difference from range date picker
        ...getStateFromValue(props.value, props.format),
    });

    const getFormat = () => {
        return props.format || defaultFormat;
    };

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

        const formatInputValue = toCustomDateRangeFormat(value.selectedDate, getFormat());
        setState((prev) => ({
            ...prev,
            inputValue: formatInputValue,
            ...value,
        }));
    };

    const onRangeChange = (value: PickerBodyValue<RangeDatePickerValue>) => {
        const fromChanged = props.value.from !== value.selectedDate.from;
        const toChanged = props.value.to !== value.selectedDate.to;

        if (state.inFocus === 'from' && fromChanged) {
            setState((prev) => ({ ...prev, inFocus: 'to' }));
            setValue(value);
        } else if (state.inFocus === 'to' && toChanged) {
            setState((prev) => ({ ...prev, inFocus: 'from' }));
            setValue(value);
        } else {
            setValue(value);
        }

        if (value.selectedDate.from && value.selectedDate.to && state.inFocus === 'to') {
            toggleIsOpen(false);
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
        if (!state.isOpen) {
            toggleIsOpen(true, inputType);
        }

        if (props.onFocus) {
            props.onFocus(event, inputType);
        }
    };

    const getValueOfDate = (value: string) => {
        return dayjs(value, supportedDateFormats(getFormat()), true).valueOf();
    };

    const valueIsValid = (value: string, inputType: RangeDatePickerInputType) => {
        const isValidDate = dayjs(value, supportedDateFormats(getFormat()), true).isValid();
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
                    handleValueChange({ ...props.value, from: null });
                    getChangeHandler('from')(null);
                    break;
                case 'to':
                    handleValueChange({ ...props.value, to: null });
                    getChangeHandler('to')(null);
                    break;
            }
        } else {
            setState((prev) => {
                const formatInputValue = toCustomDateRangeFormat(prev.inputValue, getFormat());
                return { ...prev, inputValue: formatInputValue };
            });
        }
    };

    const getChangeHandler = (inputType: InputType) => (value: string) => {
        const inputValue = { ...state.inputValue, [inputType]: value };
        if (valueIsValid(value, inputType) && (!props.filter || props.filter(dayjs(value)))) {
            setValue({
                selectedDate: toValueDateRangeFormat(inputValue, getFormat()),
                month: dayjs(value, supportedDateFormats(getFormat())),
                view: state.view,
            });
        } else {
            switch (inputType) {
                case 'from':
                    setValue({ ...state, selectedDate: { from: null, to: state.selectedDate.to } });
                    break;
                case 'to':
                    setValue({ ...state, selectedDate: { from: state.selectedDate.from, to: null } });
                    break;
            }
        }
        setState((prev) => ({ ...prev, inputValue }));
    };

    const clearRange = () => {
        const clearAllowed = !props.disableClear && state.inputValue.from && state.inputValue.to;
        if (clearAllowed) {
            handleValueChange({ from: null, to: null });
            const defaultVal = getDefaultValue();
            setState((prev) => ({
                ...prev,
                isOpen: true,
                view: 'DAY_SELECTION',
                inFocus: 'to',
                selectedDate: defaultVal.selectedDate,
                inputValue: defaultVal.inputValue,
            }));
        }
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
                setState((prev) => ({
                    ...prev,
                    ...newState,
                    month: getMonthOnOpening(focus),
                }));
            } else {
                setState((prev) => ({ ...prev, ...newState }));
                props.onClose(); // difference from range date picker
            }

            props?.onOpenChange?.(value);

            // if (props.getValueChangeAnalyticsEvent) {
            //     const event = props.getValueChangeAnalyticsEvent(value, state.isOpen);
            //     context.uuiAnalytics.sendEvent(event);
            // }
        }
    };

    return (
        <>
            <FlexRow borderBottom={ true }>
                <RangeDatePickerBody
                    value={ {
                        selectedDate: state.selectedDate,
                        month: state.month,
                        view: state.view,
                        activePart: state.inFocus,
                    } }
                    onValueChange={ onRangeChange }
                    filter={ props.filter }
                    presets={ props.presets }
                />
            </FlexRow>
            <FlexCell alignSelf="stretch">
                <FlexRow padding="24" vPadding="12">
                    <div className={ cx(css.dateInputGroup, state.inFocus && uuiMod.focus) }>
                        <TextInput
                            icon={ systemIcons['30'].calendar }
                            cx={ cx(css.dateInput, css['size-30'], state.inFocus === 'from' && uuiMod.focus) }
                            size="30"
                            placeholder={ i18n.rangeDatePicker.pickerPlaceholderFrom }
                            value={ state.inputValue.from }
                            onValueChange={ getChangeHandler('from') }
                            onFocus={ (event) => handleFocus(event, 'from') }
                            onBlur={ (event) => handleBlur(event, 'from') }
                        />
                        <div className={ css.separator } />
                        <TextInput
                            cx={ cx(css.dateInput, css['size-30'], state.inFocus === 'to' && uuiMod.focus) }
                            placeholder={ i18n.rangeDatePicker.pickerPlaceholderTo }
                            size="30"
                            value={ state.inputValue.to }
                            onCancel={ clearRange }
                            onValueChange={ getChangeHandler('to') }
                            onFocus={ (event) => handleFocus(event, 'to') }
                            onBlur={ (event) => handleBlur(event, 'to') }
                        />
                    </div>
                    <FlexSpacer />
                    <LinkButton
                        isDisabled={ !state.inputValue.from && !state.inputValue.to }
                        caption={ i18n.pickerModal.clearAllButton }
                        onClick={ clearRange }
                    />
                </FlexRow>
            </FlexCell>
        </>
    );
}
