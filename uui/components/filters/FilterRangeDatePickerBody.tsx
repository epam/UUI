import React, {
    useEffect, Fragment, useState, useMemo,
} from 'react';
import cx from 'classnames';
import {
    BaseRangeDatePickerProps, IDropdownBodyProps, RangeDatePickerInputType, RangeDatePickerValue, useUuiContext, uuiMod,
} from '@epam/uui-core';
import {
    FlexRow, FlexSpacer, FlexCell,
} from '../layout';
import { LinkButton } from '../buttons';
import { RangeDatePickerBody } from '../datePickers';
import { i18n } from '../../i18n';
import { RangeDatePickerInput } from '../datePickers/RangeDatePickerInput';
import dayjs, { Dayjs } from 'dayjs';
import {
    toCustomDateRangeFormat, ViewType, valueFormat, RangePickerBodyValue, defaultFormat, toValueDateRangeFormat,
} from '@epam/uui-components';
import { defaultRangeValue } from '../datePickers/helpers';
import css from '../datePickers/RangeDatePicker.module.scss';

export interface RangeDatePickerProps extends BaseRangeDatePickerProps, IDropdownBodyProps {}

export function FilterRangeDatePickerBody(props: RangeDatePickerProps) {
    const { value: _value, format = defaultFormat } = props;
    const value = _value || defaultRangeValue;
    const context = useUuiContext();

    const [inputValue, setInputValue] = useState<RangeDatePickerValue>(
        toCustomDateRangeFormat(value, format),
    );

    // use omit here
    const [bodyState, setBodyState] = useState<{
        view: ViewType;
        month: Dayjs;
        inFocus: RangeDatePickerInputType
    }>({
        view: 'DAY_SELECTION',
        month: dayjs(value.from, valueFormat).isValid() ? dayjs(value.from, valueFormat) : dayjs().startOf('day'),
        inFocus: 'from',
    });

    useEffect(() => {
        setInputValue(value ? toCustomDateRangeFormat(props.value, format) : defaultRangeValue);
    }, [format, value, setInputValue]);

    const onValueChange = (newValue: RangeDatePickerValue) => {
        const fromChanged = value?.from !== newValue.from;
        const toChanged = value?.to !== newValue.to;
        if (fromChanged || toChanged) {
            props.onValueChange(newValue);

            if (props.getValueChangeAnalyticsEvent) {
                const event = props.getValueChangeAnalyticsEvent(newValue, value);
                context.uuiAnalytics.sendEvent(event);
            }
        }
    };

    const onBodyValueChange = (newValue: RangePickerBodyValue<RangeDatePickerValue>) => {
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
            props.onClose?.();
        }
    };

    return (
        <Fragment>
            <FlexRow borderBottom={ true }>
                <RangeDatePickerBody
                    value={ {
                        selectedDate: value,
                        month: bodyState.month,
                        view: bodyState.view,
                        inFocus: bodyState.inFocus,
                    } }
                    onValueChange={ onBodyValueChange }
                    filter={ props.filter }
                    presets={ props.presets }
                />
            </FlexRow>
            <FlexCell alignSelf="stretch">
                <FlexRow padding="24" vPadding="12">
                    <RangeDatePickerInput
                        cx={ cx(
                            css.dateInputGroup,
                            bodyState.inFocus && uuiMod.focus,
                        ) }
                        size="30"
                        disableClear={ props.disableClear }
                        inFocus={ bodyState.inFocus }
                        format={ format }
                        value={ inputValue }
                        onValueChange={ setInputValue }
                        onFocus={ (event, inputType) => {
                            if (props.onFocus) {
                                props.onFocus(event, inputType);
                            }

                            setBodyState((prev) => ({
                                ...prev,
                                inFocus: inputType,
                            }));
                        } }
                        onBlur={ (event, inputType, v) => {
                            if (props.onBlur) {
                                props.onBlur(event, inputType);
                            }

                            setInputValue(v.inputValue);
                            onValueChange(v.selectedDate);
                        } }
                        onClear={ onValueChange }
                    />
                    <FlexSpacer />
                    <LinkButton
                        isDisabled={ !inputValue.from && !inputValue.to }
                        caption={ i18n.pickerModal.clearAllButton }
                        onClick={ () => onValueChange(defaultRangeValue) }
                    />
                </FlexRow>
            </FlexCell>
        </Fragment>
    );
}
