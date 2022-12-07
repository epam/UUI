import React from 'react';
import { DropdownBodyProps, RangeDatePickerValue, BaseRangeDatePicker } from '@epam/uui-components';
import { DropdownContainer, FlexRow, TextInput, SizeMod, EditMode, RangeDatePickerBody } from '../index';
import { IDropdownToggler, uuiMod, IHasRawProps, BaseRangeDatePickerProps } from "@epam/uui-core";
import cx from 'classnames';
import { TextSettings } from '../../helpers/textLayout';
import { systemIcons } from '../icons/icons';
import { i18n } from '../../i18n';
import css from './RangeDatePicker.scss';

export interface RangeDatePickerProps extends BaseRangeDatePickerProps, SizeMod, TextSettings, EditMode {
    getPlaceholder?(type: InputType): string;
    rawProps?: {
        from?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        to?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        body?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    };
}

export type InputType = 'from' | 'to';
const defaultValue: RangeDatePickerValue = { from: null, to: null };

export class RangeDatePicker extends BaseRangeDatePicker<RangeDatePickerProps> {
    renderBody(props: DropdownBodyProps) {
        return (
            <DropdownContainer { ...props } cx={ this.props.cx }>
                <FlexRow>
                    <RangeDatePickerBody
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
        return (
            <div
                className={ cx(
                    css.dateInputGroup,
                    css[`date-input-group-${this.props.mode}`],
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.isInvalid && uuiMod.invalid,
                ) }
                onClick={ props.onClick }
                onBlur={ this.handleWrapperBlur }
                ref={ props.ref }
            >
                <TextInput
                    icon={ systemIcons[this.props.size || '36'].calendar }
                    cx={ cx(css.dateInput, css['size-' + (this.props.size || 36)], this.state.inFocus === 'from' && uuiMod.focus) }
                    mode={ this.props.mode || 'form' }
                    size={ this.props.size || '36' }
                    lineHeight={ this.props.lineHeight }
                    fontSize={ this.props.fontSize }
                    placeholder={ this.props.getPlaceholder ? this.props.getPlaceholder('from') : i18n.rangeDatePicker.pickerPlaceholderFrom }
                    value={ this.state.inputValue.from }
                    onValueChange={ this.getChangeHandler('from') }
                    isInvalid={ this.props.isInvalid }
                    isDisabled={ this.props.isDisabled }
                    isReadonly={ this.props.isReadonly }
                    onFocus={ (e) => this.handleFocus(e, 'from') }
                    onBlur={ (e) => this.handleBlur(e, 'from') }
                    isDropdown={ false }
                    rawProps={ this.props.rawProps?.from }
                />
                <div className={ css.separator } />
                <TextInput
                    cx={ cx(css.dateInput, css['size-' + (this.props.size || 36)], this.state.inFocus === 'to' && uuiMod.focus) }
                    placeholder={ this.props.getPlaceholder ? this.props.getPlaceholder('to') : i18n.rangeDatePicker.pickerPlaceholderTo }
                    mode={ this.props.mode || 'form' }
                    size={ this.props.size || '36' }
                    lineHeight={ this.props.lineHeight }
                    fontSize={ this.props.fontSize }
                    value={ this.state.inputValue.to }
                    onCancel={ this.props.disableClear ? null : this.state.inputValue.from && this.state.inputValue.to && this.handleCancel }
                    onValueChange={ this.getChangeHandler('to') }
                    isInvalid={ this.props.isInvalid }
                    isDisabled={ this.props.isDisabled }
                    isReadonly={ this.props.isReadonly }
                    onFocus={ (event) => this.handleFocus(event, 'to') }
                    onBlur={ (event) => this.handleBlur(event, 'to') }
                    isDropdown={ false }
                    rawProps={ this.props.rawProps?.to }
                />
            </div>
        );
    }
}
