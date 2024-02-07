import * as React from 'react';
import cx from 'classnames';
import dayjs from 'dayjs';
import { uuiMod, BaseRangeDatePickerProps, DropdownBodyProps, devLogger, withMods, IDropdownTogglerProps, RangeDatePickerInputType, useUuiContext } from '@epam/uui-core';
import { RangeDatePickerValue } from '@epam/uui-core';
import { Dropdown, PickerBodyValue, defaultFormat, supportedDateFormats, toCustomDateRangeFormat, toValueDateRangeFormat, valueFormat } from '@epam/uui-components';
import { DropdownContainer } from '../overlays';
import { FlexRow } from '../layout';
import { SizeMod } from '../types';
import { RangeDatePickerBody } from './RangeDatePickerBody';
import { TextInput } from '../inputs';
import { systemIcons } from '../../icons/icons';
import { i18n } from '../../i18n';
import css from './RangeDatePicker.module.scss';

export interface RangeDatePickerProps extends BaseRangeDatePickerProps, SizeMod {
    /**
     * A pure function that gets placeholder for 'from' or 'to' input.
     */
    getPlaceholder?(type: InputType): string;
    /**
    * HTML ID attribute for the first input into toggler
    */
    id?: string;
}

interface RangeDatePickerState extends PickerBodyValue<RangeDatePickerValue> {
    isOpen: boolean;
    inputValue: RangeDatePickerValue;
    inFocus: RangeDatePickerInputType;
}

/*
* Defines input type.
*/
export type InputType = 'from' | 'to';
const defaultValue: RangeDatePickerValue = { from: null, to: null };
const modifiers = [{ name: 'offset', options: { offset: [0, 6] } }];

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

function RangeDatePickerComponent(props: RangeDatePickerProps): JSX.Element {
    const context = useUuiContext();

    const [state, setState] = React.useState<RangeDatePickerState>({
        isOpen: false,
        view: 'DAY_SELECTION',
        inFocus: null,
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
    };

    // why we need this? we close body on range change
    const handleWrapperBlur = (event: React.FocusEvent<HTMLElement, Element>) => {
        // if (isFocusReceiverInsideFocusLock(event)) {
        //     return;
        // }
        // toggleIsOpen(false);
        // if (!state.isOpen && state.inFocus) {
        //     setState((prev) => ({ ...prev, inFocus: null }));
        // }
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>, inputType: InputType) => {
        toggleIsOpen(true, inputType);
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

    const getValue = (): PickerBodyValue<RangeDatePickerValue> => {
        return {
            selectedDate: props.value || defaultValue,
            month: state.month,
            view: state.view,
            // activePart:
        };
    };

    // why we need this?
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
            setState((prev) => ({
                ...prev,
                isOpen: value,
                view: 'DAY_SELECTION',
                month: getMonthOnOpening(focus),
                inFocus: value ? focus : null,
            }));

            props?.onOpenChange?.(value);

            // if (props.getValueChangeAnalyticsEvent) {
            //     const event = props.getValueChangeAnalyticsEvent(value, state.isOpen);
            //     context.uuiAnalytics.sendEvent(event);
            // }
        }
    };

    const renderBody = (renderProps: DropdownBodyProps): JSX.Element => {
        if (!props.isReadonly && !props.isDisabled) {
            return (
                <DropdownContainer { ...renderProps } cx={ cx(css.dropdownContainer) } focusLock={ false }>
                    <FlexRow>
                        <RangeDatePickerBody
                            cx={ cx(props.bodyCx) }
                            value={ getValue() }
                            onValueChange={ onRangeChange }
                            filter={ props.filter }
                            changeIsOpen={ toggleIsOpen }
                            presets={ props.presets }
                            focusPart={ state.inFocus }
                            renderDay={ props.renderDay }
                            renderFooter={ () => {
                                return props.renderFooter?.(props.value || defaultValue);
                            } }
                            isHoliday={ props.isHoliday }
                            rawProps={ props.rawProps?.body }
                        />
                    </FlexRow>
                </DropdownContainer>
            );
        }
    };

    const renderInput = (renderProps: IDropdownTogglerProps): JSX.Element => {
        if (__DEV__) {
            if (props.size === '48') {
                devLogger.warnAboutDeprecatedPropValue<RangeDatePickerProps, 'size'>({
                    component: 'RangeDatePicker',
                    propName: 'size',
                    propValue: props.size,
                    propValueUseInstead: '42',
                    condition: () => ['48'].indexOf(props.size) !== -1,
                });
            }
        }
        return (
            <div
                className={ cx(
                    props.inputCx,
                    css.dateInputGroup,
                    props.isDisabled && uuiMod.disabled,
                    props.isReadonly && uuiMod.readonly,
                    props.isInvalid && uuiMod.invalid,
                    state.inFocus && uuiMod.focus,
                ) }
                onClick={ !props.isDisabled && renderProps.onClick }
                onBlur={ handleWrapperBlur }
                ref={ renderProps.ref }
            >
                <TextInput
                    icon={ systemIcons[props.size || '36'].calendar }
                    cx={ cx(css.dateInput, css['size-' + (props.size || 36)], state.inFocus === 'from' && uuiMod.focus) }
                    size={ props.size || '36' }
                    placeholder={ props.getPlaceholder ? props.getPlaceholder('from') : i18n.rangeDatePicker.pickerPlaceholderFrom }
                    value={ state.inputValue.from }
                    onValueChange={ getChangeHandler('from') }
                    isInvalid={ props.isInvalid }
                    isDisabled={ props.isDisabled }
                    isReadonly={ props.isReadonly }
                    onFocus={ (event) => handleFocus(event, 'from') }
                    onBlur={ (event) => handleBlur(event, 'from') }
                    isDropdown={ false }
                    rawProps={ props.rawProps?.from }
                    id={ props?.id }
                />
                <div className={ css.separator } />
                <TextInput
                    cx={ cx(css.dateInput, css['size-' + (props.size || 36)], state.inFocus === 'to' && uuiMod.focus) }
                    placeholder={ props.getPlaceholder ? props.getPlaceholder('to') : i18n.rangeDatePicker.pickerPlaceholderTo }
                    size={ props.size || '36' }
                    value={ state.inputValue.to }
                    onCancel={ clearRange }
                    onValueChange={ getChangeHandler('to') }
                    isInvalid={ props.isInvalid }
                    isDisabled={ props.isDisabled }
                    isReadonly={ props.isReadonly }
                    onFocus={ (e) => handleFocus(e, 'to') }
                    onBlur={ (e) => handleBlur(e, 'to') }
                    isDropdown={ false }
                    rawProps={ props.rawProps?.to }
                />
            </div>
        );
    };

    return (
        <Dropdown
            renderTarget={ (renderProps) => {
                return props.renderTarget?.(renderProps) || renderInput(renderProps);
            } }
            renderBody={ (renderProps) => renderBody(renderProps) }
            onValueChange={ toggleIsOpen }
            value={ state.isOpen }
            modifiers={ modifiers }
            placement={ props.placement }
            forwardedRef={ props.forwardedRef }
        />
    );
}

export const RangeDatePicker = withMods(RangeDatePickerComponent);
