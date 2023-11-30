import * as React from 'react';
import cx from 'classnames';
import {
    IDropdownToggler, uuiMod, BaseRangeDatePickerProps, DropdownBodyProps, devLogger, withMods,
} from '@epam/uui-core';
import { RangeDatePickerValue } from '@epam/uui-core';
import { BaseRangeDatePicker } from '@epam/uui-components';
import { DropdownContainer } from '../overlays';
import { FlexRow } from '../layout';
import { SizeMod } from '../types';
import { RangeDatePickerBody } from './RangeDatePickerBody';
import { TextInput } from '../inputs';
import { systemIcons } from '../../icons/icons';
import { i18n } from '../../i18n';
import css from './RangeDatePicker.module.scss';

export interface RangeDatePickerProps extends BaseRangeDatePickerProps, SizeMod {
    getPlaceholder?(type: InputType): string;
}

export type InputType = 'from' | 'to';
const defaultValue: RangeDatePickerValue = { from: null, to: null };

class RangeDatePickerComponent extends BaseRangeDatePicker<RangeDatePickerProps> {
    renderBody(props: DropdownBodyProps) {
        return (
            <DropdownContainer { ...props } cx={ cx(css.dropdownContainer) } focusLock={ false }>
                <FlexRow>
                    <RangeDatePickerBody
                        cx={ cx(this.props.bodyCx) }
                        value={ this.getValue() }
                        onValueChange={ this.onRangeChange }
                        filter={ this.props.filter }
                        changeIsOpen={ this.toggleOpening }
                        presets={ this.props.presets }
                        focusPart={ this.state.inFocus }
                        renderDay={ this.props.renderDay }
                        renderFooter={ this.props.renderFooter && (() => this.props.renderFooter(this.props.value || defaultValue)) }
                        isHoliday={ this.props.isHoliday }
                        rawProps={ this.props.rawProps?.body }
                    />
                </FlexRow>
            </DropdownContainer>
        );
    }

    renderInput = (props: IDropdownToggler) => {
        if (__DEV__) {
            if (this.props.size === '48') {
                devLogger.warnAboutDeprecatedPropValue<RangeDatePickerProps, 'size'>({
                    component: 'RangeDatePicker',
                    propName: 'size',
                    propValue: this.props.size,
                    propValueUseInstead: '42',
                    condition: () => ['48'].indexOf(this.props.size) !== -1,
                });
            }
        }
        return (
            <div
                className={ cx(
                    this.props.inputCx,
                    css.dateInputGroup,
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.isInvalid && uuiMod.invalid,
                    this.state.inFocus && uuiMod.focus,
                ) }
                onClick={ !this.props.isDisabled && props.onClick }
                onBlur={ this.handleWrapperBlur }
                ref={ props.ref }
            >
                <TextInput
                    icon={ systemIcons[this.props.size || '36'].calendar }
                    cx={ cx(css.dateInput, css['size-' + (this.props.size || 36)], this.state.inFocus === 'from' && uuiMod.focus) }
                    size={ this.props.size || '36' }
                    placeholder={ this.props.getPlaceholder ? this.props.getPlaceholder('from') : i18n.rangeDatePicker.pickerPlaceholderFrom }
                    value={ this.state.inputValue.from }
                    onValueChange={ this.getChangeHandler('from') }
                    isInvalid={ this.props.isInvalid }
                    isDisabled={ this.props.isDisabled }
                    isReadonly={ this.props.isReadonly }
                    onFocus={ (event) => this.handleFocus(event, 'from') }
                    onBlur={ (event) => this.handleBlur(event, 'from') }
                    isDropdown={ false }
                    rawProps={ this.props.rawProps?.from }
                />
                <div className={ css.separator } />
                <TextInput
                    cx={ cx(css.dateInput, css['size-' + (this.props.size || 36)], this.state.inFocus === 'to' && uuiMod.focus) }
                    placeholder={ this.props.getPlaceholder ? this.props.getPlaceholder('to') : i18n.rangeDatePicker.pickerPlaceholderTo }
                    size={ this.props.size || '36' }
                    value={ this.state.inputValue.to }
                    onCancel={ this.props.disableClear ? null : this.state.inputValue.from && this.state.inputValue.to && this.handleCancel }
                    onValueChange={ this.getChangeHandler('to') }
                    isInvalid={ this.props.isInvalid }
                    isDisabled={ this.props.isDisabled }
                    isReadonly={ this.props.isReadonly }
                    onFocus={ (e) => this.handleFocus(e, 'to') }
                    onBlur={ (e) => this.handleBlur(e, 'to') }
                    isDropdown={ false }
                    rawProps={ this.props.rawProps?.to }
                />
            </div>
        );
    };
}

export const RangeDatePicker = withMods(RangeDatePickerComponent);
