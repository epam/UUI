import * as React from 'react';
import cx from 'classnames';
import { BaseRangeDatePickerProps, IDropdownBodyProps, uuiMod } from '@epam/uui-core';
import { FlexRow, FlexSpacer, FlexCell } from '../layout';
import { LinkButton } from '../buttons';
import { TextInput } from '../inputs';
import { RangeDatePickerBody } from '../datePickers';
import { i18n } from '../../i18n';
import { systemIcons } from '../../icons/icons';
import css from './FilterRangeDatePickerBody.module.scss';
import { useRangeDatePickerState } from '../datePickers/useRangeDatePickerState';

export interface RangeDatePickerProps extends BaseRangeDatePickerProps, IDropdownBodyProps {}

export function FilterRangeDatePickerBody(props: RangeDatePickerProps) {
    const {
        state,
        onRangeChange,
        clearRange,
        handleBlur,
        handleFocus,
        getChangeHandler,
    } = useRangeDatePickerState({
        ...props,
        initialInFocus: 'from',
        onOpenChange: (value) => {
            props.onOpenChange?.(value);
            if (!value) {
                props.onClose?.();
            }
        },
    });

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
