import * as React from 'react';
import dayjs from "dayjs";
import { BaseRangeDatePickerProps, IDropdownBodyProps, RangeDatePickerInputType, uuiMod } from "@epam/uui-core";
import { BaseRangeDatePicker } from '@epam/uui-components';
import { FlexRow, i18n, RangeDatePickerBody, TextInput, LinkButton, FlexSpacer, FlexCell } from '../../index';
import cx from "classnames";
import css from "../datePickers/RangeDatePicker.scss";
import { systemIcons } from "../../icons/icons";

export interface RangeDatePickerProps extends BaseRangeDatePickerProps, IDropdownBodyProps {}

export class FilterRangeDatePickerBody extends BaseRangeDatePicker<RangeDatePickerProps> {
    state = {
        ...super.getInitialState(),
        inFocus: 'from' as RangeDatePickerInputType,
    };

    renderBody() {
        return (
            <>
                <FlexRow borderBottom="gray40">
                    <RangeDatePickerBody
                        value={ this.getValue() }
                        onValueChange={ this.onRangeChange }
                        filter={ this.props.filter }
                        focusPart={ this.state.inFocus }
                        changeIsOpen={ this.props.onClose }
                    />
                </FlexRow>
                <FlexCell alignSelf="stretch">
                    <FlexRow padding="24" vPadding="12">
                        <div className={ cx(css.dateInputGroup, this.state.inFocus && uuiMod.focus) }>
                            <TextInput
                                icon={ systemIcons['30'].calendar }
                                cx={ cx(css.dateInput, css['size-30'], this.state.inFocus === 'from' && uuiMod.focus) }
                                size={ '30' }
                                placeholder={ i18n.rangeDatePicker.pickerPlaceholderFrom }
                                value={ dayjs(this.state.inputValue.from).isValid() ? dayjs(this.state.inputValue.from).format(this.props.format || 'MMM DD, YYYY') : this.state.inputValue.from }
                                onValueChange={ this.getChangeHandler('from') }
                                onFocus={ (event) => this.handleFocus(event, 'from') }
                                onBlur={ (event) => this.handleBlur(event, 'from') }
                            />
                            <div className={ css.separator }/>
                            <TextInput
                                cx={ cx(css.dateInput, css['size-30'], this.state.inFocus === 'to' && uuiMod.focus) }
                                placeholder={ i18n.rangeDatePicker.pickerPlaceholderTo }
                                size={ '30' }
                                value={ dayjs(this.state.inputValue.to).isValid() ? dayjs(this.state.inputValue.to).format(this.props.format || 'MMM DD, YYYY') : this.state.inputValue.to }
                                onCancel={ this.state.inputValue.from && this.state.inputValue.to && this.handleCancel }
                                onValueChange={ this.getChangeHandler('to') }
                                onFocus={ (event) => this.handleFocus(event, 'to') }
                                onBlur={ (event) => this.handleBlur(event, 'to') }
                            />
                        </div>
                        <FlexSpacer/>
                        <LinkButton
                            isDisabled={ !this.state.inputValue.from && !this.state.inputValue.to }
                            caption={ i18n.pickerModal.clearAllButton }
                            onClick={ this.handleCancel }
                        />
                    </FlexRow>
                </FlexCell>
            </>
        );
    }

    renderInput = (): any => {
        return null;
    }

    render() {
        return this.renderBody();
    }
}
