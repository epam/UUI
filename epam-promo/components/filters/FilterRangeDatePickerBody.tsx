import * as React from 'react';
import { BaseRangeDatePickerProps, RangeDatePickerInputType, uuiMod } from "@epam/uui-core";
import { BaseRangeDatePicker } from '@epam/uui-components';
import { DropdownContainer, FlexRow, i18n, RangeDatePickerBody, TextInput, LinkButton, FlexSpacer, FlexCell } from '../../index';
import cx from "classnames";
import * as css from "../datePickers/RangeDatePicker.scss";
import { systemIcons } from "../../icons/icons";

export interface RangeDatePickerProps extends BaseRangeDatePickerProps {}

export class FilterRangeDatePickerBody extends BaseRangeDatePicker<RangeDatePickerProps> {
    state = {
        ...super.getInitialState(),
        inFocus: 'from' as RangeDatePickerInputType,
    };

    renderBody() {
        return (
            <DropdownContainer>
                <FlexRow borderBottom="gray40">
                    <RangeDatePickerBody
                        value={ this.getValue() }
                        onValueChange={ this.onRangeChange }
                        filter={ this.props.filter }
                        focusPart={ this.state.inFocus }
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
                                value={ this.state.inputValue.from }
                                onValueChange={ this.getChangeHandler('from') }
                                onFocus={ () => this.handleFocus('from') }
                                onBlur={ () => this.handleBlur('from') }
                            />
                            <div className={ css.separator }/>
                            <TextInput
                                cx={ cx(css.dateInput, css['size-30'], this.state.inFocus === 'to' && uuiMod.focus) }
                                placeholder={ i18n.rangeDatePicker.pickerPlaceholderTo }
                                size={ '30' }
                                value={ this.state.inputValue.to }
                                onCancel={ this.state.inputValue.from && this.state.inputValue.to && this.handleCancel }
                                onValueChange={ this.getChangeHandler('to') }
                                onFocus={ () => this.handleFocus('to') }
                                onBlur={ () => this.handleBlur('to') }
                            />
                        </div>
                        <FlexSpacer/>
                        <LinkButton
                            isDisabled={ !this.state.inputValue.from && !this.state.inputValue.to }
                            caption="CLEAR ALL"
                            onClick={ this.handleCancel }
                        />
                    </FlexRow>
                </FlexCell>
            </DropdownContainer>
        );
    }

    renderInput = (): any => {
        return null;
    }

    render() {
        return this.renderBody();
    }
}