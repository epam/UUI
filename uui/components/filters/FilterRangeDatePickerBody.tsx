import React, { Fragment } from 'react';
import cx from 'classnames';
import { IDropdownBodyProps, uuiMod } from '@epam/uui-core';
import {
    FlexRow, FlexSpacer, FlexCell,
} from '../layout';
import { LinkButton } from '../buttons';
import { i18n } from '../../i18n';
import { RangeDatePickerInput } from '../datePickers/RangeDatePickerInput';
import { defaultFormat, defaultRangeValue } from '../datePickers/helpers';
import { RangeDatePickerProps } from '../datePickers/types';
import css from '../datePickers/RangeDatePicker.module.scss';
import { RangeDatePickerBody } from '../datePickers';
import { useRangeDatePickerState } from '../datePickers/useRangeDatePickerState';

export interface FilterRangeDatePickerProps extends RangeDatePickerProps, IDropdownBodyProps {}

export function FilterRangeDatePickerBody(props: FilterRangeDatePickerProps) {
    const { value: _value, format = defaultFormat } = props;
    const value = _value || defaultRangeValue;

    const {
        inputValue,
        month,
        view,
        inFocus,
        setInputValue,
        setBodyState,
        onValueChange,
        onBodyValueChange,
    } = useRangeDatePickerState({
        value,
        format,
        getValueChangeAnalyticsEvent: props.getValueChangeAnalyticsEvent,
        onValueChange: props.onValueChange,
        onOpenChange: (newIsOpen: boolean) => {
            if (!newIsOpen) {
                props.onClose?.();
            }
            props.onOpenChange?.(newIsOpen);
        },
    });

    return (
        <Fragment>
            <FlexRow borderBottom={ true }>
                <RangeDatePickerBody
                    value={ {
                        selectedDate: value,
                        month,
                        view,
                        inFocus,
                    } }
                    onValueChange={ onBodyValueChange }
                    filter={ props.filter }
                    presets={ props.presets }
                />
            </FlexRow>
            <FlexCell alignSelf="stretch">
                <FlexRow padding="24" vPadding="12">
                    <div className={ cx(css.dateInputGroup, inFocus && uuiMod.focus) }>
                        <RangeDatePickerInput
                            size="30"
                            disableClear={ props.disableClear }
                            inFocus={ inFocus }
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
                    </div>
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
