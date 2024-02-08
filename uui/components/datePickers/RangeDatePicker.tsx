import * as React from 'react';
import cx from 'classnames';
import dayjs from 'dayjs';
import { uuiMod, DropdownBodyProps, devLogger, withMods, IDropdownTogglerProps, RangeDatePickerPresets } from '@epam/uui-core';
import { Dropdown, valueFormat } from '@epam/uui-components';
import { DropdownContainer } from '../overlays';
import { CalendarPresets } from './CalendarPresets';
import { FlexRow } from '../layout';
import { RangeDatePickerBody, uuiRangeDatePickerBody } from './RangeDatePickerBody';
import { TextInput } from '../inputs';
import { systemIcons } from '../../icons/icons';
import { i18n } from '../../i18n';
import css from './RangeDatePicker.module.scss';
import { defaultValue, useRangeDatePickerState } from './useRangeDatePickerState';
import { RangeDatePickerProps } from './types';

const modifiers = [{ name: 'offset', options: { offset: [0, 6] } }];

function RangeDatePickerComponent(props: RangeDatePickerProps): JSX.Element {
    const {
        state,
        onRangeChange,
        clearRange,
        handleBlur,
        handleFocus,
        toggleIsOpen,
        getChangeHandler,
    } = useRangeDatePickerState(props);

    const renderPresets = (presets: RangeDatePickerPresets) => {
        return (
            <>
                <div className={ uuiRangeDatePickerBody.separator } />
                <CalendarPresets
                    onPresetSet={ (presetVal) => {
                        onRangeChange({
                            view: 'DAY_SELECTION',
                            selectedDate: { from: dayjs(presetVal.from).format(valueFormat), to: dayjs(presetVal.to).format(valueFormat) },
                            month: dayjs(presetVal.from),
                        });
                        toggleIsOpen(false);
                    } }
                    presets={ presets }
                />
            </>
        );
    };

    const renderBody = (renderProps: DropdownBodyProps): JSX.Element => {
        if (!props.isReadonly && !props.isDisabled) {
            return (
                <DropdownContainer { ...renderProps } cx={ cx(css.dropdownContainer) } focusLock={ false }>
                    <FlexRow>
                        <RangeDatePickerBody
                            cx={ cx(props.bodyCx) }
                            value={ {
                                selectedDate: props.value || defaultValue,
                                month: state.month,
                                view: state.view,
                                activePart: state.inFocus,
                            } }
                            onValueChange={ onRangeChange }
                            filter={ props.filter }
                            presets={ props.presets }
                            renderDay={ props.renderDay }
                            renderFooter={ () => {
                                return props.renderFooter?.(props.value || defaultValue);
                            } }
                            renderPresets={ renderPresets }
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
                // onBlur={ handleWrapperBlur }
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
